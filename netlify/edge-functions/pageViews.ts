import type { Config, Context } from "@netlify/edge-functions";

const jokes = [
  "My New Years resolution is to stop leaving things so late.",
  "Child: Dad, make me a sandwich. Dad: Poof! You're a sandwich.",
  "The invention of the wheel was what got things rolling",
  "What kind of music do mummies like? Rap",
  "What do you get when you cross a chicken with a skunk? A fowl smell!",
];

export default async function (
  _req: Request,
  _ctxt: Context
): Promise<Response> {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  const randomJoke = jokes[randomIndex];
  return new Response(randomJoke);
}

export const config: Config = { path: "/pageViews" };
