import dotenv from 'dotenv';
dotenv.config();
import {createClient} from "@supabase/supabase-js";

const dbURL = process.env.SUPABASE_URL;
const annonKEY = process.env.DATABASE_ANON_KEY;
export const supabase = createClient(dbURL, annonKEY);
//console.log(supabase);