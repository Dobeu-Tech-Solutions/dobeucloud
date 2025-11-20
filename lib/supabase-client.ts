import { createBrowserClient } from '@supabase/ssr';

// Environment variables will be set in Netlify
// Using placeholders for build

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Browser client
export const createBrowserSupabaseClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey);

// Types for Supabase Auth
export type SupabaseClient = ReturnType<typeof createBrowserSupabaseClient>;
