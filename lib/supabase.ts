import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const createSupabaseClient = async () => {

  if (supabaseInstance) return supabaseInstance

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
      },
    },
  })

  return supabaseInstance
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are not set');
}
