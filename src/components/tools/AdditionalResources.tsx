import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface Resource {
  title: string;
  url: string;
}

interface AdditionalResourcesProps {
  data: Resource[];
}

const AdditionalResources: React.FC<AdditionalResourcesProps> = ({ data }) => {
  // Cast imported JSON to typed array
  const resources = data;
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>A Few More Resources...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            A few more tools to help you in your studies. Good luck with your exams!
          </p>
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
            <br />
            <b>Many thanks to:</b>
            <li>Eric Mayhew, Louisa Harutyunyan and Lei for their amazing teaching throughout semesters 1 and 2</li>
            <li>Louisa Harutyunyan for the original concepTests (idk if I'm allowed to keep those actually... oh well)</li>
            <li>Evan Luo for also sharing his notes!</li>
            <li>Do people actually read these credits?</li>
            <li>Ngl, without my coffee machine, this wouldn't work... Props to you coffee machine!</li>
            <li>Anyways, thanks for using this silly tool. If it breaks, blame the coffee machine.</li>
            <br />
            <Separator className="my-4" />
            I may (or may not) have burnt an unfathomable amount of unrecoverable hours of sleep making this...
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdditionalResources;
