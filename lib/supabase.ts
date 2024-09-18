import { createClient } from '@supabase/supabase-js'

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const createSupabaseClient = () => {
	if (supabaseInstance) return supabaseInstance;

	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error('Supabase URL or Anonymous Key is missing')
	}

	supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
	return supabaseInstance
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
	throw new Error('Supabase environment variables are not set');
}
