import { LoaderArgs, LoaderFunction, defer } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { API } from "aws-amplify";
import { Suspense } from "react";
import getPost from "../graphQL/query/getPost.gql";
import styles from "~/styles/page.css";

export let links = () => [{ rel: "stylesheet", href: styles }];

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const data: any = API.graphql({
    query: getPost,
    variables: { label: params.post },
  });
  return defer({ data });
};

export default function Post() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <main>
      <Suspense fallback={<div className="loader"></div>}>
        <Await resolve={data} errorElement={<p>Error loading Page !</p>}>
          {({ data: { getPost } }) => (
            <>
              <h2>{getPost.label}</h2>
              <section>{getPost.content}</section>
            </>
          )}
        </Await>
      </Suspense>
    </main>
  );
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
/* 
return (
  <>
    {children.length ? (
      <aside>
        {children?.map(({ label }: any) => (
          <NavLink key={label} to={pathname + "/" + label}>
            {label}
          </NavLink>
        ))}
      </aside>
    ) : (
      <main
        key={label}
        style={{
          animationName: navigation.state === "idle" ? "slideDown" : "slideUp",
        }}
      >
        <h2>{label}</h2>
        <section>{content}</section>
      </main>
    )}
  </>
); */
