import { createClient } from '@supabase/supabase-js'

// GO TO SUPABASE -> SETTINGS -> API
// Copy "Project URL" into the first string
const supabaseUrl = 'https://hdvjlvbetykdwjqpmeug.supabase.co'

// Copy "anon public" key into the second string
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkdmpsdmJldHlrZHdqcXBtZXVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NzcxNDYsImV4cCI6MjA4MzE1MzE0Nn0.VSG7AUzI8NWS_NcWgNohEWnwSbA7H2qKY81Q_zO9kv4'

export const supabase = createClient(supabaseUrl, supabaseKey)