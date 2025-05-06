
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface JumbleWord {
  word: string;
  hint: string;
}

const WordJumble: React.FC = () => {
  const [words] = useState<JumbleWord[]>([
    { word: "function", hint: "Defines a reusable block of code" },
    { word: "variable", hint: "Stores a value" },
    { word: "integer", hint: "A whole number data type" },
    { word: "string", hint: "Sequence of characters" },
    { word: "boolean", hint: "True or False value" },
    { word: "list", hint: "Ordered, mutable collection" },
    { word: "dictionary", hint: "Key-value mapping" },
    { word: "tuple", hint: "Ordered, immutable collection" },
    { word: "class", hint: "Defines a user-defined type" },
    { word: "object", hint: "Instance of a class" },
    { word: "loop", hint: "Repeats code block" },
    { word: "while", hint: "Loop that runs while a condition holds" },
    { word: "return", hint: "Gives back a value from a function" },
    { word: "import", hint: "Brings in modules or objects" },
    { word: "module", hint: "File containing Python code" },
    { word: "index", hint: "Position number in a sequence" },
    { word: "slice", hint: "Extracts a sub-part of a sequence" },
    { word: "append", hint: "Adds item to end of list" },
    { word: "method", hint: "Function associated with an object" },
    { word: "attribute", hint: "Property of an object" }
  ]);

  const [deckOrder, setDeckOrder] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [guess, setGuess] = useState("");
  const [scrambledWord, setScrambledWord] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  const shuffleArray = useCallback((array: number[]): number[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const scrambleWord = useCallback((word: string): string => {
    const arr = word.split("");
    let scrambled;
    do {
      scrambled = shuffleArray([...Array(arr.length).keys()]).map(i => arr[i]).join("");
    } while (scrambled === word);
    return scrambled;
  }, [shuffleArray]);

  const initGame = useCallback(() => {
    const newDeckOrder = shuffleArray([...Array(words.length).keys()]);
    setDeckOrder(newDeckOrder);
    setCurrentIndex(0);
    setMistakes(0);
    setGuess("");
    setIsCompleted(false);
  }, [words.length, shuffleArray]);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    if (deckOrder.length > 0 && currentIndex < deckOrder.length) {
      const wordObj = words[deckOrder[currentIndex]];
      setScrambledWord(scrambleWord(wordObj.word));
    } else if (deckOrder.length > 0) {
      setIsCompleted(true);
    }
  }, [currentIndex, deckOrder, words, scrambleWord]);

  const handleGuessSubmit = () => {
    if (currentIndex >= deckOrder.length) return;
    
    const wordObj = words[deckOrder[currentIndex]];
    if (guess.trim().toLowerCase() === wordObj.word.toLowerCase()) {
      toast.success("Correct!");
      setCurrentIndex(prev => prev + 1);
      setGuess("");
    } else {
      toast.error("Try again!");
      setMistakes(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGuessSubmit();
    }
  };

  const progress = Math.round((currentIndex / words.length) * 100);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Word Jumble</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Unscramble the Python keyword or concept:</p>
        <Progress value={progress} className="mb-4" />
        
        {isCompleted ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">🎉 Completed!</h3>
            <p className="mb-4">You made {mistakes} mistakes.</p>
            <Button onClick={initGame}>Play Again</Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-3xl font-bold mb-2">{scrambledWord}</p>
              {deckOrder.length > 0 && currentIndex < deckOrder.length && (
                <p className="text-gray-500 italic">{words[deckOrder[currentIndex]]?.hint}</p>
              )}
            </div>
            
            <div className="flex space-x-2 mb-4">
              <Input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your guess"
                disabled={isCompleted}
              />
              <Button onClick={handleGuessSubmit} disabled={isCompleted}>Submit</Button>
            </div>
            
            <p className="text-gray-600">Mistakes: {mistakes}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WordJumble;
