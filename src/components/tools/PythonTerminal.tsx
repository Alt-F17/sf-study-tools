
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PythonTerminal: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Python Terminal Emulator</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Practice basic Python commands in a simulated terminal. (You don't need to sign in btw, ignore that)</p>
        <div className="w-full h-[600px] border border-gray-300 rounded-lg overflow-hidden">
          <iframe 
            src="https://trinket.io/embed/python3" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allowFullScreen
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PythonTerminal;
