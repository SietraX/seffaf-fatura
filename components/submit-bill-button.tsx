'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useToast } from '@/hooks/use-toast'
import { generatePastMonths } from '@/lib/utils'

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

export function SubmitBillButton() {
  const { isSignedIn, user } = useUser()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<BillFormData>({
    provider_name: '',
    gigabyte_package: 4,
    voice_call_limit: 100,
    sms_limit: 100,
    bill_price: 50,
    contract_start_month: '',
  })
  const [startMonths, setStartMonths] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    console.log('SubmitBillButton: Generating past months');
    const generatedMonths = generatePastMonths(12);
    console.log('Generated months:', generatedMonths);
    setStartMonths(generatedMonths);
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/submit-bill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: user?.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit bill')
      }

      toast({
        title: 'Success',
        description: 'Your bill has been submitted successfully.',
      })
      setOpen(false)
    } catch (error) {
      console.error('Error submitting bill:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'There was an error submitting your bill. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isSignedIn) {
    return (
      <Button onClick={() => window.location.href = '/sign-in'}>
        Submit Your Bill
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Submit Your Bill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-foreground">Submit Your Bill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="provider_name" className="text-right">Provider</Label>
            <div className="col-span-2">
              <Select onValueChange={(value) => handleInputChange('provider_name', value)}>
                <SelectTrigger id="provider_name" className="w-full">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="gigabyte_package" className="text-right">GB Package</Label>
            <div className="col-span-2">
              <Select onValueChange={(value) => handleInputChange('gigabyte_package', Number(value))}>
                <SelectTrigger id="gigabyte_package" className="w-full">
                  <SelectValue placeholder="Select GB" />
                </SelectTrigger>
                <SelectContent>
                  {gigabytePackages.map((gb) => (
                    <SelectItem key={gb} value={gb.toString()}>{gb} GB</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="voice_call_limit" className="text-right">Voice Call Limit</Label>
            <Input 
              type="number" 
              id="voice_call_limit" 
              value={formData.voice_call_limit} 
              onChange={(e) => handleInputChange('voice_call_limit', Math.max(100, Math.min(5000, Number(e.target.value))))}
              min="100"
              max="5000"
              required 
              className="col-span-2 bg-background"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="sms_limit" className="text-right">SMS Limit</Label>
            <Input 
              type="number" 
              id="sms_limit" 
              value={formData.sms_limit} 
              onChange={(e) => handleInputChange('sms_limit', Math.max(100, Math.min(5000, Number(e.target.value))))}
              min="100"
              max="5000"
              required 
              className="col-span-2 bg-background"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="bill_price" className="text-right">Bill Price</Label>
            <Input 
              type="number" 
              id="bill_price" 
              value={formData.bill_price} 
              onChange={(e) => handleInputChange('bill_price', Math.max(50, Math.min(2000, Number(e.target.value))))}
              min="50"
              max="2000"
              required 
              className="col-span-2 bg-background"
            />
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="contract_start_month" className="text-right">Contract Start Month</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="col-span-2 justify-start w-full">
                  {formData.contract_start_month || "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0">
                <div className="grid grid-cols-3 gap-2 p-2">
                  {startMonths.map((month) => (
                    <Button
                      key={month}
                      size="sm"
                      variant={formData.contract_start_month === month ? 'default' : 'outline'}
                      onClick={() => handleInputChange('contract_start_month', month)}
                    >
                      {month}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}