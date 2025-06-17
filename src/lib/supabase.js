// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dkqjykqzefcfupkxnnjz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrcWp5a3F6ZWZjZnVwa3hubmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwODIwOTYsImV4cCI6MjA2NTY1ODA5Nn0.hQkSNHNJ_C7DT4V7IqoCAK87I7i23yRrfURD5ZwgmDI";

export const supabase = createClient(supabaseUrl, supabaseKey);
