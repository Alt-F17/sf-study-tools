import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-github_light_default';
import 'ace-builds/src-noconflict/mode-python';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const initialCode = `# Read grades.csv from Pyodide filesystem
import pandas as pd
import matplotlib.pyplot as plt

# Load DataFrame
print('DataFrame loaded from grades.csv:')
df = pd.read_csv('grades.csv')
print(df)

# Challenge 1: swap keys and values
swapped = dict(zip(df['Grade'], df['Student']))
print('\\nSwapped mapping (Grade -> Student):')
print(swapped)

# Challenge 2: plot grades
df.plot(kind='bar', x='Student', y='Grade')
plt.title('Class Grades')
`;

const PandasPlayground: React.FC = () => {
  const [pyodide, setPyodide] = useState<any>(null);
  const [code, setCode] = useState<string>(initialCode);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [plotSrc, setPlotSrc] = useState<string>('');

  useEffect(() => {
    const initPy = async () => {
      // Load Pyodide and required packages
      let py;
      if (!(window as any).loadPyodide) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }
      py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
      await py.loadPackage(['pandas','matplotlib']);
      // Write grades.csv into Pyodide FS
      try {
        const res = await fetch('/grades.csv');
        const csvText = await res.text();
        py.FS.writeFile('grades.csv', csvText);
      } catch {
        /* ignore fetch errors */
      }
      setPyodide(py);
    };
    initPy();
  }, []);

  const runCode = async () => {
    if (!pyodide) return;
    setRunning(true);
    setOutput('');
    setPlotSrc('');
    const harnessStart = [
      'import sys, json',
      'from io import StringIO, BytesIO',
      'import pandas as pd',
      'import matplotlib',
      'matplotlib.use("AGG")',
      'import matplotlib.pyplot as plt',
      'buf = StringIO()',
      'sys.stdout = buf',
    ];
    const codeLines = code.split(/\r?\n/);
    const harnessEnd = [
      'sys.stdout = sys.__stdout__',
      'text = buf.getvalue()',
      'buf2 = BytesIO()',
      'plt.tight_layout()',
      'plt.savefig(buf2, format="png")',
      'buf2.seek(0)',
      'import base64',
      'img = base64.b64encode(buf2.read()).decode("ascii")',
      'json.dumps({"output": text, "plot": img})',
    ];
    const wrapped = [...harnessStart, ...codeLines, ...harnessEnd].join('\n');
    try {
      const result = await pyodide.runPythonAsync(wrapped);
      const { output: out, plot: img } = JSON.parse(result as string);
      setOutput(out);
      if (img) setPlotSrc('data:image/png;base64,' + img);
    } catch (err: any) {
      setOutput(err.message || String(err));
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
      <Card>
        <CardHeader><CardTitle>Pandas & Matplotlib Playground</CardTitle></CardHeader>
        <CardContent>
          {/* Preview of CSV file */}
          <div className="mb-4">
            <div className="text-sm font-semibold mb-1">grades.csv (as DataFrame)</div>
            <pre className="bg-gray-50 p-2 rounded text-sm whitespace-pre-wrap">
            {`   `}<u>{`Student`}</u>{`       `}<u>{`Grade`}</u>{`
0  Alice         85
1  Bob           92
2  Charlie       78
3  Diana         88`}
            </pre>
          </div>
          <AceEditor
            mode="python"
            theme="github_light_default"
            name="pandas-playground-editor"
            onChange={setCode}
            value={code}
            fontSize={14}
            width="100%"
            height="250px"
            setOptions={{ useWorker: false, maxLines: Infinity }}
          />
          <Button className="mt-2" onClick={runCode} disabled={!pyodide || running}>
            {running ? 'Running...' : 'Run Code'}
          </Button>
          <div className="mt-4">
            <div className="text-sm font-semibold mb-1">Output:</div>
            <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{output}</pre>
          </div>
          {plotSrc && (
            <div className="mt-4">
              <div className="text-sm font-semibold mb-1">Plot:</div>
              <img src={plotSrc} alt="Matplotlib plot" className="w-full border rounded" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PandasPlayground;
