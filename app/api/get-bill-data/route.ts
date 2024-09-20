import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: Request) {
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const { searchParams } = new URL(req.url)
  const sse = searchParams.get('sse')

  if (sse === 'true') {
    const stream = new ReadableStream({
      async start(controller) {
        const sendData = async () => {
          const { data, error } = await supabase
            .from('user_bills')
            .select('provider_name, gigabyte_package, voice_call_limit, sms_limit, bill_price, contract_start_month, contract_start_date, updated_at')

          if (error) {
            controller.enqueue(`data: ${JSON.stringify({ error: 'Internal Server Error' })}\n\n`)
            return
          }

          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
        }

        // Send initial data
        await sendData()

        // Set up Supabase real-time subscription
        const subscription = supabase
          .channel('table-db-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'user_bills'
            },
            sendData
          )
          .subscribe()

        // Keep the connection alive
        const intervalId = setInterval(() => {
          controller.enqueue(': keepalive\n\n')
        }, 30000)

        // Clean up on close
        req.signal.addEventListener('abort', () => {
          clearInterval(intervalId)
          subscription.unsubscribe()
        })
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } else {
    // Regular data fetch
    const { data, error } = await supabase
      .from('user_bills')
      .select('provider_name, gigabyte_package, voice_call_limit, sms_limit, bill_price, contract_start_month, contract_start_date, updated_at')

    if (error) {
      console.error('Error fetching data:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  }
}