import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { monthNameToNumber } from '@/utils/monthNameToNumber'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY!

async function verifyRecaptcha(token: string) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${recaptchaSecretKey}&response=${token}`,
  })
  const data = await response.json()
  return data.success
}

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    const billData = await request.json()
    const { recaptchaToken, contract_start_date, ...billDetails } = billData

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken)
    if (!isRecaptchaValid) {
      return NextResponse.json({ error: 'Invalid reCAPTCHA' }, { status: 400 })
    }

    billDetails.user_id = userId
    billDetails.contract_start_date = new Date(contract_start_date).toISOString()

    // Convert month name to number
    const monthParts = billData.contract_start_month.split(' ')
    const monthName = monthParts[0]
    const monthNumber = monthNameToNumber[monthName]

    if (!monthNumber) {
      return NextResponse.json({ error: 'Geçersiz ay adı' }, { status: 400 })
    }

    billDetails.contract_start_month = monthNumber

    // Check if user_id exists in the table
    const { data: existingBill, error: fetchError } = await supabase
      .from('user_bills')
      .select('created_at, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing bill:', fetchError)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    const now = new Date()

    if (existingBill) {
      const lastUpdateDate = new Date(existingBill.updated_at || existingBill.created_at)
      const daysSinceLastUpdate = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 3600 * 24)

      if (daysSinceLastUpdate < 30) {
        return NextResponse.json({ error: 'You can only update your bill once every 30 days' }, { status: 400 })
      }

      // Update existing bill
      const { data, error } = await supabase
        .from('user_bills')
        .update({ ...billDetails, updated_at: now.toISOString() })
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating data:', error)
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
      }

      return NextResponse.json({ message: 'Bill updated successfully', data })
    } else {
      // Insert new bill
      const { data, error } = await supabase
        .from('user_bills')
        .insert({ ...billDetails, created_at: now.toISOString(), updated_at: now.toISOString() })

      if (error) {
        console.error('Error inserting data:', error)
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
      }

      return NextResponse.json({ message: 'Bill submitted successfully', data })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}