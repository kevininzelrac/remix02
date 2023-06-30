import { Await, useLoaderData } from "@remix-run/react";
import { LoaderFunction, defer, json } from "@remix-run/node";
import { API } from "aws-amplify";
import getPost from "../graphQL/query/getPost.gql";
import { Suspense } from "react";
import { GraphQLQuery } from "@aws-amplify/api";

import styles from "~/styles/page.css";
export let links = () => [{ rel: "stylesheet", href: styles }];

export const loader: LoaderFunction = async () => {
  /* let data: any = API.graphql({
    query: getPost,
    variables: { label: "Home" },
  });
  return defer(data); */
  return defer({
    data: API.graphql({
      query: getPost,
      variables: { label: "Home" },
    }),
  });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();

  return (
    <main>
      <Suspense fallback={<div className="loader"></div>}>
        <Await resolve={data} errorElement={<p>Error loading Index Page!</p>}>
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
      <div style={{ maxWidth: "400px" }}>
        <h3 style={{ color: "red" }}>
          {error.status} {error.statusText}
        </h3>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div style={{ maxWidth: "400px" }}>
        <h3 style={{ color: "red" }}>Error</h3>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h3 style={{ color: "red" }}>Unknown Error</h3>;
  }
}
