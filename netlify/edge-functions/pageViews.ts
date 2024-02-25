import type { Config, Context } from "@netlify/edge-functions";
import { createClient } from "@supabase/supabase-js";

// global connection information
const supabaseUrl = "https://yntmmqxawtjigczxvoas.supabase.co";
const supabaseKey = process.env.SUPABASE_PRIVATE_KEY;
if (!supabaseKey) {
  throw Error("internal server error");
}
const supabase = createClient(supabaseUrl, supabaseKey);

// function exports
export default async function (
  req: Request,
  context: Context
): Promise<Response> {
  let reqBody: any;
  try {
    reqBody = await req.json();
  } catch (err) {
    log("DEBUG", "no body or malformed body", { error: err });
    return new Response("no body or malformed body");
  }

  const message = !reqBody.path
    ? "path not found"
    : !context.ip
      ? "missing ip"
      : null;
  if (message) {
    log("DEBUG", "missing fields", { error: message });
    return new Response(message);
  }

  const point =
    context.geo.latitude &&
    context.geo.longitude &&
    `(${context.geo.longitude},${context.geo.latitude})`;

  try {
    const { error } = await supabase.from("page_views").insert({
      path: reqBody.path,
      ip: context.ip,
      city: context.geo.city,
      country: context.geo.country?.name,
      location: point,
      referrer: reqBody.referrer || null,
    });
    if (error) {
      log("INFO", "psql error inserting into supabase", { error });
      return new Response("internal server error");
    }

    return new Response("ok");
  } catch (err) {
    log("INFO", "exception inserting into supabase", { error: err });
    return new Response("internal server error");
  }
}

export const config: Config = { path: "/pageViews" };

// helpers
function log(level: string, message: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ level, message, ...data }));
}
