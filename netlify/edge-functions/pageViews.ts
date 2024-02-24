import type { Config, Context } from "@netlify/edge-functions";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yntmmqxawtjigczxvoas.supabase.co";
const supabaseKey = process.env.SUPABASE_PRIVATE_KEY;
if (!supabaseKey) {
  throw Error("internal server error");
}
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function (
  req: Request,
  context: Context
): Promise<Response> {
  try {
    const reqBody = await req.json();
    const message = !reqBody.path
      ? "error: path not found"
      : !context.ip
        ? "error: missing ip"
        : null;
    if (message) {
      console.log(message);
      return new Response(message);
    }

    return new Response(
      JSON.stringify({
        path: reqBody.path,
        ip: context.ip,
        city: context.geo.city,
        country: context.geo.country,
      })
    );
  } catch (err) {
    console.log(`error in handler: ${err}.`);
    return new Response("internal server error");
  }
  //const { data, error } = await supabase.from("page_views").insert({
  //  path:
  //});
  //if (error) {
  //  return new Response("internal server error reading from page_views");
  //}
}

export const config: Config = { path: "/pageViews" };
