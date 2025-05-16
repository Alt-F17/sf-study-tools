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
    title: "1. E-Commerce Order 💲",
    description: "Calculate final price with tax and delivery.",
    defaultCode: `def calculate_subtotal(items):
    """
    Calculate subtotal (sum) of an e-commerce order.
    """
    subtotal = 0.0
    for price, qty, discount in items:
        subtotal += price * qty * (1 - discount)
    return subtotal


def process_checkout(items, shipping_address):
    """
    Process checkout with tax and delivery.
    """
    addresses = {'Montreal': (10,14.975), 'Toronto': (542,13), 'Vancouver': (4924,12), 'Edmonton': (3584,5), 'Charlottetown': (1149,15)}
    dist, tax = addresses.get(shipping_address, (0,0))
    sub = calculate_subtotal(items)
    delivery = dist * 0.018
    return round(sub * (1 + tax/100) + delivery, 2)
`,
    testScript: (userCode) => `
${userCode}
import json
results=[]
# test1
try:
    items1=[(10,2,0.1),(5,1,0)]
    r=calculate_subtotal(items1)
    results.append({"test":"calculate_subtotal","input":items1,"pass":r==23.0,"expected":23.0,"got":r})
except Exception as e:
    results.append({"test":"calculate_subtotal","input":items1,"pass":False,"error":str(e)})
# test2
try:
    items2=[(10,2,0.1),(5,1,0)]
    addr='Toronto'
    r=process_checkout(items2, addr)
    exp=(10*2*0.9+5)*1.13 + 542*0.018
    results.append({"test":"process_checkout","input":[items2,addr],"pass":abs(r-exp)<1e-6,"expected":round(exp,6),"got":r})
except Exception as e:
    results.append({"test":"process_checkout","input":[items2,addr],"pass":False,"error":str(e)})
json.dumps(results)
`,
  },
  {
    id: 2,
    title: "2. Pizza Time! 🍕",
    description: "Compute pizza order total with deals.",
    defaultCode: `def calculate_pizza_price(size, toppings):
    prices={'S':8,'M':10,'L':12}
    return prices.get(size.upper(),0) + 1.5 * len(toppings)


def calculate_order_total(pizzas):
    total = sum(calculate_pizza_price(s,t) for s,t in pizzas)
    if len(pizzas) >= 2:
        total *= 0.9
    for s,t in pizzas:
        if s.upper()=='L' and len(t)>=3:
            total -= 2
    return round(total,2)
`,
    testScript: (userCode) => `
${userCode}
import json
results=[]
# test1
try:
    size='L'
    toppings=['a','b','c']
    r=calculate_pizza_price(size, toppings)
    results.append({"test":"calculate_pizza_price","input":[size,toppings],"pass":r==(12+1.5*3),"expected":12+1.5*3,"got":r})
except Exception as e:
    results.append({"test":"calculate_pizza_price","input":[size,toppings],"pass":False,"error":str(e)})
# test2
try:
    pizzas=[('M',['x','y']),('L',['a','b','c','d'])]
    r=calculate_order_total(pizzas)
    exp=(10+1.5*2 + 12+1.5*4)*0.9 - 2
    results.append({"test":"calculate_order_total","input":pizzas,"pass":abs(r-exp)<1e-6,"expected":round(exp,6),"got":r})
except Exception as e:
    results.append({"test":"calculate_order_total","input":pizzas,"pass":False,"error":str(e)})
json.dumps(results)
`,
  },
  {
    id: 3,
    title: "3. Ultimate Gamer 🎮",
    description: "Calculate session points and update rank.",
    defaultCode: `def calculate_session_points(kills, time_alive, position):
    points=kills*50 + time_alive*10
    if position<=10: points+=300
    if position==1: points+=500
    return points


def update_player_rank(current_rank, recent_sessions):
    avg=sum(calculate_session_points(*s) for s in recent_sessions) // len(recent_sessions)
    ranks=[('Bronze',0),('Silver',1000),('Gold',2000),('Diamond',3000)]
    new=current_rank
    for name,th in ranks:
        if avg>=th: new=name
    return f"{current_rank} => {new}"
`,
    testScript: (userCode) => `
${userCode}
import json
results=[]
# test1
try:
    kills=5
    time_alive=10
    position=1
    r=calculate_session_points(kills, time_alive, position)
    exp=5*50+10*10+300+500
    results.append({"test":"calculate_session_points","input":[kills,time_alive,position],"pass":r==exp,"expected":exp,"got":r})
except Exception as e:
    results.append({"test":"calculate_session_points","input":[kills,time_alive,position],"pass":False,"error":str(e)})
# test2
try:
    current_rank='Bronze'
    sessions=[(5,10,1),(0,20,15)]
    r=update_player_rank(current_rank, sessions)
    results.append({"test":"update_player_rank","input":[current_rank,sessions],"pass":r=="Bronze => Silver","expected":"Bronze => Silver","got":r})
except Exception as e:
    results.append({"test":"update_player_rank","input":[current_rank,sessions],"pass":False,"error":str(e)})
json.dumps(results)
`,
  },
];

const SuperHardProblems: React.FC = () => {
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
    const userCode = editors.current[prob.id].getValue();
    try {
      // Prepare user test script, trimming whitespace
      const script = prob.testScript(userCode).trim();
      // Split into setup and final expression
      const idx = script.lastIndexOf('\n');
      const setupCode = idx >= 0 ? script.slice(0, idx) : '';
      const lastLine = idx >= 0 ? script.slice(idx + 1) : script;
      // Execute setup code (function definitions and test blocks)
      if (setupCode) await pyodide.runPythonAsync(setupCode);
      // Evaluate final JSON dump expression to get return value
      const pyResult = pyodide.runPython(lastLine);
      const resultStr = pyResult.toString();
      const arr: TestResult[] = JSON.parse(resultStr);
      setResults(s => ({ ...s, [prob.id]: arr }));
    } catch (e: any) {
      setResults(s => ({ ...s, [prob.id]: [{ test: 'setup', pass: false, error: e.message }] }));
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
              value={p.defaultCode}
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
