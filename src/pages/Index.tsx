import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layouts/MainLayout";
import WordJumble from "@/components/tools/WordJumble";
import Flashcards from "@/components/tools/Flashcards";
import ConceptTests from "@/components/tools/ConceptTests";
import PythonTerminal from "@/components/tools/PythonTerminal";
import AdditionalResources from "@/components/tools/AdditionalResources";
import PlaceholderTool from "@/components/tools/PlaceholderTool";
import SpotBug from "@/components/tools/SpotBug";
import StepByStepAnimator from "@/components/tools/StepByStepAnimator";
import StackOrQueue from "@/components/tools/StackOrQueue";
import FileIOSimulation from "@/components/tools/FileIOSimulation";
import { useToolsStore } from "@/store/toolsStore";

const Index = () => {
  const { activeTool, setActiveTool } = useToolsStore();

  const tools = [
    { id: "word-jumble", name: "Word Jumble", component: WordJumble },
    { id: "flashcards", name: "SF2 Flashcards", component: Flashcards },
    { id: "concept-test", name: "SF2 ConcepTests", component: ConceptTests },
    { id: "stack-queue", name: "Stack or Queue?", component: StackOrQueue },
    { id: "pandas-playground", name: "Pandas and Matplotlib", component: PlaceholderTool },
    { id: "spot-bug", name: "Spot the Bug", component: SpotBug },
    { id: "list-pattern", name: "Final Boss Problems", component: PlaceholderTool },
    { id: "file-io", name: "File I/O Simulation", component: FileIOSimulation },
    { id: "oop-diagram", name: "OOP Diagram Builder", component: PlaceholderTool },
    { id: "sort-animator", name: "Step-by-Step Animator", component: StepByStepAnimator },
    { id: "complexity-calc", name: "Complexity Calculator", component: PlaceholderTool },
    { id: "py-terminal", name: "Python Terminal Emulator", component: PythonTerminal },
    { id: "concept-map", name: "Python Concept Map", component: PlaceholderTool },
    { id: "additional-resources", name: "A few more Tools...", component: AdditionalResources },
  ];

  // Find the selected tool
  const selectedTool = tools.find((tool) => tool.id === activeTool);
  const ToolComponent = selectedTool?.component || null;

  return (
    <MainLayout
      tools={tools}
      activeTool={activeTool}
      onToolSelect={(toolId) => setActiveTool(toolId)}
    >
      {!activeTool && (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-4xl font-bold mb-6">SF2 Study Tools</h1>
          <p className="text-xl text-gray-600 mb-8">Select a tool from the sidebar to get started</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
            {tools.slice(0, 6).map((tool) => (
              <Card 
                key={tool.id} 
                className="hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setActiveTool(tool.id)}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center h-32">
                  <h2 className="font-medium text-lg">{tool.name}</h2>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {activeTool && ToolComponent && <ToolComponent />}
    </MainLayout>
  );
};

export default Index;
