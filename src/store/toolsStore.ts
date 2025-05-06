
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Word Jumble
interface JumbleState {
  deckOrder: number[];
  currentIndex: number;
  mistakes: number;
}

// Flashcards
interface FlashcardState {
  deckOrder: number[];
  currentIndex: number;
  knownIndices: number[];
  isFlipped: boolean;
}

// ConceptTests
interface ConceptTestState {
  deckOrder: number[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  answered: Record<number, boolean>;
}

interface ToolsState {
  // Active tool
  activeTool: string | null;
  setActiveTool: (toolId: string | null) => void;
  
  // Word Jumble state
  wordJumbleState: JumbleState;
  initWordJumble: () => void;
  updateWordJumbleState: (updates: Partial<JumbleState>) => void;
  
  // Flashcards state
  flashcardsState: FlashcardState;
  initFlashcards: (totalCards: number) => void;
  updateFlashcardsState: (updates: Partial<FlashcardState>) => void;
  
  // ConceptTests state
  conceptTestsState: ConceptTestState;
  initConceptTests: (totalTests: number) => void;
  updateConceptTestsState: (updates: Partial<ConceptTestState>) => void;
}

// Helper to shuffle arrays
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useToolsStore = create<ToolsState>()(
  persist(
    (set) => ({
      // Active tool
      activeTool: null,
      setActiveTool: (toolId) => set({ activeTool: toolId }),
      
      // Word Jumble
      wordJumbleState: {
        deckOrder: [],
        currentIndex: 0,
        mistakes: 0,
      },
      initWordJumble: () => set((state) => ({
        wordJumbleState: {
          ...state.wordJumbleState,
          deckOrder: shuffleArray(Array.from({ length: 20 }, (_, i) => i)),
          currentIndex: 0,
          mistakes: 0,
        }
      })),
      updateWordJumbleState: (updates) => set((state) => ({
        wordJumbleState: { ...state.wordJumbleState, ...updates }
      })),
      
      // Flashcards
      flashcardsState: {
        deckOrder: [],
        currentIndex: 0,
        knownIndices: [],
        isFlipped: false,
      },
      initFlashcards: (totalCards) => set((state) => ({
        flashcardsState: {
          ...state.flashcardsState,
          deckOrder: shuffleArray(Array.from({ length: totalCards }, (_, i) => i)),
          currentIndex: 0,
          knownIndices: [],
          isFlipped: false,
        }
      })),
      updateFlashcardsState: (updates) => set((state) => ({
        flashcardsState: { ...state.flashcardsState, ...updates }
      })),
      
      // ConceptTests
      conceptTestsState: {
        deckOrder: [],
        currentIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        answered: {},
      },
      initConceptTests: (totalTests) => set((state) => ({
        conceptTestsState: {
          ...state.conceptTestsState,
          deckOrder: shuffleArray(Array.from({ length: totalTests }, (_, i) => i)),
          currentIndex: 0,
          correctCount: 0,
          wrongCount: 0,
          answered: {},
        }
      })),
      updateConceptTestsState: (updates) => set((state) => ({
        conceptTestsState: { ...state.conceptTestsState, ...updates }
      })),
    }),
    {
      name: 'sf2-study-tools-storage',
    }
  )
);
