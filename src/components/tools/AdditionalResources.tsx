import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import additionalResources from '@/data/additionalResources.json';

const AdditionalResources: React.FC = () => {
  // Cast imported JSON to typed array
  const resources = additionalResources as { title: string; url: string }[];
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

      {/* Dynamic resource cards from JSON */}
      {resources.map((res, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>
              <a href={res.url} className="text-blue-600 hover:underline">
                {res.title}
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full border-2 border-gray-300 rounded-lg overflow-hidden h-[600px]">
              <iframe
                src={res.url}
                width="100%"
                height="100%"
                style={{ border: "none" }}
              />
            </div>
          </CardContent>
        </Card>
      ))}

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
