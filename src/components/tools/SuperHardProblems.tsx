import React, { useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/mode-python";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const defaultSolutions: Record<number,string> = {
  1: `def calculate_subtotal(items):
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
    addresses = {
        'Montreal': (10, 14.975),
        'Toronto': (542, 13),
        'Vancouver': (4924, 12),
        'Edmonton': (3584, 5),
        'Charlottetown': (1149, 15)
    }
    dist, tax = addresses.get(shipping_address, (0,0))
    subtotal = calculate_subtotal(items)
    delivery = dist * 0.018
    return round(subtotal * (1 + tax/100) + delivery, 2)
`,
  2: `def calculate_pizza_price(size, toppings):
    prices = {'S':8, 'M':10, 'L':12}
    return prices.get(size.upper(),0) + 1.5 * len(toppings)


def calculate_order_total(pizzas):
    total = sum(calculate_pizza_price(s,t) for s,t in pizzas)
    if len(pizzas) >= 2:
        total *= 0.9
    for s,t in pizzas:
        if s.upper()=='L' and len(t) >= 3:
            total -= 2
    return round(total,2)
`,
  3: `def calculate_session_points(kills, time_alive, position):
    points = kills*50 + time_alive*10
    if position <= 10: points += 300
    if position == 1: points += 500
    return points


def update_player_rank(current_rank, recent_sessions):
    avg = sum(calculate_session_points(*s) for s in recent_sessions) // len(recent_sessions)
    ranks = [('Bronze',0), ('Silver',1000), ('Gold',2000), ('Diamond',3000)]
    new = current_rank
    for name, threshold in ranks:
        if avg >= threshold: new = name
    return f"{current_rank} => {new}"
`
};

const SuperHardProblems: React.FC = () => {
  const [pyodide, setPyodide] = useState<any>(null);
  const editors = useRef<Record<number, any>>({});
  const [outputs, setOutputs] = useState<Record<number, string>>({});

  useEffect(() => {
    (async () => {
      const py = await (window as any).loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
      setPyodide(py);
    })();
  }, []);

  const runTests = async (id: number) => {
    if (!pyodide) return;
    const userCode = editors.current[id].editor.getValue();
    const tests: Record<number, string> = {
      1: `
items = [(10,2,0.1),(5,1,0)]
assert calculate_subtotal(items) == 10*2*0.9 + 5
assert abs(process_checkout(items, 'Toronto') - ((10*2*0.9+5)*1.13 + 542*0.018)) < 1e-6
print('Boss 1 passed')
`,
      2: `
pizzas = [('M',['p','q']), ('L',['a','b','c','d'])]
assert abs(calculate_pizza_price('L',['a','b','c']) - (12+1.5*3)) < 1e-6
assert abs(calculate_order_total(pizzas) - round((10+1.5*2 + 12+1.5*4)*0.9 - 2,2)) < 1e-6
print('Boss 2 passed')
`,
      3: `
sessions = [(5,10,1), (0,20,15)]
assert calculate_session_points(5,10,1) == 5*50 + 10*10 + 300 + 500
assert update_player_rank('Bronze', sessions) == 'Bronze => Silver'
print('Boss 3 passed')
`
    };
    try {
      await pyodide.runPythonAsync(userCode + '\n' + tests[id]);
      setOutputs(prev => ({ ...prev, [id]: '✅ All tests passed' }));
    } catch (err: any) {
      setOutputs(prev => ({ ...prev, [id]: err.message || String(err) }));
    }
  };

  const problems = [
    { id: 1, title: '1. E-Commerce Order 💲', description: 'Calculate final price with tax and delivery.' },
    { id: 2, title: '2. Pizza Time! 🍕', description: 'Compute pizza order total with deals.' },
    { id: 3, title: '3. Ultimate Gamer 🎮', description: 'Calculate session points and update rank.' }
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Coding Problems: Final Bosses</CardTitle>
      </CardHeader>
      <CardContent>
        {problems.map(p => (
          <div key={p.id} className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
            <p className="mb-4 text-sm text-gray-600">{p.description}</p>
            <AceEditor
              mode="python"
              theme="dracula"
              name={`boss-editor-${p.id}`}
              onLoad={editor => { editors.current[p.id] = editor; }}
              fontSize={14}
              width="100%"
              height="200px"
              showPrintMargin={false}
              setOptions={{ useWorker: false }}
              value={defaultSolutions[p.id]}
            />
            <Button className="mt-2" onClick={() => runTests(p.id)}>Run Tests</Button>
            {outputs[p.id] && (
              <pre className="mt-2 p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap">{outputs[p.id]}</pre>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SuperHardProblems;
