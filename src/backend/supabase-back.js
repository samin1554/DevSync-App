import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wlfhkziqquyxkvvmxugi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZmhremlxcXV5eGt2dm14dWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE5MzYsImV4cCI6MjA2NjYyNzkzNn0.tTNE6frpqLJLzzgMSSMsEdDsrWAHEbBskLv9E-ND_rQ';
export const supabase = createClient(supabaseUrl, supabaseKey)

// Fetch all tasks for the current user
export async function fetchTasks() {
  const user = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.data.user.id)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data;
}