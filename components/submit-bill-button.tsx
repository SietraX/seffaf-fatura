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
      <Button onClick={() => window.location.href = '/sign-in'}>
        Submit Your Bill
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant={isSubmissionAllowed ? "default" : "outline"} disabled={!isSubmissionAllowed}>
                Submit Your Bill
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          {!isSubmissionAllowed && (
            <TooltipContent>
              <p>You can submit your next bill on {nextSubmissionDate?.toLocaleDateString()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-foreground">Submit Your Bill</DialogTitle>
        </DialogHeader>
        <SubmitBillForm 
          onSubmissionComplete={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}