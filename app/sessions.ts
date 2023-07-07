import { createCookieSessionStorage } from "@remix-run/node";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "cognito",
      //domain: "localhost",
      httpOnly: true,
      //maxAge: 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET as string],
      secure: process.env.NODE_ENV === "production",
    },
  });
