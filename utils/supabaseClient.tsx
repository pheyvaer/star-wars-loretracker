import { createClient } from '@supabase/supabase-js';

// TODO: fix this. I added dummy data to get the server started.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://example.com/";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "my-key";

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
