import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const { phoneNumber, otp } = await request.json()

  // Verify OTP
  const { data, error } = await supabase
    .from('otp_codes')
    .select()
    .eq('phone_number', phoneNumber)
    .eq('code', otp)
    .eq('is_used', false)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
  }

  // Mark OTP as used
  await supabase
    .from('otp_codes')
    .update({ is_used: true })
    .eq('id', data.id)

  return NextResponse.json({ message: 'OTP verified successfully' })
}