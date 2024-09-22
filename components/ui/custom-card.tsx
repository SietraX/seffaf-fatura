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
      <CardHeader className="flex-shrink-0 py-1 sm:py-2 px-2 sm:px-3">
        <CardTitle className="text-xs sm:text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center p-1 sm:p-2">
        {content}
      </CardContent>
      {footer && <CardFooter className="text-xs sm:text-sm p-1 sm:p-2">{footer}</CardFooter>}
    </Card>
  );
}
