import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://rbzbfdfnhbxdrutvycpr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiemJmZGZuaGJ4ZHJ1dHZ5Y3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2OTU1NDUsImV4cCI6MjA1NzI3MTU0NX0.VmHmaQTUeSmCCkjdZiki3cGjXXQ4NZnmoMMQkZETWiU')

export const useSupabase = () => supabase