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
            A few more tools to help you in your studies. Good luck with your exams!
            <br />
            <Separator className="my-4" />
            <b>Things to know for the Final:</b>
            <ul className="list-disc list-inside">
                <li>Data Science Library (Pandas, Matplotlib, Numpy)</li>
                <li>Debugging</li>
                <li>2D lists, nested loops, referencing (pointers), tuples</li>
                <li>List Comprehensions: map, filter</li>
                <li>Dictionaries, nested dictionaries, sets</li>
                <li>Exceptions, Files (you are expected to know the type of errors)</li>
                <li>
                Object / Classes
                <ul className="list-disc list-inside ml-5">
                  <li>basic classes + annotations</li>
                  <li>containment (has-a)</li>
                  <li>inheritance (is-a) (multiple inheritance)</li>
                  <li>abstract classes</li>
                  <li>polymorphism</li>
                  <li>relational operators + total ordering + arithmetic operators</li>
                  <li>iterators: __iter__</li>
                  <li>iterable: __next__</li>
                </ul>
                </li>
                <li>
                Stacks ADT:
                <ul className="list-disc list-inside ml-5">
                  <li>push, pop, top, is_empty, repr, len</li>
                </ul>
                </li>
                <li>Recursion</li>
                <li>
                Sorting & searching algorithms:
                <ul className="list-disc list-inside ml-5">
                  <li>selection sort</li>
                  <li>merge sort</li>
                  <li>quick sort</li>
                  <li>insertion sort</li>
                  <li>binary search</li>
                  <li>bisect module</li>
                </ul>
                </li>
            </ul>
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
            <li>Eric Mayhew and Louisa Harutyunyan for their amazing teaching throughout semesters 1 and 2</li>
            <li>Louisa Harutyunyan for the original concepTests (idk if I'm allowed to keep those actually... oh well)</li>
            <li>Ke Yin for sharing his notes for all to use</li>
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
