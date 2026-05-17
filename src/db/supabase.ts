
            import { createClient } from "@supabase/supabase-js";

            // import.meta.env typing can vary across environments; cast to any for safety
            const _env = (import.meta as any).env;
            const supabaseUrl = _env.VITE_SUPABASE_URL as string;
            const supabaseAnonKey = _env.VITE_SUPABASE_ANON_KEY as string;

            export const supabase = createClient(supabaseUrl, supabaseAnonKey);
