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
import { createSupabaseClient } from '@/lib/supabase'
import { generatePastMonths } from '@/lib/utils'

interface BillFormData {
  provider_name: string
  gigabyte_package: number
  voice_call_limit: number
  sms_limit: number
  bill_price: number
  contract_start_month: string
}

interface BillSubmission {
  id: string;
  provider_name: string;
  gigabyte_package: number;
  voice_call_limit: number;
  sms_limit: number;
  bill_price: number;
  contract_start_month: number;
  user_id: string;
  created_at: string;
}

const providers = ['Turkcell', 'Türk Telekom', 'Vodafone', 'Netgsm']
const gigabytePackages = [4,5,6,8,10,12,15,16,20,25,30,40,50,60,75,80,100,150]

const monthNameToNumber: { [key: string]: number } = {
  'Ocak': 1, 'Şubat': 2, 'Mart': 3, 'Nisan': 4, 'Mayıs': 5, 'Haziran': 6,
  'Temmuz': 7, 'Ağustos': 8, 'Eylül': 9, 'Ekim': 10, 'Kasım': 11, 'Aralık': 12
};

export function SubmitBillButton() {
  const { isSignedIn, user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
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
  const [recentSubmissions, setRecentSubmissions] = useState<BillSubmission[]>([])

  useEffect(() => {
    const generatedMonths = generatePastMonths()
    setStartMonths(generatedMonths)
  }, [])

  useEffect(() => {
    const supabase = createSupabaseClient()
  
    const subscription = supabase
      .channel('user_bills_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_bills' }, (payload) => {
        console.log('New bill submitted:', payload.new)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchRecentSubmissions = async () => {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase
        .from('user_bills')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (data) {
        // Ensure the data matches the BillSubmission interface
        const typedData: BillSubmission[] = data.map(item => ({
          id: item.id as string,
          provider_name: item.provider_name as string,
          gigabyte_package: item.gigabyte_package as number,
          voice_call_limit: item.voice_call_limit as number,
          sms_limit: item.sms_limit as number,
          bill_price: item.bill_price as number,
          contract_start_month: item.contract_start_month as number,
          user_id: item.user_id as string,
          created_at: item.created_at as string
        }));
        setRecentSubmissions(typedData);
      }
    }

    fetchRecentSubmissions()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createSupabaseClient()

    try {
      // Convert the month name to a number
      const monthParts = formData.contract_start_month.split(' ');
      const monthName = monthParts[0];
      const monthNumber = monthNameToNumber[monthName];
      
      if (!monthNumber) {
        throw new Error('Invalid month name');
      }

      const { data, error } = await supabase.from('user_bills').insert({
        ...formData,
        contract_start_month: monthNumber, // Send the month number instead of the name
        user_id: user?.id,
      }).select()

      if (error) throw error

      console.log('Submitted data:', data)

      // Fetch the most recent entry
      if (user?.id) {
        const { data: recentEntry, error: fetchError } = await supabase
          .from('user_bills')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (fetchError) throw fetchError

        console.log('Most recent entry:', recentEntry)
      }

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

  const handleInputChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isSignedIn) {
    return (
      <Button onClick={() => window.location.href = '/sign-in'} className="bg-primary text-primary-foreground hover:bg-primary/90">
        Submit Your Bill
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Submit Your Bill</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground">Submit Your Bill</DialogTitle>
        </DialogHeader>
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
          
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}