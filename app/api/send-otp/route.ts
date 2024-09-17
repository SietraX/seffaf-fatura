import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

// Function to send SMS using the A2P SMS API
async function sendSMS(phoneNumber: string, message: string) {
  const url = 'https://api.iletimerkezi.com/v1/send-sms/json'
  const key = process.env.SMS_API_KEY
  const hash = process.env.SMS_API_HASH

  const payload = {
    request: {
      authentication: {
        key,
        hash,
      },
      order: {
        sender: "APITEST",
        message: {
          text: message,
          receipents: {
            number: [phoneNumber]
          }
        }
      }
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to send SMS')
  }

  return await response.json()
}

export async function POST(request: Request) {
  const { phoneNumber } = await request.json()

  // Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

  // Store OTP in database
  const { error } = await supabase
    .from('otp_codes')
    .insert({ phone_number: phoneNumber, code: otp, expires_at: expiresAt })

  if (error) {
    return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 })
  }

  // Send OTP via SMS
  try {
    await sendSMS(phoneNumber, `Your OTP is: ${otp}`)
    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}