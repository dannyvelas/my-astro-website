import type { Config, Context } from "@netlify/edge-functions";
import { createClient } from "@supabase/supabase-js";
import { createLogger, format, transports } from "npm:winston";

export const logger = createLogger({
  level: "http",
  format: format.combine(format.json(), format.timestamp()),
  transports: [new transports.Console()],
});

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
    logger.http(`no body or malformed body`, { error: err });
    return new Response("no body or malformed body");
  }

  const message = !reqBody.path
    ? "path not found"
    : !context.ip
      ? "missing ip"
      : null;
  if (message) {
    logger.http("missing fields", { error: message });
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
      logger.info(`psql error inserting into supabase`, { error });
      return new Response("internal server error");
    }

    return new Response("ok");
  } catch (err) {
    logger.info(`exception inserting into supabase`, { error: err });
    return new Response("internal server error");
  }
}

export const config: Config = { path: "/pageViews" };
