import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createSupabaseClient = async (useAuth = true) => {
	if (!useAuth) {
		return createClient(supabaseUrl, supabaseAnonKey);
	}

	try {
		const { getToken } = auth();
		const supabaseAccessToken = await getToken({ template: 'supabase' });

		if (!supabaseAccessToken) {
			console.log('No Supabase access token, using anon key');
			return createClient(supabaseUrl, supabaseAnonKey);
		}

		return createClient(supabaseUrl, supabaseAnonKey, {
			global: {
				headers: {
					Authorization: `Bearer ${supabaseAccessToken}`,
				},
			},
		});
	} catch (error) {
		console.error('Error creating Supabase client:', error);
		return createClient(supabaseUrl, supabaseAnonKey);
	}
};
