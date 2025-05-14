
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { File, FileText, FileJson, Folder, Terminal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToolsStore } from "@/store/toolsStore";

// File types and interfaces
type FileType = 'txt' | 'csv' | 'json' | 'py';

interface FileData {
  id: string;
  name: string;
  type: FileType;
  content: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string;
  verify: (files: FileData[], code: string, output: string) => { success: boolean; message: string };
  initialCode: string;
  completed: boolean;
}

const initialFiles: FileData[] = [
  {
    id: 'file1',
    name: 'sample',
    type: 'txt',
    content: 'This is a sample text file.\nIt has multiple lines.\nYou can read from it.'
  },
  {
    id: 'file2',
    name: 'data',
    type: 'csv',
    content: 'name,age,city\nJohn,24,New York\nSarah,32,Boston\nMike,28,Chicago'
  },
  {
    id: 'file3',
    name: 'config',
    type: 'json',
    content: '{\n  "appName": "File I/O Simulator",\n  "version": "1.0.0",\n  "settings": {\n    "darkMode": false,\n    "fontSize": 14\n  }\n}'
  },
  {
    id: 'file4',
    name: 'helper',
    type: 'py',
    content: '# Helper functions\n\ndef read_file(filename):\n    with open(filename, "r") as f:\n        return f.read()\n\ndef write_file(filename, content):\n    with open(filename, "w") as f:\n        f.write(content)'
  }
];

const initialChallenges: Challenge[] = [
  {
    id: 'challenge1',
    title: 'Read a File',
    description: 'Challenge 1: Read the contents of a file',
    instructions: 'Write Python code to read the contents of "sample.txt" and print them to the console.',
    initialCode: '# Open the file "sample.txt" for reading\n# Read its contents\n# Print the contents to the console',
    verify: (files, code, output) => {
      const sampleFile = files.find(f => f.name === 'sample' && f.type === 'txt');
      if (!sampleFile) return { success: false, message: 'Sample file not found!' };
      
      if (output.trim() === sampleFile.content.trim()) {
        return { success: true, message: 'Great job! You successfully read and printed the file contents.' };
      }
      return { success: false, message: 'The output does not match the file contents. Try again!' };
    },
    completed: false
  },
  {
    id: 'challenge2',
    title: 'Format Conversion',
    description: 'Challenge 2: Convert CSV to TXT',
    instructions: 'Read the "data.csv" file and write its contents to a new file "formatted_data.txt" with each field separated by tabs instead of commas.',
    initialCode: '# Read the data.csv file\n# Convert the commas to tabs\n# Write the result to formatted_data.txt',
    verify: (files, code, output) => {
      const dataFile = files.find(f => f.name === 'data' && f.type === 'csv');
      const formattedFile = files.find(f => f.name === 'formatted_data' && f.type === 'txt');
      
      if (!dataFile) return { success: false, message: 'Data CSV file not found!' };
      if (!formattedFile) return { success: false, message: 'No formatted_data.txt file was created.' };
      
      const csvContent = dataFile.content;
      const expectedOutput = csvContent.replace(/,/g, '\t');
      
      if (formattedFile.content.trim() === expectedOutput.trim()) {
        return { success: true, message: 'Well done! You successfully converted the CSV to tab-delimited format.' };
      }
      return { success: false, message: 'The conversion is not correct. Make sure to replace commas with tabs.' };
    },
    completed: false
  },
  {
    id: 'challenge3',
    title: 'JSON Creation',
    description: 'Challenge 3: Create a JSON file',
    instructions: 'Read the "data.csv" file, convert it to a JSON array of objects, and save it to "data.json".',
    initialCode: '# Read the data.csv file\n# Parse the CSV and convert to JSON format\n# Write the JSON to data.json',
    verify: (files, code, output) => {
      const dataFile = files.find(f => f.name === 'data' && f.type === 'csv');
      const jsonFile = files.find(f => f.name === 'data' && f.type === 'json');
      
      if (!dataFile) return { success: false, message: 'Data CSV file not found!' };
      if (!jsonFile) return { success: false, message: 'No data.json file was created.' };
      
      try {
        const csvContent = dataFile.content;
        const csvLines = csvContent.trim().split('\n');
        const headers = csvLines[0].split(',');
        
        // Check if the JSON is valid and has the correct structure
        const jsonContent = JSON.parse(jsonFile.content);
        
        if (!Array.isArray(jsonContent)) {
          return { success: false, message: 'The JSON file should contain an array of objects.' };
        }
        
        if (jsonContent.length !== csvLines.length - 1) {
          return { success: false, message: 'The JSON array should have one object per data row from the CSV.' };
        }
        
        // Check if all CSV rows were properly converted to JSON objects
        for (let i = 0; i < jsonContent.length; i++) {
          const csvRow = csvLines[i + 1].split(',');
          const jsonObj = jsonContent[i];
          
          for (let j = 0; j < headers.length; j++) {
            if (jsonObj[headers[j]] !== csvRow[j]) {
              return { success: false, message: 'The JSON objects do not match the CSV data correctly.' };
            }
          }
        }
        
        return { success: true, message: 'Excellent! You successfully converted the CSV data to JSON format.' };
      } catch (error) {
        return { success: false, message: 'The JSON file contains invalid JSON or has an incorrect structure.' };
      }
    },
    completed: false
  }
];

interface FileIOState {
  files: FileData[];
  activeFileId: string;
  codeInput: string;
  outputText: string;
  currentChallengeId: string | null;
  completedChallenges: string[];
}

const FileIOSimulation: React.FC = () => {
  // Get global state management functions from the store
  const { 
    fileIOState,
    updateFileIOState,
    initFileIO
  } = useToolsStore(state => ({
    fileIOState: state.fileIOState,
    updateFileIOState: state.updateFileIOState,
    initFileIO: state.initFileIO
  }));

  // Local state
  const [files, setFiles] = useState<FileData[]>(fileIOState?.files || initialFiles);
  const [activeFileId, setActiveFileId] = useState<string>(fileIOState?.activeFileId || files[0].id);
  const [codeInput, setCodeInput] = useState<string>(fileIOState?.codeInput || '# Open a file for reading\nwith open("sample.txt", "r") as file:\n    content = file.read()\n    print(content)');
  const [outputText, setOutputText] = useState<string>(fileIOState?.outputText || '');
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges.map(challenge => ({
    ...challenge,
    completed: fileIOState?.completedChallenges?.includes(challenge.id) || false
  })));
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    fileIOState?.currentChallengeId 
      ? challenges.find(c => c.id === fileIOState.currentChallengeId) || null
      : null
  );

  // Load state on component mount
  useEffect(() => {
    if (!fileIOState) {
      initFileIO();
    }
  }, [fileIOState, initFileIO]);

  // Save state when it changes
  useEffect(() => {
    updateFileIOState({
      files,
      activeFileId,
      codeInput,
      outputText,
      currentChallengeId: currentChallenge?.id || null,
      completedChallenges: challenges.filter(c => c.completed).map(c => c.id)
    });
  }, [files, activeFileId, codeInput, outputText, currentChallenge, challenges, updateFileIOState]);

  const activeFile = files.find(file => file.id === activeFileId) || files[0];

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'txt':
        return <FileText size={18} />;
      case 'csv':
        return <FileText size={18} />;
      case 'json':
        return <FileJson size={18} />;
      case 'py':
        return <File size={18} />;
      default:
        return <File size={18} />;
    }
  };

  // Python syntax highlighting helper
  const highlightPython = (code: string): React.ReactNode => {
    // Simple highlighting - colors keywords, strings, and comments
    const keywords = ['def', 'if', 'else', 'elif', 'for', 'while', 'in', 'return', 'with', 'as', 'open', 'print', 'import', 'from', 'class', 'try', 'except', 'finally', 'raise'];
    
    // Split by lines to maintain whitespace
    return code.split('\n').map((line, lineIndex) => {
      // Handle comments
      const commentMatch = line.match(/(#.*)$/);
      let processedLine = line;
      let comment = null;
      
      if (commentMatch) {
        comment = commentMatch[1];
        processedLine = line.substring(0, commentMatch.index);
      }

      // Process the line
      const parts: React.ReactNode[] = [];
      let currentIndex = 0;
      
      // Handle strings
      const stringRegex = /(['"])(?:(?=(\\?))\2.)*?\1/g;
      let stringMatch;
      
      while ((stringMatch = stringRegex.exec(processedLine)) !== null) {
        // Add text before the string
        if (stringMatch.index > currentIndex) {
          parts.push(
            <span key={`${lineIndex}-${currentIndex}-text`}>
              {processTokens(processedLine.substring(currentIndex, stringMatch.index), keywords)}
            </span>
          );
        }
        
        // Add the string
        parts.push(
          <span key={`${lineIndex}-${stringMatch.index}-string`} className="text-green-500">
            {stringMatch[0]}
          </span>
        );
        
        currentIndex = stringMatch.index + stringMatch[0].length;
      }
      
      // Add remaining text
      if (currentIndex < processedLine.length) {
        parts.push(
          <span key={`${lineIndex}-${currentIndex}-text`}>
            {processTokens(processedLine.substring(currentIndex), keywords)}
          </span>
        );
      }
      
      // Add comment if exists
      if (comment) {
        parts.push(
          <span key={`${lineIndex}-comment`} className="text-gray-500">
            {comment}
          </span>
        );
      }
      
      return (
        <div key={lineIndex} className="whitespace-pre">
          {parts}
        </div>
      );
    });
  };

  // Helper function to process tokens
  const processTokens = (text: string, keywords: string[]): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const tokens = text.split(/(\s+|[^\w\s]+)/g);
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (keywords.includes(token)) {
        parts.push(
          <span key={`token-${i}`} className="text-blue-500">
            {token}
          </span>
        );
      } else if (/^\d+$/.test(token)) {
        parts.push(
          <span key={`token-${i}`} className="text-yellow-500">
            {token}
          </span>
        );
      } else {
        parts.push(token);
      }
    }
    
    return parts;
  };

  const executeCode = () => {
    // Reset output
    setOutputText('');
    
    // Simple simulation of Python file I/O operations
    let output = '';
    let fileSystem = [...files];
    
    try {
      // Parse the code to simulate file operations
      const code = codeInput;
      
      // Simulate open file operations
      const openRegex = /open\(['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\)/g;
      let match;
      
      while ((match = openRegex.exec(code)) !== null) {
        const filename = match[1];
        const mode = match[2];
        
        // Extract file name and extension
        const parts = filename.split('.');
        const name = parts[0];
        const type = parts.length > 1 ? parts[1] as FileType : 'txt';
        
        if (mode.includes('r')) {
          // Reading a file
          const file = fileSystem.find(f => f.name === name && f.type === type);
          if (!file) {
            throw new Error(`File not found: ${filename}`);
          }
          
          // Simulating file read operations
          if (code.includes(`${match[0]}.read()`)) {
            // Find what variable is assigned to the read content
            const readRegex = new RegExp(`(\\w+)\\s*=\\s*${match[0]}\\.read\\(\\)`);
            const readMatch = readRegex.exec(code);
            
            if (readMatch) {
              const varName = readMatch[1];
              // If print statement uses this variable
              if (code.includes(`print(${varName})`)) {
                output += file.content + '\n';
              }
            }
          }
          
          // Other file read operations could be simulated here
        }
        
        if (mode.includes('w')) {
          // Writing to a file
          const writeRegex = new RegExp(`${match[0]}\\.write\\(([^)]+)\\)`);
          const writeMatch = writeRegex.exec(code);
          
          if (writeMatch) {
            // Try to determine what's being written
            let content = '';
            
            // Very basic variable tracking
            const varAssignments: Record<string, string> = {};
            const varRegex = /(\w+)\s*=\s*([^;\n]+)/g;
            let varMatch;
            
            while ((varMatch = varRegex.exec(code)) !== null) {
              const varName = varMatch[1];
              const varValue = varMatch[2].trim();
              
              // Very simplistic variable resolution
              if (varValue.startsWith('"') || varValue.startsWith("'")) {
                // It's a string literal
                varAssignments[varName] = varValue.substring(1, varValue.length - 1);
              } else if (varValue.includes('.replace(')) {
                // Handle simple replace operations
                const replaceRegex = /(.+)\.replace\(['"](.+)['"]\s*,\s*['"](.+)['"]\)/;
                const replaceMatch = replaceRegex.exec(varValue);
                
                if (replaceMatch) {
                  const sourceVar = replaceMatch[1].trim();
                  const searchStr = replaceMatch[2];
                  const replaceStr = replaceMatch[3];
                  
                  if (varAssignments[sourceVar]) {
                    varAssignments[varName] = varAssignments[sourceVar].replace(
                      new RegExp(searchStr, 'g'),
                      replaceStr
                    );
                  }
                }
              }
            }
            
            // Get the content being written
            const contentVar = writeMatch[1].trim();
            
            if (varAssignments[contentVar]) {
              content = varAssignments[contentVar];
            } else if (contentVar.startsWith('"') || contentVar.startsWith("'")) {
              content = contentVar.substring(1, contentVar.length - 1);
            }
            
            // Create or update the file
            const existingFileIndex = fileSystem.findIndex(f => f.name === name && f.type === type);
            
            if (existingFileIndex >= 0) {
              // Update existing file
              fileSystem[existingFileIndex] = {
                ...fileSystem[existingFileIndex],
                content
              };
            } else {
              // Create new file
              fileSystem.push({
                id: `file${Date.now()}`,
                name,
                type,
                content
              });
            }
          }
        }
      }
      
      // Basic print simulation
      const printRegex = /print\(([^)]+)\)/g;
      let printMatch;
      
      while ((printMatch = printRegex.exec(code)) !== null) {
        const printArg = printMatch[1].trim();
        
        // Very basic variable resolution
        const varAssignments: Record<string, string> = {};
        const varRegex = /(\w+)\s*=\s*([^;\n]+)/g;
        let varMatch;
        
        while ((varMatch = varRegex.exec(code)) !== null) {
          varAssignments[varMatch[1]] = varMatch[2].trim();
        }
        
        if (varAssignments[printArg]) {
          // It's a variable, try to resolve its value
          let varValue = varAssignments[printArg];
          
          // Check if the variable is a file content
          if (varValue.includes('.read()')) {
            // The variable contains file content
            const fileReadRegex = /open\(['"]([^'"]+)['"]\s*,\s*['"]r['"]\)/g.exec(code);
            if (fileReadRegex) {
              const filename = fileReadRegex[1];
              const parts = filename.split('.');
              const name = parts[0];
              const type = parts.length > 1 ? parts[1] as FileType : 'txt';
              
              const file = fileSystem.find(f => f.name === name && f.type === type);
              if (file) {
                output += file.content + '\n';
              }
            }
          }
        } else if (printArg.startsWith('"') || printArg.startsWith("'")) {
          // It's a string literal
          output += printArg.substring(1, printArg.length - 1) + '\n';
        }
      }
      
      // Update the file system
      setFiles(fileSystem);
      
      // Update the output
      setOutputText(output);
      
      // Check if a challenge is active and verify it
      if (currentChallenge) {
        const verification = currentChallenge.verify(fileSystem, codeInput, output);
        
        if (verification.success) {
          toast.success(verification.message);
          
          // Mark challenge as completed
          setChallenges(prevChallenges => 
            prevChallenges.map(c => 
              c.id === currentChallenge.id ? { ...c, completed: true } : c
            )
          );
          setCurrentChallenge(prev => prev ? { ...prev, completed: true } : null);
        } else {
          toast.error(verification.message);
        }
      }
      
    } catch (error) {
      setOutputText(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const startChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setCodeInput(challenge.initialCode);
    setOutputText('');
  };

  const resetChallenge = () => {
    if (currentChallenge) {
      setCodeInput(currentChallenge.initialCode);
      setOutputText('');
    }
  };

  const resetTool = () => {
    setFiles(initialFiles);
    setActiveFileId(initialFiles[0].id);
    setCodeInput('# Open a file for reading\nwith open("sample.txt", "r") as file:\n    content = file.read()\n    print(content)');
    setOutputText('');
    setChallenges(initialChallenges);
    setCurrentChallenge(null);
    toast.success("File I/O simulation has been reset.");
  };

  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">File I/O Simulation</h1>
        <Button onClick={resetTool} variant="outline" size="sm" className="flex items-center gap-1">
          <RotateCcw size={16} />
          Reset Tool
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: File Explorer and Challenges */}
        <div className="lg:col-span-3 space-y-6">
          {/* File Explorer */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Folder className="mr-2" size={18} />
                <span>File Explorer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-1 pr-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className={cn(
                        "flex items-center space-x-2 rounded-md px-2 py-2 cursor-pointer hover:bg-gray-100 transition-colors",
                        activeFileId === file.id ? "bg-gray-100 border-l-4 border-blue-500" : ""
                      )}
                      onClick={() => setActiveFileId(file.id)}
                    >
                      {getFileIcon(file.type)}
                      <span className="text-sm">{file.name}.{file.type}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          
          {/* Challenges Section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={challenges.find(c => c.id === currentChallenge?.id)?.id || "challenge1"}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="challenge1">1</TabsTrigger>
                  <TabsTrigger value="challenge2">2</TabsTrigger>
                  <TabsTrigger value="challenge3">3</TabsTrigger>
                </TabsList>
                
                {challenges.map((challenge) => (
                  <TabsContent key={challenge.id} value={challenge.id} className="space-y-3">
                    <h3 className="text-md font-semibold">{challenge.title}</h3>
                    <p className="text-sm text-gray-600">{challenge.instructions}</p>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => startChallenge(challenge)}
                        className={cn(
                          "text-xs",
                          challenge.completed ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                        )}
                        size="sm"
                      >
                        {challenge.completed ? "Completed ✓" : "Start"}
                      </Button>
                      {currentChallenge?.id === challenge.id && (
                        <Button 
                          onClick={resetChallenge} 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Panel: Code Editor, File Viewer, Console Output */}
        <div className="lg:col-span-9 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Editor */}
            <Card className="lg:row-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <File className="mr-2" size={18} />
                  Python Code Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-[#282c34] rounded-md overflow-hidden">
                  <div className="flex items-center justify-between bg-[#21252b] px-4 py-2 border-b border-gray-700">
                    <div className="text-xs font-mono text-gray-400">main.py</div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      className="font-mono p-4 bg-transparent w-full h-[300px] absolute top-0 left-0 text-transparent caret-white z-10 outline-none resize-none"
                      spellCheck="false"
                    />
                    <div className="font-mono p-4 overflow-auto whitespace-pre-wrap text-white h-[300px] pointer-events-none">
                      {highlightPython(codeInput)}
                    </div>
                  </div>
                </div>
                <Button onClick={executeCode} className="w-full bg-green-600 hover:bg-green-700">
                  Run Code
                </Button>
              </CardContent>
            </Card>
        
            {/* File Viewer */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  {getFileIcon(activeFile.type)}
                  <span className="ml-2">{activeFile.name}.{activeFile.type}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[180px] border rounded-md p-2 bg-gray-50">
                  <pre className="font-mono text-sm whitespace-pre-wrap">
                    {activeFile.content}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Console Output */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Terminal className="mr-2" size={18} />
                  <span>Console Output</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[180px] border rounded-md p-2 bg-black text-green-400">
                  <pre className="font-mono text-sm">
                    {outputText || '# Output will appear here after running your code'}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileIOSimulation;
