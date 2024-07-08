import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://feyjgqyswmfjgtxaegqo.supabase.co';
const supabaseKey = process.env.PLASMO_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
