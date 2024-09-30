import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomCardProps {
  title: string;
  content: React.ReactNode;
  footer: React.ReactNode;
}

export function CustomCard({ title, content, footer }: CustomCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center pb-4">
        {content}
      </CardContent>
      <CardFooter>{footer}</CardFooter>
    </Card>
  );
}
