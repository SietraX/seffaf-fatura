import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useToast } from '@/hooks/use-toast'

export function useSubmitBill() {
  const { isSignedIn, user } = useUser()
  const [lastSubmissionDate, setLastSubmissionDate] = useState<Date | null>(null)
  const [isSubmissionAllowed, setIsSubmissionAllowed] = useState(true)
  const [nextSubmissionDate, setNextSubmissionDate] = useState<Date | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetchLastSubmissionDate();
    }
  }, [isSignedIn, user?.id])

  useEffect(() => {
    if (lastSubmissionDate) {
      const thirtyDaysLater = new Date(lastSubmissionDate);
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      setNextSubmissionDate(thirtyDaysLater);

      const now = new Date();
      setIsSubmissionAllowed(now >= thirtyDaysLater);
    }
  }, [lastSubmissionDate])

  const fetchLastSubmissionDate = async () => {
    try {
      const response = await fetch('/api/get-last-submission');
      if (response.ok) {
        const data = await response.json();
        if (data.lastSubmissionDate) {
          setLastSubmissionDate(new Date(data.lastSubmissionDate));
        }
      }
    } catch (error) {
      console.error('Error fetching last submission date:', error);
    }
  }

  const submitBill = async (formData: any) => {
    if (!isSubmissionAllowed) return;

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit bill')
      }

      toast({
        title: 'Success',
        description: data.message,
      })
      fetchLastSubmissionDate();
      return true;
    } catch (error) {
      console.error('Error submitting bill:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'There was an error submitting your bill. Please try again.',
        variant: 'destructive',
      })
      return false;
    }
  }

  return {
    isSignedIn,
    isSubmissionAllowed,
    nextSubmissionDate,
    submitBill,
  }
}