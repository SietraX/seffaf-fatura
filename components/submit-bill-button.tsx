'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createSupabaseClient } from '@/lib/supabase'

interface BillFormData {
  phone_number: string
  provider_name: string
  gigabyte_package: number
  voice_call_limit: number
  sms_limit: number
  bill_price: number
  contract_renewal_month: number
}

export function SubmitBillButton() {
  const { isSignedIn, user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<BillFormData>({
    phone_number: '',
    provider_name: '',
    gigabyte_package: 0,
    voice_call_limit: 0,
    sms_limit: 0,
    bill_price: 0,
    contract_renewal_month: 0,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createSupabaseClient()

    try {
      const { error } = await supabase.from('user_bills').insert({
        ...formData,
        user_id: user?.id,
      })

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Your bill has been submitted successfully.',
      })
      setIsOpen(false)
    } catch (error) {
      console.error('Error submitting bill:', error)
      toast({
        title: 'Error',
        description: 'There was an error submitting your bill. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name.includes('_limit') || name.includes('_package') || name.includes('price') || name.includes('month') ? Number(value) : value }))
  }

  if (!isSignedIn) {
    return (
      <Button onClick={() => window.location.href = '/sign-in'}>
        Submit Your Bill
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Submit Your Bill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-foreground">Submit Your Bill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input 
              id="phone_number" 
              name="phone_number" 
              value={formData.phone_number} 
              onChange={handleInputChange} 
              required 
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider_name">Provider Name</Label>
            <Input 
              id="provider_name" 
              name="provider_name" 
              value={formData.provider_name} 
              onChange={handleInputChange} 
              required 
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gigabyte_package">Gigabyte Package</Label>
            <Input 
              type="number" 
              id="gigabyte_package" 
              name="gigabyte_package" 
              value={formData.gigabyte_package} 
              onChange={handleInputChange} 
              required 
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="voice_call_limit">Voice Call Limit</Label>
            <Input type="number" id="voice_call_limit" name="voice_call_limit" value={formData.voice_call_limit} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sms_limit">SMS Limit</Label>
            <Input type="number" id="sms_limit" name="sms_limit" value={formData.sms_limit} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bill_price">Bill Price</Label>
            <Input type="number" id="bill_price" name="bill_price" value={formData.bill_price} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contract_renewal_month">Contract Renewal Month</Label>
            <Input type="number" id="contract_renewal_month" name="contract_renewal_month" value={formData.contract_renewal_month} onChange={handleInputChange} required />
          </div>
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}