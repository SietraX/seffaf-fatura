import { createClient } from '@supabase/supabase-js'
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const createSupabaseClient = async (req: NextRequest) => {
  const { userId } = getAuth(req)

  if (supabaseInstance) return supabaseInstance

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        // Add Authorization header if required
        // Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  })

  return supabaseInstance
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not set');
}
