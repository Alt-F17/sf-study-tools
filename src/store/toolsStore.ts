
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

// SpotBug
interface SpotBugState {
  deckOrder: number[];
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  answered: Record<number, boolean>;
}

// FileIO
type FileType = 'txt' | 'csv' | 'json' | 'py';

interface FileData {
  id: string;
  name: string;
  type: FileType;
  content: string;
}

interface FileIOState {
  files: FileData[];
  activeFileId: string;
  codeInput: string;
  outputText: string;
  currentChallengeId: string | null;
  completedChallenges: string[];
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

  // SpotBug state
  spotBugState: SpotBugState;
  initSpotBug: (totalProblems: number) => void;
  updateSpotBugState: (updates: Partial<SpotBugState>) => void;
  
  // FileIO state
  fileIOState: FileIOState | null;
  initFileIO: () => void;
  updateFileIOState: (updates: Partial<FileIOState>) => void;
  
  // Reset all tools
  resetAllTools: () => void;
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

      // SpotBug
      spotBugState: {
        deckOrder: [],
        currentIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        answered: {},
      },
      initSpotBug: (totalProblems) => set((state) => ({
        spotBugState: {
          ...state.spotBugState,
          deckOrder: shuffleArray(Array.from({ length: totalProblems }, (_, i) => i)),
          currentIndex: 0,
          correctCount: 0,
          wrongCount: 0,
          answered: {},
        }
      })),
      updateSpotBugState: (updates) => set((state) => ({
        spotBugState: { ...state.spotBugState, ...updates }
      })),
      
      // FileIO
      fileIOState: null,
      initFileIO: () => set({
        fileIOState: {
          files: [
            {
              id: 'file1',
              name: 'sample',
              type: 'txt',
              content: 'This is a sample text file.\nIt has multiple lines.\nYou can read from it.'
            },
            {
              id: 'file2',
              name: 'data',
              type: 'csv',
              content: 'name,age,city\nJohn,24,New York\nSarah,32,Boston\nMike,28,Chicago'
            },
            {
              id: 'file3',
              name: 'config',
              type: 'json',
              content: '{\n  "appName": "File I/O Simulator",\n  "version": "1.0.0",\n  "settings": {\n    "darkMode": false,\n    "fontSize": 14\n  }\n}'
            },
            {
              id: 'file4',
              name: 'helper',
              type: 'py',
              content: '# Helper functions\n\ndef read_file(filename):\n    with open(filename, "r") as f:\n        return f.read()\n\ndef write_file(filename, content):\n    with open(filename, "w") as f:\n        f.write(content)'
            }
          ] as FileData[],
          activeFileId: 'file1',
          codeInput: '# Open a file for reading\nwith open("sample.txt", "r") as file:\n    content = file.read()\n    print(content)',
          outputText: '',
          currentChallengeId: null,
          completedChallenges: [],
        }
      }),
      updateFileIOState: (updates) => set((state) => ({
        fileIOState: state.fileIOState ? { ...state.fileIOState, ...updates } : updates as FileIOState
      })),
      
      // Reset all tools
      resetAllTools: () => set((state) => ({
        wordJumbleState: {
          deckOrder: [],
          currentIndex: 0,
          mistakes: 0,
        },
        flashcardsState: {
          deckOrder: [],
          currentIndex: 0,
          knownIndices: [],
          isFlipped: false,
        },
        conceptTestsState: {
          deckOrder: [],
          currentIndex: 0,
          correctCount: 0,
          wrongCount: 0,
          answered: {},
        },
        spotBugState: {
          deckOrder: [],
          currentIndex: 0,
          correctCount: 0,
          wrongCount: 0,
          answered: {},
        },
        fileIOState: null
      })),
    }),
    {
      name: 'sf2-study-tools-storage',
    }
  )
);
