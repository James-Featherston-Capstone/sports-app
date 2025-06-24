import { createClient } from "@supabase/supabase-js";
import env from "dotenv";

env.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default supabase;
