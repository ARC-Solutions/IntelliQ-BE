import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";

const dbURL = process.env.SUPABASE_URL;
const annonKEY = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(dbURL, annonKEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
//console.log(supabase);
