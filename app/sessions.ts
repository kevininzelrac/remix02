import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "cognito",
      //domain: "localhost",
      httpOnly: true,
      //maxAge: 24 * 60 * 60,
      path: "/",
      sameSite: "strict",
      secrets: ["s3cret1"],
      //secure: process.env.NODE_ENV === "production",
    },
  });
