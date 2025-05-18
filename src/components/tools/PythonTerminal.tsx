
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

        <p className="mb-4">Here are a few File I/O challenges you can do if you want to practice open():
          <ul className="list-disc list-inside">
            <li>Take the spotting data from <b>spottings.txt</b> and send them to a <b>JSON</b> file called <b>spottings.json</b> (watch out for multiple occurances!)</li>
            <li>Create a function that prints all the odd numbers in <b>range(int(input('range: ')))</b> and appends them to a log using <b>open("log.txt", "a")</b> like this: "<b>n</b>th odd number: <b>odd_n</b>".</li>
            <li><b>Try</b> to open a file called <b>books.txt</b> and read its contents, or create it if it does not exist, filling it with the contents from <b>sample.txt</b>.</li>
          </ul>
        </p>

        <div className="w-full h-[600px] border border-gray-300 rounded-lg overflow-hidden">
          <iframe
            src="https://trinket.io/embed/python/ba9ed90b3fe1"
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
