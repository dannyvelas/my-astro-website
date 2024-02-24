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
  let reqBody: any;
  try {
    reqBody = await req.json();
  } catch (err) {
    console.log(`warning: no body or malformed body: ${err}`);
    return new Response("no body or malformed body");
  }

  const message = !reqBody.path
    ? "path not found"
    : !context.ip
      ? "missing ip"
      : null;
  if (message) {
    console.log(`warning: ${message}`);
    return new Response(message);
  }

  try {
    const { error } = await supabase.from("page_views").insert({
      path: reqBody.path,
      ip: context.ip,
      city: context.geo.city,
      country: context.geo.country?.name,
    });
    if (error) {
      console.log(`psql error inserting into supabase: ${error}`);
      return new Response("internal server error");
    }

    return new Response("ok");
  } catch (err) {
    console.log(`exception inserting into supabase: ${err}.`);
    return new Response("internal server error");
  }
}

export const config: Config = { path: "/pageViews" };
