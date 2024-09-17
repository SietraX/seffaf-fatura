import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

// Function to send SMS using the A2P SMS API
async function sendSMS(phoneNumber: string, message: string) {
  console.log('Attempting to send SMS to:', phoneNumber)
  const url = 'https://api.iletimerkezi.com/v1/send-sms/json'
  const key = process.env.SMS_API_KEY
  const hash = process.env.SMS_API_HASH

  if (!key || !hash) {
    console.error('SMS API credentials are missing')
    throw new Error('SMS API credentials are missing')
  }

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

  console.log('Sending request to SMS API with payload:', JSON.stringify(payload))

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('SMS API responded with status:', response.status)
      console.error('SMS API response:', await response.text())
      throw new Error('Failed to send SMS')
    }

    const responseData = await response.json()
    console.log('SMS API response:', responseData)
    return responseData
  } catch (error) {
    console.error('Error in sendSMS function:', error)
    throw error
  }
}

export async function POST(request: Request) {
  console.log('Received POST request to /api/send-otp')
  try {
    const { phoneNumber } = await request.json()
    console.log('Phone number received:', phoneNumber)

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
    console.log('Generated OTP:', otp)

    // Store OTP in database
    console.log('Attempting to store OTP in database')
    const { error } = await supabase
      .from('otp_codes')
      .insert({ phone_number: phoneNumber, code: otp, expires_at: expiresAt })

    if (error) {
      console.error('Error storing OTP in database:', error)
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 })
    }

    console.log('OTP stored successfully in database')

    // Send OTP via SMS
    console.log('Attempting to send OTP via SMS')
    try {
      await sendSMS(phoneNumber, `Your OTP is: ${otp}`)
      console.log('OTP sent successfully via SMS')
      return NextResponse.json({ message: 'OTP sent successfully' })
    } catch (smsError: any) {
      console.error('Failed to send SMS:', smsError)
      // Check if the error is due to insufficient balance
      if (smsError.message.includes('Bakiye yetersiz')) {
        // TODO: Implement a notification system to alert administrators about low balance
        console.error('SMS account balance is insufficient. Please recharge the account.')
        // For now, we'll return the OTP in the response (only for development purposes)
        return NextResponse.json({ message: 'OTP generated but not sent via SMS', otp }, { status: 200 })
      }
      // For other types of errors, return a generic error message
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in POST handler:', error)
    return NextResponse.json({ error: 'Failed to process OTP request' }, { status: 500 })
  }
}