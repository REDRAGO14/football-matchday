import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fail fast at startup if environment variables are missing
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.'
  );
}

/**
 * Administrative Supabase Client
 * Uses the Service Role / Secret Key to bypass Row Level Security (RLS).
 * MUST ONLY BE USED ON THE BACKEND SERVER.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,     // Server-side: don't persist sessions locally
    autoRefreshToken: false,   // Server-side: no client token refreshing needed
    detectSessionInUrl: false, // Server-side: no browser URL tracking
  },
});