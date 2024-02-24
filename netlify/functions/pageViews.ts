import type { Context } from "@netlify/functions";
import type { ServiceAccount } from "firebase-admin/app";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./tiny-blog-database-e4e6d46e92f3.json";

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
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
