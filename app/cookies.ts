import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const accessToken = createCookie("accessToken", {
  // These are defaults for this cookie.
  maxAge: 604_800, // one week
  path: "/",
  sameSite: "strict",
  httpOnly: true,
  secure: false,
});
