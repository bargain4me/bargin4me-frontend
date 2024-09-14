// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Supabase URL and public anon key
const supabaseUrl = process.env.PLASMO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PLASMO_PUBLIC_SUPABASE_KEY; // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
