import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToolsStore } from "@/store/toolsStore";
import { ChevronUp, ChevronDown } from "lucide-react";

interface BugProblem {
  code: string;
  bugLine: number; // 1-indexed
}

const SpotBug: React.FC = () => {
  const { spotBugState, updateSpotBugState, initSpotBug } = useToolsStore();
  const { deckOrder, currentIndex, correctCount, wrongCount, answered } = spotBugState;
  
  const [bugProblems] = useState<BugProblem[]>([
    {
      code: `def calculate_average(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total / len(numbers)\n\nresult = calculate_average([])\nprint(result)`,
      bugLine: 5
    },
    {
      code: `def find_max(numbers):\n    if not numbers:\n        return None\n    max_value = numbers[0]\n    for num in numbers[1:]:\n        if num > max_value:\n            max_value = num\n    return max_value\n\nmy_list = [5, 2, 9, 1, 7]\nresult = find_max(my_list)\nprint("Maximum value:", result)`,
      bugLine: 4 
    },
    {
      code: `def remove_duplicates(items):\n    result = []\n    for item in items:\n        if item not in result:\n            result.append(item)\n    return results\n\nmy_list = [1, 2, 2, 3, 4, 4, 5]\nunique_items = remove_duplicates(my_list)\nprint(unique_items)`,
      bugLine: 6
    }
  ]);

  const [selectedLine, setSelectedLine] = useState<number>(1); // 1-indexed
  const [lineCount, setLineCount] = useState<number>(1);
  const [highlightedLines, setHighlightedLines] = useState<string[]>([]);
  const [isCodeHighlighted, setIsCodeHighlighted] = useState(false);

  const currentProblem = deckOrder.length > 0 && currentIndex < deckOrder.length && bugProblems[deckOrder[currentIndex]]
    ? bugProblems[deckOrder[currentIndex]]
    : null;

  // Initialize if needed
  useEffect(() => {
    if (deckOrder.length === 0 && bugProblems.length > 0) {
      initSpotBug(bugProblems.length);
    }
  }, [deckOrder.length, bugProblems.length, initSpotBug]);

  // Process code for highlighting and line numbers
  useEffect(() => {
    if (currentProblem?.code) {
      const codeLines = currentProblem.code.split('\n');
      setLineCount(codeLines.length);
      setSelectedLine(1); // Reset selected line on new problem

      if (typeof window !== "undefined" && (window as any).hljs) {
        const highlightedHTML = (window as any).hljs.highlight(currentProblem.code, { language: 'python', ignoreIllegals: true }).value;
        setHighlightedLines(highlightedHTML.split('\n'));
        setIsCodeHighlighted(true);
      } else {
        setHighlightedLines(codeLines);
        setIsCodeHighlighted(false);
      }
    } else {
      setHighlightedLines([]);
      setLineCount(1);
      setIsCodeHighlighted(false);
    }
  }, [currentProblem?.code]); // Only re-run when the code string itself changes

  // Keyboard event handler for up/down arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (answered[currentIndex]) return; // Don't change selection if answered
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
  }, [lineCount, answered, currentIndex]);

  const handleSubmit = () => {
    if (answered[currentIndex] || !currentProblem) return;

    const isCorrect = selectedLine === currentProblem.bugLine;
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
    // setSelectedLine(1) will be handled by the useEffect for currentProblem.code
  };

  const progress = bugProblems.length > 0 ? Math.round((Object.keys(answered).length / bugProblems.length) * 100) : 0;

  const incrementLine = () => {
    if (answered[currentIndex]) return;
    setSelectedLine(prev => Math.min(lineCount, prev + 1));
  };

  const decrementLine = () => {
     if (answered[currentIndex]) return;
    setSelectedLine(prev => Math.max(1, prev - 1));
  };
  
  const lineNumberStyle: React.CSSProperties = {
    color: '#6b7280', // gray-500
    marginRight: '1em',
    userSelect: 'none',
    minWidth: '2.5em', // Adjust as needed
    textAlign: 'right',
    display: 'inline-block',
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Spot the Bug</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Find the line containing the bug in each code sample! Use the selector buttons or your keyboard's up and down arrow keys to choose a line number.</p>
        
        {currentProblem && deckOrder.length > 0 ? (
          <>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-auto max-h-60">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                <code>
                  {highlightedLines.map((lineContent, idx) => {
                    const lineNum = idx + 1;
                    const isBugLine = currentProblem.bugLine === lineNum;
                    const isSelected = selectedLine === lineNum;
                    const hasBeenAnswered = answered[currentIndex];

                    return (
                      <div 
                        key={idx} 
                        className={cn(
                          "flex items-start", // Use items-start for wrapped lines
                          "py-0.5 px-2 -mx-2 rounded", 
                          {
                            "bg-blue-700 text-white": isSelected && !hasBeenAnswered,
                            "bg-green-700 text-white": hasBeenAnswered && isBugLine,
                            "bg-red-700 text-white": hasBeenAnswered && isSelected && !isBugLine,
                          }
                        )}
                      >
                        <span style={{
                          ...lineNumberStyle,
                          // Make line number more visible on selection/feedback backgrounds
                          color: (isSelected && !hasBeenAnswered) || (hasBeenAnswered && (isBugLine || (isSelected && !isBugLine))) ? '#e5e7eb' : '#6b7280',
                        }}>
                          {lineNum}
                        </span>
                        {isCodeHighlighted ? (
                           <span className="flex-grow" dangerouslySetInnerHTML={{ __html: lineContent }} />
                        ) : (
                           <span className="flex-grow">{lineContent}</span>
                        )}
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>
            
            <div className="flex items-center justify-center mb-6 space-x-4">
              <Button 
                onClick={decrementLine} 
                disabled={selectedLine <= 1 || answered[currentIndex]}
                variant="outline"
                aria-label="Decrement line number"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <div className="text-center min-w-[120px] py-2 px-4 border rounded-md bg-gray-50">
                Line: {selectedLine} / {lineCount}
              </div>
              <Button 
                onClick={incrementLine} 
                disabled={selectedLine >= lineCount || answered[currentIndex]}
                variant="outline"
                aria-label="Increment line number"
              >
                <ChevronDown className="h-4 w-4" />
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
                currentProblem.bugLine === selectedLine ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}>
                {currentProblem.bugLine === selectedLine
                  ? "Correct! You found the bug!"
                  : `Incorrect. The bug is on line ${currentProblem.bugLine}. You selected line ${selectedLine}.`}
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
        ) : (
          <p>Loading bug problems...</p>
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
          disabled={currentIndex >= deckOrder.length - 1 || deckOrder.length === 0}
          variant="outline"
        >
          Next &gt;
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpotBug;
