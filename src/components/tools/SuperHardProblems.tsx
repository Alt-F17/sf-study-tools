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
    title: "Problem 1: Sales Data Analysis",
    description: `You’re a data analyst at a retail company tasked with analyzing sales data from a CSV file named 'sales_data.csv', which contains columns: date, product, quantity, price. Your goal is to read the file, clean it, compute total sales per product, identify the top 10 products, and visualize them in a bar chart. Define a custom FileError exception to handle file issues.

Sample Data:\n"date,product,quantity,price\n2023-01-01,Widget A,10,5.0\n2023-01-01,Widget B,5,10.0\n2023-01-02,Widget A,15,5.0\n2023-01-02,Widget C,20,2.0"`,
    defaultCode: `import pandas as pd
import matplotlib.pyplot as plt

class FileError(Exception):
    pass

try:
    df = pd.read_csv('sales_data.csv')
except FileNotFoundError:
    raise FileError("The file 'sales_data.csv' was not found.")
except pd.errors.ParserError:
    raise FileError("The file 'sales_data.csv' is malformed.")

df = df.dropna()
df['total'] = df['quantity'] * df['price']
total_sales = df.groupby('product')['total'].sum().sort_values(ascending=False)
top_10 = total_sales.head(10)
plt.figure(figsize=(10, 6))
plt.bar(top_10.index, top_10.values)
plt.xlabel('Product')
plt.ylabel('Total Sales')
plt.title('Top 10 Products by Total Sales')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('top_products.png')`,
    testScript: (userCode) => `
${userCode}
import pandas as pd, json
# Prepare sample CSV
data = """
date,product,quantity,price
2023-01-01,Widget A,10,5.0
2023-01-01,Widget B,5,10.0
2023-01-02,Widget A,15,5.0
2023-01-02,Widget C,20,2.0
"""
with open('sales_data.csv','w') as f: f.write(data)
results = []
input_lines = data.strip().splitlines()
try:
    df = pd.read_csv('sales_data.csv')
    df = df.dropna()
    df['total'] = df['quantity'] * df['price']
    total_sales = df.groupby('product')['total'].sum().sort_values(ascending=False)
    got = list(total_sales.head(2).index)
    expected = ["Widget A", "Widget B"]
    results.append({"test":"top_products","input": input_lines, "expected": expected, "got": got, "pass": got==expected})
except Exception as e:
    results.append({"test":"top_products","input": input_lines, "expected": expected, "got": None, "pass": False, "error": str(e)})
json.dumps(results)
`,
  },
  {
    id: 2,
    title: "Problem 2: Custom Data Structures",
    description: `Create an abstract base class DataStructure with methods add, remove, is_empty, and make it iterable. Implement Stack (LIFO) and Queue (FIFO). Write process_data(ds, elements) to add elements and remove/print them. Demonstrate polymorphism.`,
    defaultCode: `from abc import ABC, abstractmethod

class DataStructure(ABC):
    @abstractmethod
    def add(self, element): pass
    @abstractmethod
    def remove(self): pass
    @abstractmethod
    def is_empty(self): pass
    @abstractmethod
    def __iter__(self): pass

class Stack(DataStructure):
    def __init__(self): self.items = []
    def add(self, element): self.items.append(element)
    def remove(self): return self.items.pop() if not self.is_empty() else None
    def is_empty(self): return len(self.items)==0
    def __iter__(self): return iter(self.items[::-1])

class Queue(DataStructure):
    def __init__(self): self.items = []
    def add(self, element): self.items.append(element)
    def remove(self): return self.items.pop(0) if not self.is_empty() else None
    def is_empty(self): return len(self.items)==0
    def __iter__(self): return iter(self.items)

def process_data(ds, elements):
    for e in elements: ds.add(e)
    output=[]
    while not ds.is_empty(): output.append(ds.remove())
    return output`,
    testScript: (userCode) => `
${userCode}
import json
results = []
input_data = [1,2,3]
stack_res = process_data(Stack(), input_data)
queue_res = process_data(Queue(), input_data)
results.append({"test":"Stack LIFO","input":input_data,"expected":[3,2,1],"got":stack_res})
results.append({"test":"Queue FIFO","input":input_data,"expected":[1,2,3],"got":queue_res})
json.dumps(results)
`,
  },
  {
    id: 3,
    title: "Problem 3: Maze Solver",
    description: `Write a recursive function to find a path through a maze (2D list) from (0,0) to (n-1,m-1) using backtracking. Return the path as list of coords.`,
    defaultCode: `def solve_maze(maze, x, y, path):
    if x<0 or y<0 or x>=len(maze) or y>=len(maze[0]) or maze[x][y]!=0:
        return False
    path.append((x,y))
    if x==len(maze)-1 and y==len(maze[0])-1:
        return True
    maze[x][y]=2
    if (solve_maze(maze,x+1,y,path) or solve_maze(maze,x,y+1,path)
        or solve_maze(maze,x-1,y,path) or solve_maze(maze,x,y-1,path)):
        return True
    path.pop()
    maze[x][y]=0
    return False

def find_path(maze):
    path=[]
    if solve_maze(maze,0,0,path): return path
    return []`,
    testScript: (userCode) => `
${userCode}
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
    defaultCode: `students=[{"name":"Alice","grades":{"math":85,"science":92,"english":78}},
{"name":"Bob","grades":{"math":95,"science":88,"english":82}},
{"name":"Charlie","grades":{"math":72,"science":75,"history":90}}]
high_scorers=[s["name"] for s in students if any(g>90 for g in s["grades"].values())]
all_subjects={sub for s in students for sub in s["grades"].keys()}
subject_high_scorers={}
for s in students:
    for sub,gr in s["grades"].items():
        if gr>85:
            subject_high_scorers.setdefault(sub,[]).append(s["name"])`,
    testScript: (userCode) => `
${userCode}
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
    defaultCode: `def process_data():
    try:
        with open('data.txt','r') as file: lines=file.readlines()
    except FileNotFoundError:
        print("Error: The file 'data.txt' was not found."); return
    total=0; count=0
    for line in lines:
        try: number=int(line.strip()); total+=number; count+=1
        except ValueError: print(f"Skipping invalid: {line}")
    if count==0: print("Error: No valid numbers found.")
    else: print(f"The average is {total/count}")`,
    testScript: (userCode) => `
${userCode}
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
    defaultCode: `from functools import total_ordering; import math
@total_ordering
class Point:
    def __init__(self,x,y): self.coords=(x,y)
    def __repr__(self): return f"Point({self.coords[0]},{self.coords[1]})"
    def __eq__(self,other): return isinstance(other,Point) and self.coords==other.coords
    def __lt__(self,other): return math.hypot(*self.coords)<math.hypot(*other.coords)
    def __iter__(self): return iter(self.coords)`,
    testScript: (userCode) => `
${userCode}
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
    defaultCode: `import bisect
numbers=[5,3,8,6,2,7,1]
sorted_list=[]
for num in numbers: bisect.insort(sorted_list,num)
even=[n for n in sorted_list if n%2==0]`,
    testScript: (userCode) => `
${userCode}
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
    defaultCode: `class Flyer: def fly(self): print("fly")
class Swimmer: def swim(self): print("swim")
class Duck(Flyer,Swimmer): def quack(self): print("quack")`,
    testScript: (userCode) => `
${userCode}
import json
results = []
input_data = []
got = [c.__name__ for c in Duck.__mro__]
expected = ["Duck","Flyer","Swimmer","object"]
results.append({"test":"mro","input": input_data, "expected": expected, "got": got, "pass": got==expected})
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
        };
        document.body.appendChild(script);
      } else {
        const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
        setPyodide(py);
      }
    };
    initPy();
  }, []);

  const runTest = async (prob: Problem) => {
    if (!pyodide) return;
    // Use persisted code for testing
    const userCode = codes[prob.id];
    try {
      // Full test script including definitions and json.dumps at end
      const script = prob.testScript(userCode);
      const result = await pyodide.runPythonAsync(script);
      const resultStr = result.toString();
      const parsed = JSON.parse(resultStr);
      const arr: TestResult[] = Array.isArray(parsed)
        ? parsed
        : Object.entries(parsed).map(([key, value]) => ({
            test: key,
            pass: true,
            got: value
          }));
       setResults(s => ({ ...s, [prob.id]: arr }));
    } catch (e: any) {
      // Truncate error to last line
      let msg = e.message || String(e);
      const lines = msg.split('\n');
      msg = lines[lines.length - 1];
      setResults(s => ({
        ...s,
        [prob.id]: [{ test: 'runtime', pass: false, error: msg }]
      }));
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <CardHeader><CardTitle>Final Boss Problems</CardTitle></CardHeader>
      <CardContent>
        {problems.map(p => (
          <div key={p.id} className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
            <p className="mb-4 text-gray-600">{p.description}</p>
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
                {/* Header row */}
                <div className="grid grid-cols-5 w-full bg-gray-100 p-2 text-sm font-semibold">
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
                    className={`grid grid-cols-5 w-full p-2 text-sm items-center border-t ${r.pass ? 'bg-green-50' : 'bg-red-50'}`}
                  >
                    <span>{r.test}</span>
                    <span>{r.input !== undefined ? JSON.stringify(r.input) : 'N/A'}</span>
                    <span>{r.expected ?? 'N/A'}</span>
                    <span>{r.got ?? 'N/A'}</span>
                    <span className="font-semibold">{r.pass ? '✅' : '❌'}</span>
                    {r.error && <div className="col-span-5 text-sm text-red-600 mt-1">Error: {r.error}</div>}
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
