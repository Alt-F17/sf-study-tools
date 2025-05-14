import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { File, FileText, FileJson, Folder, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

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

const FileIOSimulation: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([
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
  ]);
  
  const [activeFileId, setActiveFileId] = useState<string>(files[0].id);
  const [pointerPosition, setPointerPosition] = useState<number>(0);
  const [codeInput, setCodeInput] = useState<string>('# Open a file for reading\nwith open("sample.txt", "r") as file:\n    content = file.read()\n    print(content)');
  const [outputText, setOutputText] = useState<string>('');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);

  const challenges: Challenge[] = [
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
            const fileReadRegex = /open\(['"]([^'"]+)['"]\s*,\s*['"]r['"]/).exec(code);
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
          setCurrentChallenge({
            ...currentChallenge,
            completed: true
          });
        } else {
          toast.error(verification.message);
        }
      }
      
    } catch (error) {
      setOutputText(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const createNewFile = () => {
    const newFileName = `new_file_${files.length + 1}`;
    const newFile: FileData = {
      id: `file${Date.now()}`,
      name: newFileName,
      type: 'txt',
      content: ''
    };
    
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
    toast.success(`Created new file: ${newFileName}.txt`);
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">File I/O Simulation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Explorer */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="mr-2" size={18} />
              <span>File Explorer</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-1">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={cn(
                      "flex items-center space-x-2 rounded-md px-2 py-2 cursor-pointer hover:bg-gray-100",
                      activeFileId === file.id ? "bg-gray-100" : ""
                    )}
                    onClick={() => setActiveFileId(file.id)}
                  >
                    {getFileIcon(file.type)}
                    <span>{file.name}.{file.type}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button onClick={createNewFile} variant="outline" className="w-full">
              Create New File
            </Button>
          </CardFooter>
        </Card>
        
        {/* Main Content */}
        <div className="lg:col-span-9 space-y-4">
          {/* Code Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Python Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-[#1e1e1e] rounded-md text-white">
                <textarea
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="font-mono p-4 bg-transparent w-full h-[250px] outline-none resize-none"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={executeCode} className="bg-green-600 hover:bg-green-700">
                Run Code
              </Button>
              {currentChallenge && (
                <Button onClick={resetChallenge} variant="outline">
                  Reset Code
                </Button>
              )}
            </CardFooter>
          </Card>
          
          {/* File Viewer and Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Viewer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {getFileIcon(activeFile.type)}
                  <span className="ml-2">{activeFile.name}.{activeFile.type}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] border rounded-md p-2 bg-gray-50">
                  <pre className="font-mono text-sm whitespace-pre-wrap">
                    {activeFile.content}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
            
            {/* Console Output */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="mr-2" size={18} />
                  <span>Console Output</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px] border rounded-md p-2 bg-black text-green-400">
                  <pre className="font-mono text-sm">
                    {outputText || '# Output will appear here after running your code'}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Challenges Section */}
          <Card>
            <CardHeader>
              <CardTitle>Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="challenge1">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="challenge1">Challenge 1</TabsTrigger>
                  <TabsTrigger value="challenge2">Challenge 2</TabsTrigger>
                  <TabsTrigger value="challenge3">Challenge 3</TabsTrigger>
                </TabsList>
                
                {challenges.map((challenge) => (
                  <TabsContent key={challenge.id} value={challenge.id}>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{challenge.title}</h3>
                      <p>{challenge.instructions}</p>
                      <Button 
                        onClick={() => startChallenge(challenge)}
                        className={cn(
                          "mt-2",
                          challenge.completed ? "bg-green-600" : "bg-blue-600"
                        )}
                      >
                        {challenge.completed ? "Completed ✓" : "Start Challenge"}
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FileIOSimulation;
