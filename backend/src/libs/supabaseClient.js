import { createClient } from "@supabase/supabase-js";

// ✅ Use the Service Role Key in backend (never expose this to frontend!)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default supabase;
