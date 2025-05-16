import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github_light_default';

interface LineAnalysis {
  line: string;
  time: string;
  space: string;
}

const ComplexityCalc: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [analysis, setAnalysis] = useState<LineAnalysis[]>([]);
  const [timeComplexity, setTimeComplexity] = useState<string>('');
  const [spaceComplexity, setSpaceComplexity] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://api.example.com/complexity', { // Replace with your API endpoint SOOOONNNN
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const data = await response.json();
      setTimeComplexity(data.timeComplexity);
      setSpaceComplexity(data.spaceComplexity);
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Complexity Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <AceEditor
          mode="python"
          theme="github_light_default"
          name="complexity-editor"
          onChange={setCode}
          value={code}
          fontSize={14}
          width="100%"
          height="200px"
          setOptions={{ useWorker: false, maxLines: Infinity }}
        />
        {error && <p className="mt-2 text-red-600">{error}</p>}
        {!error && analysis.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">Overall Complexity</h3>
            <p>Time: <strong>{timeComplexity}</strong></p>
            <p>Space: <strong>{spaceComplexity}</strong></p>
            <h4 className="mt-4 font-medium">Line by Line Analysis</h4>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.map((a, idx) => (
                <li key={idx}>
                  <code className="block whitespace-pre-wrap">{a.line}</code>
                  <span className="text-sm text-gray-700">Time: {a.time}, Space: {a.space}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyze} disabled={loading || !code.trim()}>
          {loading ? 'Analyzing...' : 'Calculate Complexity'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ComplexityCalc;
