// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qcztrnwvzzabitndicig.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjenRybnd2enphYml0bmRpY2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxODMzODgsImV4cCI6MjA1NDc1OTM4OH0.DOh3CsJacNi496AG6aO_yFHZMwbUhYKnJwx-jcBz8Lk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);