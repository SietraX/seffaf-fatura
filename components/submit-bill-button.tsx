'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/hooks/use-toast'
import { generatePastMonths } from '@/lib/utils'
import { addDays, differenceInDays } from 'date-fns'

interface BillFormData {
  provider_name: string
  gigabyte_package: number
  voice_call_limit: number
  sms_limit: number
  bill_price: number
  contract_start_month: string
}

const providers = ['Turkcell', 'Türk Telekom', 'Vodafone', 'Netgsm']
const gigabytePackages = [4,5,6,8,10,12,15,16,20,25,30,40,50,60,75,80,100,150]
const startMonths = generatePastMonths(12) // Assuming this function exists in your utils

export function SubmitBillButton() {
  const [formData, setFormData] = useState<BillFormData>({
    provider_name: '',
    gigabyte_package: 0,
    voice_call_limit: 0,
    sms_limit: 0,
    bill_price: 0,
    contract_start_month: '',
  })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await fetch('/api/submit-bill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      toast({
        title: "Bill submitted successfully",
        description: "Your bill has been added to your account.",
      })
      setOpen(false) // Close the dialog
      // Reset form here if needed
    } else {
      toast({
        title: "Error submitting bill",
        description: "There was a problem submitting your bill. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof BillFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Submit Bill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Bill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* Your form fields here */}
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}