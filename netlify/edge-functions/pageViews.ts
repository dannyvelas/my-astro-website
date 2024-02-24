import type { Config, Context } from "@netlify/edge-functions";
import {
  initializeApp,
  cert,
} from "https://cdn.skypack.dev/firebase@8.7.0/app";
import { getFirestore } from "https://cdn.skypack.dev/firebase@8.7.0/firestore";

import fs from "node:fs/promises";

const serviceAccount = await fs.readFile(
  "../../tiny-blog-database-e4e6d46e92f3.json"
);

initializeApp({
  credential: cert(serviceAccount.toString()),
});

const db = getFirestore();

export default async function (
  _req: Request,
  _ctxt: Context
): Promise<Response> {
  const content = await db
    .collection("pageViews")
    .doc("C0fWPSKPN1n8Dthu6t1Y")
    .get();
  if (!content.exists) return new Response("DOES NOT EXIST");

  return new Response(JSON.stringify(content.data()));
}

export const config: Config = { path: "/pageViews" };
