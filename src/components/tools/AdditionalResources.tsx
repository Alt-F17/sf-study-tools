import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AdditionalResources: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>A Few More Resources...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            A few more tools to help you in your studies. (A very big thanks to [][][] for kindly lending their notes &lt;3)
          </p>
          <p className="mb-4">Scroll down for more!</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <a href="https://coding-cat.club" className="text-blue-600 hover:underline">
              Coding Cat
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full border-2 border-gray-300 rounded-lg overflow-hidden h-[600px]">
            <iframe 
              src="https://coding-cat.club" 
              width="100%" 
              height="100%" 
              style={{ border: "none" }} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <a href="https://vim-adventures.com/" className="text-blue-600 hover:underline">
              VIM Adventures
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full border-2 border-gray-300 rounded-lg overflow-hidden h-[600px]">
            <iframe 
              src="https://vim-adventures.com/" 
              width="100%" 
              height="100%" 
              style={{ border: "none" }} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <a
              href="https://cdn.discordapp.com/attachments/1289352834998992968/1315497621011562559/Programming_Notes.pdf"
              className="text-blue-600 hover:underline"
            >
              DISCORD ATTACHMENT LINK TO THEIR NOTES
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full border-2 border-gray-300 rounded-lg overflow-hidden h-[600px]">
            <iframe 
              src="https://drive.google.com/file/d/1U8GQcbO6YLqLjY3efJ7UZGuLBqcWNGL/preview" 
              width="100%" 
              height="100%" 
              style={{ border: "none" }} 
            />
          </div>
        </CardContent>
      </Card>

      {/* New resource: VIM Hero Intro to Modes */}
      <Card>
        <CardHeader>
          <CardTitle>
            <a href="https://www.vim-hero.com/lessons/intro-to-modes" className="text-blue-600 hover:underline">
              VIM Hero: Intro to Modes
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full border-2 border-gray-300 rounded-lg overflow-hidden h-[600px]">
            <iframe
              src="https://www.vim-hero.com/lessons/intro-to-modes"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <a
              href="https://cs.calvin.edu/courses/cs/108/kvlinden/resources/pogil/Activities%20for%20CS1%20in%20Python%20-%20Student.pdf"
              className="text-blue-600 hover:underline"
            >
              CS1 POGIL Activities PDF
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full border-2 border-gray-300 rounded-lg overflow-hidden h-[600px]">
            <iframe
              src="https://cs.calvin.edu/courses/cs/108/kvlinden/resources/pogil/Activities%20for%20CS1%20in%20Python%20-%20Student.pdf"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>A tool made by: Felix Egan (SF2 - W25)</li>
            <li>[][][] for kindly sharing his notes</li>
            <li>[][][], also for kindly sharing his notes</li>
            <li>Eric Mayhew and Louisa Harutyunya for their amazing teaching throughout semesters 1 and 2</li>
            <li>Eric and Jacob for making Coding-Cat.club</li>
            <li>The creators of VIM Adventures</li>
            <li>The makers of GPT o4-mini, OpenAI</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalResources;
