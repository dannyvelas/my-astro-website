import type { Config, Context } from "@netlify/edge-functions";

export default async function (
  _req: Request,
  _ctxt: Context
): Promise<Response> {
  return new Response("Hello world");
}

export const config: Config = { path: "/test" };
