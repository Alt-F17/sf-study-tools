import React, { useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

const PythonMindMap: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <Card className="w-full max-w-5xl mx-auto border border-gray-200 rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>Python Concept Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <iframe
          src="https://atlas.mindmup.com/bharanikumar/python_programming/index.html"
          title="Python Concept Map"
          className="w-full"
          style={{ border: 'none', height: 'calc(90vh - 5rem)' }}
          scrolling="no"
        />
      </CardContent>
    </Card>
  );
};

export default PythonMindMap;