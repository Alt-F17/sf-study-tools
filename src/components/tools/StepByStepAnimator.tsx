import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github_light_default";
import "ace-builds/src-noconflict/mode-python";
import { Code } from "lucide-react";

const StepByStepAnimator: React.FC = () => {
  const [code, setCode] = useState<string>(
`# Type or paste your Python code here
x = 5
y = 10
z = x + y
print(z)`
  );
  const [pythonTutorUrl, setPythonTutorUrl] = useState<string>("");

  const generatePythonTutorUrl = () => {
    const encodedCode = encodeURIComponent(code);
    const pythonTutorLink = `https://pythontutor.com/iframe-embed.html#code=${encodedCode}&cumulative=false&py=3&curInstr=0`;
    setPythonTutorUrl(pythonTutorLink);
  };

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code size={20} />
            Python Code Visualizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 text-white p-1 rounded-md">
            <div className="flex items-center justify-between p-2 border-b border-gray-300 mb-2">
              <div className="text-sm font-mono text-gray-700">main.py</div>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={generatePythonTutorUrl}
              >
                Visualize Code
              </Button>
            </div>
            <AceEditor
              mode="python"
              theme="github_light_default"
              name="step-by-step-editor"
              onChange={setCode}
              value={code}
              fontSize={14}
              width="100%"
              showPrintMargin={false}
              setOptions={{ useWorker: false, maxLines: Infinity }}
            />
          </div>
          
          {pythonTutorUrl && (
            <div className="mt-4">
              <div className="text-xl font-semibold mb-2">Visualization</div>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <iframe
                  key={pythonTutorUrl}
                  src={pythonTutorUrl}
                  width="100%"
                  height="500"
                  frameBorder="0"
                  title="Python Tutor Visualization"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepByStepAnimator;
