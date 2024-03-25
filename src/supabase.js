import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://gsuehtkylpyhieauymxg.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzdWVodGt5bHB5aGllYXV5bXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyOTA2OTEsImV4cCI6MjAyNjg2NjY5MX0.-BDC2D5Db2P3NfcDu5nD0MbBS39NIo2yvvDqoBwPSb0";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
