import { LoaderArgs, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { RefreshToken, verifyToken } from "~/services/auth.server";
import { commitSession, destroySession, getSession } from "~/sessions";

export const loader = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("idToken")) throw redirect("/signin");
  const verifiedToken: any = await verifyToken(session.get("idToken"));
  if (!verifiedToken) {
    const newIdToken = await RefreshToken(session.get("refreshToken"));
    if (!newIdToken) {
      throw redirect("/signin", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    }
    session.set("idToken", newIdToken);
    return redirect(request.url, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
  return null;
};

export default function Protected() {
  return <Outlet />;
}

import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div style={{ maxWidth: "100%" }}>
        <h3 style={{ color: "red" }}>
          {error.status} {error.statusText}
        </h3>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div style={{ maxWidth: "100%" }}>
        <h3 style={{ color: "red" }}>Something went wrong !</h3>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h3 style={{ color: "red" }}>Unknown Error</h3>;
  }
}
