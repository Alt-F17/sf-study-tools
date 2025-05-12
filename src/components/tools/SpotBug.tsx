
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToolsStore } from "@/store/toolsStore";
import { ChevronUp, ChevronDown } from "lucide-react";

interface BugProblem {
  code: string;
  bugLine: number;
}

const SpotBug: React.FC = () => {
  const { spotBugState, updateSpotBugState, initSpotBug } = useToolsStore();
  const { deckOrder, currentIndex, correctCount, wrongCount, answered } = spotBugState;
  
  const [bugProblems] = useState<BugProblem[]>([
    {
      code: `def calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total / len(numbers)\n\nresult = calculate_average([])\nprint(result)`,
      bugLine: 5  // ZeroDivisionError (line count starts from 1)
    },
    {
      code: `def find_max(numbers):\n    if not numbers:\n        return None\n    max_value = numbers[0]\n    for num in numbers[1:]:\n        if num > max_value:\n            max_value = num\n    return max_value\n\nmy_list = [5, 2, 9, 1, 7]\nresult = find_max(my_list)\nprint("Maximum value:", result)`,
      bugLine: 4  // No bug, this is correct (testing users)
    },
    {
      code: `def remove_duplicates(items):\n    result = []\n    for item in items:\n        if item not in result:\n            result.append(item)\n    return results\n\nmy_list = [1, 2, 2, 3, 4, 4, 5]\nunique_items = remove_duplicates(my_list)\nprint(unique_items)`,
      bugLine: 6  // NameError: results is not defined (should be result)
    }
  ]);

  const [selectedLine, setSelectedLine] = useState<number>(1);
  const [lineCount, setLineCount] = useState<number>(1);

  // Initialize if needed
  useEffect(() => {
    if (deckOrder.length === 0) {
      initSpotBug(bugProblems.length);
    }
  }, [deckOrder.length, bugProblems.length, initSpotBug]);

  // Calculate line count when code changes
  useEffect(() => {
    if (deckOrder.length > 0 && currentIndex < deckOrder.length) {
      const currentTestIndex = deckOrder[currentIndex];
      const code = bugProblems[currentTestIndex]?.code || "";
      const lines = code.split("\n").length;
      setLineCount(lines);
      setSelectedLine(1); // Reset selected line on new problem
    }
  }, [currentIndex, deckOrder, bugProblems]);

  // Keyboard event handler for up/down arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedLine(prev => Math.max(1, prev - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedLine(prev => Math.min(lineCount, prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lineCount]);

  const handleSubmit = () => {
    if (answered[currentIndex]) return;

    const currentProblemIndex = deckOrder[currentIndex];
    const isCorrect = selectedLine === bugProblems[currentProblemIndex]?.bugLine;
    
    const newAnswered = { ...answered, [currentIndex]: true };
    
    if (isCorrect) {
      updateSpotBugState({ 
        answered: newAnswered,
        correctCount: correctCount + 1 
      });
    } else {
      updateSpotBugState({ 
        answered: newAnswered,
        wrongCount: wrongCount + 1 
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      updateSpotBugState({ currentIndex: currentIndex - 1 });
    }
  };

  const handleNext = () => {
    if (currentIndex < deckOrder.length - 1) {
      updateSpotBugState({ currentIndex: currentIndex + 1 });
    }
  };

  const resetTests = () => {
    initSpotBug(bugProblems.length);
  };

  const progress = Math.round((Object.keys(answered).length / bugProblems.length) * 100);

  // Helper function to determine if code is being rendered
  useEffect(() => {
    if (deckOrder.length > 0 && currentIndex < deckOrder.length) {
      // This ensures code syntax highlighting works
      if (typeof window !== "undefined" && (window as any).hljs) {
        setTimeout(() => {
          const codeElements = document.querySelectorAll('pre code');
          codeElements.forEach((block) => {
            (window as any).hljs.highlightElement(block);
          });
        }, 0);
      }
    }
  }, [currentIndex, deckOrder]);

  const incrementLine = () => {
    setSelectedLine(prev => Math.min(lineCount, prev + 1));
  };

  const decrementLine = () => {
    setSelectedLine(prev => Math.max(1, prev - 1));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Spot the Bug</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Find the line containing the bug in each code sample! Use the + and - buttons to select the line number, or your keyboard's up and down arrow keys.</p>
        
        {deckOrder.length > 0 && (
          <>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-auto max-h-60">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                <code className="language-python">
                  {bugProblems[deckOrder[currentIndex]]?.code.split('\n').map((line, idx) => (
                    <div 
                      key={idx} 
                      className={cn(
                        "py-1 px-2 -mx-2 rounded",
                        selectedLine === idx + 1 && "bg-blue-800",
                        answered[currentIndex] && bugProblems[deckOrder[currentIndex]]?.bugLine === idx + 1 && "bg-green-800"
                      )}
                    >
                      {line}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
            
            <div className="flex items-center justify-center mb-6 space-x-4">
              <Button 
                onClick={decrementLine} 
                disabled={selectedLine <= 1 || answered[currentIndex]}
                variant="outline"
              >
                <ChevronUp />
              </Button>
              <div className="text-center min-w-[120px] py-2 px-4 border rounded-md bg-gray-50">
                Line: {selectedLine} / {lineCount}
              </div>
              <Button 
                onClick={incrementLine} 
                disabled={selectedLine >= lineCount || answered[currentIndex]}
                variant="outline"
              >
                <ChevronDown />
              </Button>
            </div>
            
            <div className="flex justify-center mb-6">
              <Button 
                onClick={handleSubmit} 
                disabled={answered[currentIndex]}
              >
                Submit Answer
              </Button>
            </div>
            
            {answered[currentIndex] && (
              <div className={cn(
                "p-4 mb-6 rounded-md text-center",
                correctCount > wrongCount ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}>
                {bugProblems[deckOrder[currentIndex]]?.bugLine === selectedLine
                  ? "Correct! You found the bug!"
                  : `Wrong! The bug is on line ${bugProblems[deckOrder[currentIndex]]?.bugLine}.`}
              </div>
            )}
            
            <Progress value={progress} className="mb-4" />
            
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <div>
                <span>Completed: {Object.keys(answered).length} / {bugProblems.length}</span>
              </div>
              <div>
                <span>Correct: {correctCount}</span>
                <span className="mx-2">|</span>
                <span>Wrong: {wrongCount}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handlePrevious} 
          disabled={currentIndex === 0}
          variant="outline"
        >
          &lt; Previous
        </Button>
        <Button onClick={resetTests} variant="destructive">
          Reset
        </Button>
        <Button 
          onClick={handleNext}
          disabled={currentIndex === deckOrder.length - 1}
          variant="outline"
        >
          Next &gt;
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpotBug;
