import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github_light_default';
import 'ace-builds/src-noconflict/mode-python';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Folder, FileText, FileJson, File, Terminal } from 'lucide-react';
import fileIOFilesData from '@/data/fileIOSimulationFiles.json';

interface FileData { name: string; content: string; }
interface Challenge { id: string; title: string; initialCode: string; verify: (files: FileData[], output: string) => { success: boolean; message: string }; completed: boolean; }

const initialChallenges: Challenge[] = [
  { id: 'c1', title: 'Read File', initialCode: 'with open("sample.txt","r") as f:\n    print(f.read())', completed: false,
    verify: (files, output) => {
      const f = files.find(f => f.name === 'sample.txt');
      if (!f) return { success: false, message: 'sample.txt missing' };
      return output.trim() === f.content.trim()
        ? { success: true, message: '✔ Read sample.txt successfully!' }
        : { success: false, message: 'Output does not match sample.txt content.' };
    }
  },
  { id: 'c2', title: 'Copy CSV', initialCode: 'with open("data.csv","r") as r:\n    data=r.read()\nwith open("copy.csv","w") as w:\n    w.write(data)', completed: false,
    verify: (files) => {
      const orig = files.find(f => f.name === 'data.csv');
      const copy = files.find(f => f.name === 'copy.csv');
      if (!orig) return { success: false, message: 'data.csv missing' };
      if (!copy) return { success: false, message: 'copy.csv not created' };
      return copy.content === orig.content
        ? { success: true, message: '✔ copy.csv matches data.csv!' }
        : { success: false, message: 'copy.csv content differs.' };
    }
  }
];

const FileIOSimulation: React.FC = () => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [files, setFiles] = useState<FileData[]>(fileIOFilesData as FileData[]);
  const [activeFile, setActiveFile] = useState<string>(fileIOFilesData[0].name);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [code, setCode] = useState<string>(initialChallenges[0].initialCode);
  const [output, setOutput] = useState<string>('');

  // Load Pyodide
  useEffect(() => {
    (async () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
      script.onload = async () => {
        const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
        setPyodide(py);
      };
      document.body.appendChild(script);
    })();
  }, []);

  // Sync JS files to Pyodide FS
  const syncFS = () => {
    if (!pyodide) return;
    const FS = pyodide.FS;
    try { FS.unlinkTree('/home'); } catch {};
    FS.mkdir('/home');
    FS.chdir('/home');
    files.forEach(f => FS.writeFile(f.name, f.content));
  };

  // Run code in Pyodide and capture file state
  const runCode = async () => {
    if (!pyodide) return;
    setOutput('');
    syncFS();
    const harness = `import sys, json, os
from io import StringIO
buf=StringIO()
sys.stdout=buf
try:
${code.split('\n').map(l => '    ' + l).join('\n')}
except Exception as e:
    print(e)
sys.stdout=sys.__stdout__
res={'output':buf.getvalue(),'files':{}}
for fn in os.listdir('.'):
    if fn.endswith(('.txt','.csv','.json')):
        with open(fn) as f: res['files'][fn]=f.read()
print(json.dumps(res))`;
    try {
      const raw = await pyodide.runPythonAsync(harness);
      const { output: out, files: newFs } = JSON.parse(raw as string);
      setOutput(out);
      const updated: FileData[] = Object.entries(newFs).map(([name, content]) => ({ name, content: String(content) }));
      setFiles(updated);
      // verify challenge
      const ch = challenges[currentIdx];
      const result = ch.verify(updated, out);
      if (result.success) {
        toast.success(result.message);
        setChallenges(cs => cs.map((c, i) => i === currentIdx ? { ...c, completed: true } : c));
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      setOutput(err.message || String(err));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">File I/O Simulation</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* File Explorer */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader><CardTitle><Folder className="inline"/> Files</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                {files.map(f => (
                  <div key={f.name} className={`p-2 cursor-pointer ${activeFile === f.name ? 'bg-gray-100' : ''}`} onClick={() => setActiveFile(f.name)}>
                    {f.name}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        {/* Main Panel */}
        <div className="lg:col-span-9 space-y-4">
          {/* File Viewer */}
          <Card>
            <CardHeader><CardTitle>Viewing: {activeFile}</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="h-32 bg-gray-50 p-2">
                <pre className="whitespace-pre-wrap font-mono text-sm">{files.find(f => f.name === activeFile)?.content}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
          {/* Code Editor */}
          <Card>
            <CardHeader><CardTitle>Python Code</CardTitle></CardHeader>
            <CardContent>
              <AceEditor mode="python" theme="github_light_default" value={code} onChange={setCode} width="100%" height="200px" setOptions={{ useWorker: false }} />
            </CardContent>
            <CardFooter>
              <Button onClick={runCode} className="bg-green-600 hover:bg-green-700">Run Code</Button>
            </CardFooter>
          </Card>
          {/* Output Console */}
          <Card>
            <CardHeader><CardTitle><Terminal className="inline"/> Output</CardTitle></CardHeader>
            <CardContent>
              <ScrollArea className="h-32 bg-black text-green-400 p-2">
                <pre className="whitespace-pre-wrap font-mono text-sm">{output || '# Run code to see output'}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
          {/* Challenges */}
          <Card>
            <CardHeader><CardTitle>Challenges</CardTitle></CardHeader>
            <CardContent>
              <Tabs value={challenges[currentIdx].id} onValueChange={val => {
                const idx = challenges.findIndex(c => c.id === val);
                setCurrentIdx(idx);
                setCode(challenges[idx].initialCode);
                setOutput('');
              }}>
                <TabsList className="grid grid-cols-2 mb-2">
                  {challenges.map(c => (
                    <TabsTrigger key={c.id} value={c.id}>{c.title}{c.completed ? ' ✔' : ''}</TabsTrigger>
                  ))}
                </TabsList>
                {challenges.map(c => (
                  <TabsContent key={c.id} value={c.id} className="p-2">
                    <pre className="font-mono text-sm whitespace-pre-wrap">{c.initialCode}</pre>
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
