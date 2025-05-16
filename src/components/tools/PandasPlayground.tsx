import React, { useState, useEffect, useRef } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-python";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const initialCode = `# Simple grades dataset
grades = {'Alice': 85, 'Bob': 92, 'Charlie': 78, 'Diana': 88}
print("Original mapping (Student -> Grade):")
print(grades)

# Challenge 1: swap keys and values
swapped = {v:k for k,v in grades.items()}
print("\nSwapped mapping (Grade -> Student):")
print(swapped)

# Challenge 2: plot grades
import matplotlib.pyplot as plt
import pandas as pd
df = pd.DataFrame(list(grades.items()), columns=['Student','Grade'])
df.plot(kind='bar', x='Student', y='Grade')
plt.title("Class Grades")
`;

const PandasPlayground: React.FC = () => {
  const [pyodide, setPyodide] = useState<any>(null);
  const editorRef = useRef<any>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    (async () => {
      const py = await (window as any).loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/" });
      await py.loadPackage(["pandas", "matplotlib"]);
      setPyodide(py);
    })();
  }, []);

  const runCode = async () => {
    if (!pyodide) return;
    setRunning(true);
    const outEl = document.getElementById("pandas-output");
    const imgEl = document.getElementById("pandas-plot") as HTMLImageElement;
    if (outEl) outEl.textContent = "";
    if (imgEl) imgEl.src = "";

    const userCode = editorRef.current.editor.getValue();
    const wrapped = `
import sys
from io import StringIO, BytesIO
from js import document
import pandas as pd
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
import base64

buf = StringIO()
sys.stdout = buf

${userCode}

sys.stdout = sys.__stdout__
document.getElementById("pandas-output").textContent = buf.getvalue()

img_buf = BytesIO()
plt.savefig(img_buf, format='png')
img_buf.seek(0)
data = base64.b64encode(img_buf.read()).decode('ascii')
document.getElementById("pandas-plot").src = 'data:image/png;base64,' + data
`;
    try {
      await pyodide.runPythonAsync(wrapped);
    } catch (e: any) {
      if (outEl) outEl.textContent = String(e);
    }
    setRunning(false);
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle>Pandas & Matplotlib Playground</CardTitle>
        </CardHeader>
        <CardContent>
          <AceEditor
            mode="python"
            theme="github"
            name="pandas-playground-editor"
            onLoad={(editor) => (editorRef.current = editor)}
            value={initialCode}
            fontSize={14}
            width="100%"
            height="250px"
            showPrintMargin={false}
            setOptions={{ useWorker: false }}
          />
          <Button className="mt-2" onClick={runCode} disabled={!pyodide || running}>
            {running ? "Running..." : "Run Code"}
          </Button>
          <div className="mt-4">
            <div className="text-sm font-semibold mb-1">Output:</div>
            <pre id="pandas-output" className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap"></pre>
          </div>
          <div className="mt-4">
            <div className="text-sm font-semibold mb-1">Plot:</div>
            <img id="pandas-plot" alt="Matplotlib plot" className="w-full border rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PandasPlayground;
