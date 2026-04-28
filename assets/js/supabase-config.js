import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://daxrirnhbcfpqzswjofl.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheHJpcm5oYmNmcHF6c3dqb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTMyMDEsImV4cCI6MjA5Mjg4OTIwMX0.TPUO_0M1cRLnmU035NKV7VxqG7jQGblS_v5ecM3Ptyo";

export const supabase = createClient("https://daxrirnhbcfpqzswjofl.supabase.co/rest/v1/", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRheHJpcm5oYmNmcHF6c3dqb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTMyMDEsImV4cCI6MjA5Mjg4OTIwMX0.TPUO_0M1cRLnmU035NKV7VxqG7jQGblS_v5ecM3Ptyo");