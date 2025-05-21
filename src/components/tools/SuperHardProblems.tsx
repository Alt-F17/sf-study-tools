import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github_light_default";
import "ace-builds/src-noconflict/mode-python";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TestResult {
  test: string;
  pass: boolean;
  input?: any;
  expected?: any;
  got?: any;
  error?: string;
}

interface Problem {
  id: number;
  title: string;
  description: string;
  defaultCode: string;
  testScript: (userCode: string) => string;
}

const problems: Problem[] = [
  {
    id: 1,
    title: "Problem 1: The Galactic Explorer's Map",
    description: "<b>Here is a list of tasks you'll need to complete:</b><br />1. Galaxy and Planet Classes:<br /> - Define a base class   <tt>CelestialBody</tt>   with attributes name and position (x, y coordinates).<br /> - Create subclasses Star and Planet that inherit from   <tt>CelestialBody</tt>  . Star should have an attribute temperature, and Planet should have attributes gravity and moons (a list of moon names).<br /> - Implement a method describe() in each class to print a description of the celestial body.<br /> - Use polymorphism to call describe() on a list of celestial bodies.<br />2. Galaxy Class:<br /> - Define a class Galaxy that contains a list of <tt>CelestialBody</tt> objects.<br /> - Implement a method find_planet(name) that recursively searches for a planet by name in the galaxy (assuming planets can have moons, which are also celestial bodies).<br /> - Make Galaxy iterable so you can loop through its celestial bodies.<br />3. Navigation Stack:<br /> - Implement a NavigationStack class with methods: push(location), pop(), top(), is_empty(), len(), and repr(). pop() and top() should raise IndexError if the stack is empty.<br /> - Use this stack to simulate a pathfinding journey: start from a star, visit planets, and return to the star.",
    defaultCode: `# WIP`,
    testScript: (userCode) => `${userCode}
import micropip
await micropip.install('pandas')
import pandas as pd, json, os
# Prepare sample sales_data.csv
csv_text = """
date,product,quantity,price
2023-01-01,Widget A,10,5.0
2023-01-01,Widget B,5,10.0
2023-01-02,Widget A,15,5.0
2023-01-02,Widget C,20,2.0
"""
with open('sales_data.csv', 'w') as f:
    f.write(csv_text)
results = []
# Test file existence
exists = os.path.exists('sales_data.csv')
results.append({"test":"file_exists","input":"sales_data.csv","expected":True,"got":exists,"pass":exists==True})
# Test top products
try:
    df = pd.read_csv('sales_data.csv')
    df = df.dropna()
    df['total'] = df['quantity'] * df['price']
    totals = df.groupby('product')['total'].sum().sort_values(ascending=False)
    got = list(totals.index)
    expected = ["Widget A", "Widget B", "Widget C"]
    results.append({"test":"top_products","input":"all","expected":expected,"got":got,"pass":got[:3]==expected})
except Exception as e:
    results.append({"test":"top_products","input":"all","expected":expected,"got":str(e),"pass":False,"error":str(e)})
json.dumps(results)
`,
  },
  {
    id: 2,
    title: "Problem 2: Custom Data Structures",
    description: `Create an abstract base class DataStructure with methods add, remove, is_empty, and make it iterable. Implement Stack (LIFO) and Queue (FIFO). Write process_data(ds, elements) to add elements and remove/print them. Demonstrate polymorphism.`,
    defaultCode: `# WIP`,
    testScript: (userCode) => `${userCode}
import json
results = []
input_data = [1,2,3]
results.append({"test":"Stack LIFO","input":input_data,"expected":[3,2,1],"got":"cheese"})
results.append({"test":"Queue FIFO","input":input_data,"expected":[1,2,3],"got":"cheese"})
json.dumps(results)
`,
  },
  {
    id: 3,
    title: "Problem 3: Maze Solver",
    description: `Write a recursive function to find a path through a maze (2D list) from (0,0) to (n-1,m-1) using backtracking. Return the path as list of coords.`,
    defaultCode: `# WIP`,
    testScript: (userCode) => `${userCode}
import json
results = []
maze = [[0,1,0,0],[0,0,0,1],[1,1,0,0],[0,0,0,0]]
expected_path = [(0,0),(1,0),(1,1),(1,2),(2,2),(3,2),(3,3)]
path = find_path(maze)
results.append({"test":"find_path","input":maze,"expected":expected_path,"got":path})
json.dumps(results)
`,
  },
  {
    id: 4,
    title: "Problem 4: Student Grades Analysis",
    description: `Extract students with at least one grade above 90, list all unique subjects, create dict mapping subjects to students scoring >85.`,
    defaultCode: `# WIP`,
    testScript: (userCode) => `${userCode}
import json
results = []
input_data = students
expected_high = ["Alice", "Bob"]
results.append({"test":"high_scorers","input": input_data, "expected": expected_high, "got": high_scorers, "pass": high_scorers==expected_high})
expected_subjects = sorted(list(all_subjects))
results.append({"test":"subjects","input": input_data, "expected": expected_subjects, "got": sorted(list(all_subjects)), "pass": sorted(list(all_subjects))==expected_subjects})
json.dumps(results)
`,
  },
  {
    id: 5,
    title: "Problem 5: Debugging and Error Handling",
    description: `Fix script that reads integers from data.txt to handle file not found, invalid data, division by zero.`,
    defaultCode: `# WIP`,
    testScript: (userCode) => `${userCode}
import json, os
# Prepare data.txt
lines=["10","abc","20"]
with open('data.txt','w') as f: f.write("10\nabc\n20\n")
results = []
exists = os.path.exists('data.txt')
results.append({"test":"file_exists","input": lines, "expected": True, "got": exists, "pass": exists==True})
json.dumps(results)
`,
  },
  {
    id: 6,
    title: "Problem 6: Custom Class with Operators and Iteration",
    description: `Define Point with x,y tuple; implement __repr__, __eq__, __lt__ (by distance), iterable, use total_ordering. Sort list of points.`,
    defaultCode: `# WIP`,
    testScript: (userCode) => `${userCode}
import json
results = []
input_points = [(3,4),(1,2),(0,0)]
pts = [Point(x,y) for x,y in input_points]
got = [repr(p) for p in sorted(pts)]
expected = ["Point(0,0)","Point(1,2)","Point(3,4)"]
results.append({"test":"sorted_points","input": input_points, "expected": expected, "got": got, "pass": got==expected})
json.dumps(results)
`,
  },
  {
    id: 7,
    title: "Problem 7: Sorted List with Bisect",
    description: `Use bisect.insort to maintain sorted list from given numbers, then extract even numbers via list comprehension.`,
    defaultCode: `# WIP`,
    testScript: (userCode) => `${userCode}
import json
results = []
input_nums = [5,3,8,6,2,7,1]
got = even
expected = [2,6,8]
results.append({"test":"even_numbers","input": input_nums, "expected": expected, "got": got, "pass": got==expected})
json.dumps(results)
`,
  },
  {
    id: 8,
    title: "Problem 8: Multiple Inheritance",
    description: `Define Flyer.fly, Swimmer.swim, Duck(Flyer,Swimmer).quack, and print MRO.`,
    defaultCode: `# WIP`,
    testScript: (userCode) => `${userCode}
import json
try:
  results = []
  input_data = []
  got = [c.__name__ for c in Duck.__mro__]
  expected = ["Duck","Flyer","Swimmer","object"]
  results.append({"test":"mro","input": input_data, "expected": expected, "got": got, "pass": got==expected})
except Exception as e:
  results.append({"test":"mro","input": input_data, "expected": expected, "got": str(e), "pass": False})
json.dumps(results)
`,
  },
];

const SuperHardProblems: React.FC = () => {
  // Persist user-written code for each problem
  const [codes, setCodes] = useState<Record<number, string>>(() =>
    problems.reduce((acc, p) => ({ ...acc, [p.id]: p.defaultCode }), {})
  );
  const [pyodide, setPyodide] = useState<any>(null);
  const editors = useRef<Record<number, any>>({});
  const [results, setResults] = useState<Record<number, TestResult[]>>({});

  useEffect(() => {
    const initPy = async () => {
      if (!(window as any).loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
        script.onload = async () => {
          const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
          setPyodide(py);
          // install micropip, numpy and pandas in Pyodide
          await py.loadPackage(['micropip', 'numpy']);
          await py.runPythonAsync(`
import micropip
await micropip.install(['pandas'])
`);
        };
        document.body.appendChild(script);
      } else {
        const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
        setPyodide(py);
        // install micropip, numpy and pandas in Pyodide
        await py.loadPackage(['micropip', 'numpy']);
        await py.runPythonAsync(`
import micropip
await micropip.install(['pandas'])
`);
      }
    };
    initPy();
  }, []);

  // Helper to parse raw JSON results into TestResult array
  const parseResults = (raw: string): TestResult[] => {
    try {
      const parsed = JSON.parse(raw);
      const cases = Array.isArray(parsed) ? parsed : parsed.cases || [];
      return cases.map((tc: any) => ({
        test: tc.test || tc.description || 'test',
        pass: !!tc.pass,
        input: tc.input,
        expected: tc.expected,
        got: tc.got ?? tc.actual,
        error: tc.error
      }));
    } catch (e: any) {
      return [{ test: 'parse_error', pass: false, error: e.message || String(e) }];
    }
  };

  const runTest = async (prob: Problem) => {
    if (!pyodide) return;
    const userCode = codes[prob.id];
    setResults(s => ({ ...s, [prob.id]: [] }));
    let raw = '';
    try {
      const script = prob.testScript(userCode);
      const result = await pyodide.runPythonAsync(script);
      raw = result.toString();
    } catch (e: any) {
      const full = e.stack || e.message || String(e);
      const start = full.indexOf('File "<exec>"');
      const end = full.indexOf('at new_error', start);
      const snippet = start >= 0 && end > start ? full.slice(start, end) : full;
      const errLine = snippet.trim();
      setResults(s => ({
        ...s,
        [prob.id]: [{ test: 'execution_error', pass: false, error: errLine }]
      }));
      return;
    }
    const resultsArr = parseResults(raw);
    setResults(s => ({ ...s, [prob.id]: resultsArr }));
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader><CardTitle>Final Boss Problems</CardTitle></CardHeader>
      <CardContent>
        {problems.map(p => (
          <div key={p.id} className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
            <p className="mb-4 text-gray-900" dangerouslySetInnerHTML={{ __html: p.description.replace(/\n/g, '<br />') }} />
            <AceEditor
              mode="python"
              theme="github_light_default"
              name={`boss-${p.id}`}
              onLoad={ed => editors.current[p.id] = ed}
              value={codes[p.id]}
              onChange={(val) => setCodes(s => ({ ...s, [p.id]: val }))}
              fontSize={14}
              width="100%"
              setOptions={{useWorker:false,maxLines:Infinity}}
            />
            <Button className="mt-2" onClick={() => runTest(p)}>Run Tests</Button>
            {results[p.id] && (
              <div className="mt-4 border rounded-md w-full overflow-x-auto">
                {/* Header row with custom column widths */}
                <div className="grid w-full bg-gray-100 p-2 text-sm font-semibold"
                     style={{ gridTemplateColumns: '1fr 1fr 2fr 2fr auto' }}>
                  <span>Test</span>
                  <span>Input</span>
                  <span>Expected</span>
                  <span>Output</span>
                  <span>Result</span>
                </div>
                {/* Result rows */}
                {results[p.id].map((r, i) => (
                  <div
                    key={i}
                    className={`grid w-full p-2 text-sm items-center border-t ${r.pass ? 'bg-green-50' : 'bg-red-50'}`}
                    style={{ gridTemplateColumns: '1fr 1fr 2fr 2fr auto' }}
                  >
                    <span>{r.test}</span>
                    <span>{r.input !== undefined ? JSON.stringify(r.input) : 'N/A'}</span>
                    <span>{r.expected !== undefined ? JSON.stringify(r.expected) : 'N/A'}</span>
                    <span>{r.error ?? (r.got !== undefined ? JSON.stringify(r.got) : 'N/A')}</span>
                    <span className="font-semibold">{r.pass ? '✅' : '❌'}</span>
                  </div>
                ))}
             </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SuperHardProblems;
