const SUPABASE_URL = "https://tkmbsftaeijtylxlgway.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrbWJzZnRhZWlqdHlseGxnd2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxNTE4NjUsImV4cCI6MjA4MjcyNzg2NX0.y5nZS4X-ZU6H9osqqA4ZTKLFCHT99Mg4fwPI3k1rWSE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);