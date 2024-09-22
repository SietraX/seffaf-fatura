import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CustomCardProps {
  title: string;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export function CustomCard({ title, content, footer }: CustomCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0 py-2 px-3">
        <CardTitle className="text-xs sm:text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        {content}
      </CardContent>
      {footer && <CardFooter className="text-xs sm:text-sm">{footer}</CardFooter>}
    </Card>
  );
}
