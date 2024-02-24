import type { Config, Context } from "@netlify/functions";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs/promises";

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
