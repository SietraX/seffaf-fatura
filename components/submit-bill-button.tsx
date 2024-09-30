"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SubmitBillForm } from "@/components/submit-bill-form";
import { useSubmitBill } from "@/hooks/useSubmitBill";
import { Share } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubmitBillButtonProps {
  isNavbar?: boolean;
}

export function SubmitBillButton({ isNavbar = false }: SubmitBillButtonProps) {
  const [open, setOpen] = useState(false);
  const { isSignedIn, isSubmissionAllowed, nextSubmissionDate } =
    useSubmitBill();

  const buttonContent = (
    <>
      <Share className={`${isNavbar ? 'mr-1 h-4 w-4' : 'mr-2 h-5 w-5'}`} />
      {isNavbar ? "Paylaş" : "Faturanı paylaş"}
    </>
  );

  const buttonClass = isNavbar
    ? "text-sm px-2 py-1 h-8 bg-blue-500 hover:bg-blue-600 rounded-xl text-white hover:shadow-lg transition"
    : "landing-button bg-blue-500 hover:bg-blue-600";

  if (!isSignedIn) {
    return (
      <Button
        className={buttonClass}
        onClick={() => (window.location.href = "/sign-in")}
      >
        {buttonContent}
      </Button>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isSubmissionAllowed ? (
            <Button className={buttonClass}>
              {buttonContent}
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={buttonClass}
                    disabled
                  >
                    {buttonContent}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Faturanı şu tarihten itibaren güncelleyebilirsin:{" "}
                    {nextSubmissionDate?.toLocaleDateString()}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </DialogTrigger>
        <DialogContent className="w-full md:max-w-[425px] h-full md:h-auto p-0 rounded-2xl overflow-hidden">
          <Card className="border-0 shadow-none rounded-none w-full h-full md:h-auto flex flex-col">
            <CardHeader className="rounded-t-2xl bg-gray-50">
              <CardTitle className="text-2xl font-bold text-center">
                Fatura Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center p-0 sm:p-6">
              <div className="w-[90%] sm:w-full h-full flex items-center justify-center">
                <SubmitBillForm onSubmissionComplete={() => setOpen(false)} />
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
