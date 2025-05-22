import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToolsStore } from "@/store/toolsStore";
import conceptTestsData from "@/data/conceptTests.json";

interface ConceptTest {
  code: string;
  choices: string[];
  correct: number;
}

const ConceptTests: React.FC = () => {
  const { conceptTestsState, updateConceptTestsState, initConceptTests } = useToolsStore();
  const { deckOrder, currentIndex, correctCount, wrongCount, answered } = conceptTestsState;
  
  const tests: ConceptTest[] = conceptTestsData as ConceptTest[];

  const [processedCodeLines, setProcessedCodeLines] = useState<string[]>([]);
  const [isCodeHighlighted, setIsCodeHighlighted] = useState(false);

  const currentTest = deckOrder.length > 0 && currentIndex < deckOrder.length && tests[deckOrder[currentIndex]]
    ? tests[deckOrder[currentIndex]]
    : null;

  // Initialize concept tests if needed
  useEffect(() => {
    if (deckOrder.length === 0 && tests.length > 0) {
      initConceptTests(tests.length);
    }
  }, [deckOrder.length, tests.length, initConceptTests]);

  // Process code for highlighting and line numbers
  useEffect(() => {
    if (currentTest?.code) {
      if (typeof window !== "undefined" && (window as any).hljs) {
        const highlightedHTML = (window as any).hljs.highlight(currentTest.code, { language: 'python', ignoreIllegals: true }).value;
        setProcessedCodeLines(highlightedHTML.split('\n'));
        setIsCodeHighlighted(true);
      } else {
        setProcessedCodeLines(currentTest.code.split('\n'));
        setIsCodeHighlighted(false);
      }
    } else {
      setProcessedCodeLines([]);
      setIsCodeHighlighted(false);
    }
  }, [currentTest?.code]);


  const handleAnswer = (choiceIndex: number) => {
    if (answered[currentIndex] || !currentTest) return;

    const isCorrect = choiceIndex === currentTest.correct;
    const newAnswered = { ...answered, [currentIndex]: true };
    
    if (isCorrect) {
      updateConceptTestsState({ 
        answered: newAnswered,
        correctCount: correctCount + 1 
      });
    } else {
      updateConceptTestsState({ 
        answered: newAnswered,
        wrongCount: wrongCount + 1 
      });
    }
  };

  const handlePrevious = () => {
    const prev = currentIndex > 0 ? currentIndex - 1 : deckOrder.length - 1;
    updateConceptTestsState({ currentIndex: prev });
  };

  const handleNext = () => {
    const next = currentIndex < deckOrder.length - 1 ? currentIndex + 1 : 0;
    updateConceptTestsState({ currentIndex: next });
  };

  // Keyboard shortcuts: left/right arrows for navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      else if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentIndex, deckOrder.length]);

  const resetTests = () => {
    initConceptTests(tests.length);
  };

  const progress = tests.length > 0 ? Math.round((Object.keys(answered).length / tests.length) * 100) : 0;

  const lineNumberStyle: React.CSSProperties = {
    color: '#6b7280', // gray-500
    marginRight: '1em',
    userSelect: 'none',
    minWidth: '2.5em', // Adjust as needed for number of lines
    textAlign: 'right',
    display: 'inline-block',
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>SF2 ConcepTests</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">All of Louisa's ConceptTests all in one place! Can you solve them all?</p>
        
        {currentTest && deckOrder.length > 0 ? (
          <>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                <code>
                  {processedCodeLines.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span style={lineNumberStyle}>{idx + 1}</span>
                      {isCodeHighlighted ? (
                        <span dangerouslySetInnerHTML={{ __html: line }} />
                      ) : (
                        <span>{line}</span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-6">
              {currentTest.choices.map((choice, idx) => {
                const isCorrectChoice = idx === currentTest.correct;
                const hasAnswered = answered[currentIndex];
                
                return (
                  <Button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={hasAnswered}
                    variant="outline"
                    className={cn(
                      "h-auto py-3 justify-start text-left",
                      hasAnswered && isCorrectChoice && "bg-green-100 border-green-500 text-green-800",
                      hasAnswered && !isCorrectChoice && answered[currentIndex] && "bg-red-100 border-red-500 text-red-800"
                    )}
                  >
                    <pre className="m-0 whitespace-pre-wrap font-mono">{choice}</pre>
                  </Button>
                );
              })}
            </div>
            
            <Progress value={progress} className="mb-4" />           
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <div>
                <span>Completed: {Object.keys(answered).length} / {tests.length}</span>
              </div>
              <div>
                <span>Correct: {correctCount}</span>
                <span className="mx-2">|</span>
                <span>Wrong: {wrongCount}</span>
              </div>
            </div>
          </>
        ) : (
          <p>Loading concept tests...</p>
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

export default ConceptTests;
