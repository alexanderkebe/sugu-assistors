import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aramzxjzhsyphznjlpqo.supabase.co';
const supabaseAnonKey = 'sb_publishable_eZUmdeg6JAD3PLZwVJUJ-A_57UFrmZS';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
