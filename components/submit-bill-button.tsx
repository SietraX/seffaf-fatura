'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { SubmitBillForm } from '@/components/submit-bill-form'
import { useSubmitBill } from '@/hooks/useSubmitBill'
import { Share } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SubmitBillButton() {
  const [open, setOpen] = useState(false)
  const { isSignedIn, isSubmissionAllowed, nextSubmissionDate } = useSubmitBill()

  const buttonContent = (
    <>
      <Share className="mr-2 h-5 w-5" />
      Faturanı paylaş
    </>
  )

  if (!isSignedIn) {
    return (
      <Button 
        className="landing-button bg-blue-500 hover:bg-blue-600"
        onClick={() => window.location.href = '/sign-in'}
      >
        {buttonContent}
      </Button>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isSubmissionAllowed ? (
            <Button className="landing-button bg-blue-500 hover:bg-blue-600">
              {buttonContent}
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="landing-button bg-blue-500 hover:bg-blue-600" disabled>
                    {buttonContent}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Faturanı şu tarihten itibaren güncelleyebilirsin: {nextSubmissionDate?.toLocaleDateString()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-0 rounded-2xl overflow-hidden">
          <Card className="w-full border-0 shadow-none rounded-none">
            <CardHeader className="rounded-t-2xl bg-gray-50">
              <CardTitle className="text-2xl font-bold text-center">
                Fatura Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <SubmitBillForm 
                onSubmissionComplete={() => setOpen(false)}
              />
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  )
}