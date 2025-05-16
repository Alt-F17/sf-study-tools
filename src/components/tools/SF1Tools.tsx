import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SF1Tools: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SF1 Study Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          src="/sf1/sf1-study-tools.html"
          title="SF1 Study Tools"
          className="w-full h-[calc(100vh-6rem)] border-none"
        />
      </CardContent>
    </Card>
  );
};

export default SF1Tools;
