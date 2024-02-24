import type { Config, Context } from "@netlify/edge-functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yntmmqxawtjigczxvoas.supabase.co";
const supabaseKey = process.env.SUPABASE_PRIVATE_KEY;
if (!supabaseKey) {
  throw Error("internal server error");
}
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function (
  _req: Request,
  _ctxt: Context
): Promise<Response> {
  const { data, error } = await supabase.from("page_views").select();
  if (error) {
    return new Response("internal server error reading from page_views");
  }
  return new Response(JSON.stringify(data));
}

export const config: Config = { path: "/pageViews" };
