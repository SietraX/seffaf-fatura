import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const monthNameToNumber: { [key: string]: number } = {
  'Ocak': 1, 'Şubat': 2, 'Mart': 3, 'Nisan': 4, 'Mayıs': 5, 'Haziran': 6,
  'Temmuz': 7, 'Ağustos': 8, 'Eylül': 9, 'Ekim': 10, 'Kasım': 11, 'Aralık': 12
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
    billData.user_id = userId

    // Convert month name to number
    const monthParts = billData.contract_start_month.split(' ')
    const monthName = monthParts[0]
    const monthNumber = monthNameToNumber[monthName]

    if (!monthNumber) {
      return NextResponse.json({ error: 'Invalid month name' }, { status: 400 })
    }

    billData.contract_start_month = monthNumber

    const { data, error } = await supabase
      .from('user_bills')
      .insert(billData)

    if (error) {
      console.error('Error inserting data:', error)
      return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Bill submitted successfully', data })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}