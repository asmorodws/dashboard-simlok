// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const option = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'ngrok-skip-browser-warning': '1231'
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseKey, option);
