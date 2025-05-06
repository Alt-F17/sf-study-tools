
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ConceptTest {
  code: string;
  choices: string[];
  correct: number;
}

const ConceptTests: React.FC = () => {
  const [conceptTests] = useState<ConceptTest[]>([
    {
      code: `def foo(x):\n    return x * x\n\nprint(foo(5))`,
      choices: ["5", "10", "25", "Error"],
      correct: 2
    },
    {
      code: `a = [1,2,3]\nb = a\nb.append(4)\nprint(a)`,
      choices: ["[1,2,3]", "[1,2,3,4]", "[4]", "Error"],
      correct: 1
    }
  ]);

  const [deckOrder, setDeckOrder] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [answered, setAnswered] = useState<Record<number, boolean>>({});

  // Initialize deck on component mount
  useEffect(() => {
    const newDeckOrder = Array.from({ length: conceptTests.length }, (_, i) => i);
    // Shuffle the deck
    for (let i = newDeckOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeckOrder[i], newDeckOrder[j]] = [newDeckOrder[j], newDeckOrder[i]];
    }
    setDeckOrder(newDeckOrder);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setAnswered({});
  }, [conceptTests.length]);

  const handleAnswer = (choiceIndex: number) => {
    if (answered[currentIndex]) return;

    const currentTestIndex = deckOrder[currentIndex];
    const isCorrect = choiceIndex === conceptTests[currentTestIndex]?.correct;

    setAnswered({ ...answered, [currentIndex]: true });
    
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    } else {
      setWrongCount(wrongCount + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < deckOrder.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const resetTests = () => {
    const newDeckOrder = [...deckOrder];
    // Shuffle the deck
    for (let i = newDeckOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeckOrder[i], newDeckOrder[j]] = [newDeckOrder[j], newDeckOrder[i]];
    }
    setDeckOrder(newDeckOrder);
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setAnswered({});
  };

  const progress = Math.round((Object.keys(answered).length / conceptTests.length) * 100);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>SF2 ConcepTests</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">All of Louisa's ConceptTests all in one place! Can you solve them all?</p>
        
        {deckOrder.length > 0 && (
          <>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-auto max-h-60">
              <pre className="font-mono text-sm whitespace-pre-wrap">
                {conceptTests[deckOrder[currentIndex]]?.code}
              </pre>
            </div>
            
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-6">
              {conceptTests[deckOrder[currentIndex]]?.choices.map((choice, idx) => {
                const isCorrectChoice = idx === conceptTests[deckOrder[currentIndex]]?.correct;
                const hasAnswered = answered[currentIndex];
                
                return (
                  <Button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={hasAnswered}
                    variant="outline"
                    className={cn(
                      "h-auto py-3 justify-start text-left",
                      hasAnswered && isCorrectChoice && "bg-green-100 border-green-500",
                      hasAnswered && !isCorrectChoice && "bg-red-100 border-red-500"
                    )}
                  >
                    {choice}
                  </Button>
                );
              })}
            </div>
            
            <Progress value={progress} className="mb-4" />
            
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <div>
                <span>Completed: {Object.keys(answered).length} / {conceptTests.length}</span>
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

export default ConceptTests;
