import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uctcybxdlfaovwiohjdt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjdGN5YnhkbGZhb3Z3aW9oamR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NjkwOTMsImV4cCI6MjA4MDM0NTA5M30.KAYE4pqqmha6U8du-cl548VxyW9XA5Rx_wpS-ZYyzSM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
