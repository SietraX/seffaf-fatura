'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { generatePastMonths } from '@/lib/utils'
import { useSubmitBill } from '@/hooks/useSubmitBill'

interface BillFormData {
  provider_name: string
  gigabyte_package: number
  voice_call_limit: number
  sms_limit: number
  bill_price: number
  contract_start_month: string
}

interface SubmitBillFormProps {
  onSubmissionComplete: () => void
}

const providers = ['Turkcell', 'Türk Telekom', 'Vodafone', 'Netgsm']
const gigabytePackages = [4,5,6,8,10,12,15,16,20,25,30,40,50,60,75,80,100,150]

export function SubmitBillForm({ onSubmissionComplete }: SubmitBillFormProps) {
  const [formData, setFormData] = useState<BillFormData>({
    provider_name: '',
    gigabyte_package: 4,
    voice_call_limit: 100,
    sms_limit: 100,
    bill_price: 50,
    contract_start_month: '',
  })
  const [startMonths] = useState<string[]>(generatePastMonths(12))
  const { isSubmissionAllowed, submitBill } = useSubmitBill()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await submitBill(formData)
    if (success) {
      onSubmissionComplete()
    }
  }

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-foreground">
       <div className="flex items-center space-x-4">
       <Label htmlFor="provider_name" className="w-1/3">Provider</Label>
       <div className="w-2/3">
              <Select onValueChange={(value) => handleInputChange('provider_name', value)}>
                <SelectTrigger id="provider_name" className="bg-background">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {providers.map((provider) => (
                    <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="gigabyte_package" className="w-1/3">GB Package</Label>
            <div className="w-2/3">
              <Select onValueChange={(value) => handleInputChange('gigabyte_package', Number(value))}>
                <SelectTrigger id="gigabyte_package" className="bg-background">
                  <SelectValue placeholder="Select GB" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {gigabytePackages.map((gb) => (
                    <SelectItem key={gb} value={gb.toString()}>{gb} GB</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="voice_call_limit" className="w-1/3">Voice Call Limit</Label>
            <Input 
              type="number" 
              id="voice_call_limit" 
              value={formData.voice_call_limit} 
              onChange={(e) => handleInputChange('voice_call_limit', Math.max(100, Math.min(5000, Number(e.target.value))))}
              min="100"
              max="5000"
              required 
              className="bg-background w-2/3"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="sms_limit" className="w-1/3">SMS Limit</Label>
            <Input 
              type="number" 
              id="sms_limit" 
              value={formData.sms_limit} 
              onChange={(e) => handleInputChange('sms_limit', Math.max(100, Math.min(5000, Number(e.target.value))))}
              min="100"
              max="5000"
              required 
              className="bg-background w-2/3"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="bill_price" className="w-1/3">Bill Price</Label>
            <Input 
              type="number" 
              id="bill_price" 
              value={formData.bill_price} 
              onChange={(e) => handleInputChange('bill_price', Math.max(50, Math.min(2000, Number(e.target.value))))}
              min="50"
              max="2000"
              required 
              className="bg-background w-2/3"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Label htmlFor="contract_start_month" className="w-1/3">Contract Start Month</Label>
            <div className="w-2/3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start bg-background">
                    {formData.contract_start_month || "Select month"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-2 bg-background">
                  <div className="grid grid-cols-3 gap-2">
                    {startMonths.map((month) => (
                      <Button
                        key={month}
                        size="sm"
                        variant={formData.contract_start_month === month ? 'default' : 'outline'}
                        onClick={() => handleInputChange('contract_start_month', month)}
                        className="w-full"
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>


      <Button type="submit" className="w-full" disabled={!isSubmissionAllowed}>Submit</Button>
    </form>
  )
}