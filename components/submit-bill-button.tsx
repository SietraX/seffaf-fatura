'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { SubmitBillForm } from '@/components/submit-bill-form'
import { useSubmitBill } from '@/hooks/useSubmitBill'

export function SubmitBillButton() {
  const [open, setOpen] = useState(false)
  const { isSignedIn, isSubmissionAllowed, nextSubmissionDate } = useSubmitBill()

  if (!isSignedIn) {
    return (
      <Button 
      className="bg-blue-500 text-white px-6 py-6 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors"
      onClick={() => window.location.href = '/sign-in'}>
        Faturanı paylaş
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isSubmissionAllowed ? (
          <Button className="bg-blue-500 text-white px-6 py-6 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors">Faturanı paylaş</Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="bg-blue-500 text-white px-6 py-6 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors" disabled>Faturanı paylaş</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Faturanı şu tarihten itibaren güncelleyebilirsin: {nextSubmissionDate?.toLocaleDateString()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-foreground">Fatura bilgilerin</DialogTitle>
        </DialogHeader>
        <SubmitBillForm 
          onSubmissionComplete={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}