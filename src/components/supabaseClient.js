// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cslnkpnxwqahipwrjqna.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // truncated for security

export const supabase = createClient(supabaseUrl, supabaseKey);
