import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomCardProps {
  title: string;
  children: React.ReactNode;
}

export function CustomCard({ title, children }: CustomCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">{children}</CardContent>
    </Card>
  );
}
