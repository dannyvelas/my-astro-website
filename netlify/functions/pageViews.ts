import type { Context } from "@netlify/functions";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import "dotenv/config";

const creds = process.env.FIREBASE_CREDS;
if (!creds) {
  throw Error("internal server error");
}

initializeApp({
  credential: cert(creds),
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
