import { createClient } from '@supabase/supabase-js'

// This line is looking for the exact name VITE_SUPABASE_URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials missing! Check Cloudflare Env Vars.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)