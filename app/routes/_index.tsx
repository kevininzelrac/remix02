import { redirect } from "@remix-run/node";

export const loader = async () => {
  return redirect("Home");
};

/* import {
  Await,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import { LoaderFunction, defer } from "@remix-run/node";
import { API } from "aws-amplify";
import getPost from "../graphQL/query/getPost.gql";
import { Suspense, useState } from "react";
import Edit from "~/components/slate/editButton";

import styles from "~/styles/page.css";
export let links = () => [{ rel: "stylesheet", href: styles }];

export const loader: LoaderFunction = async () => {
  return defer({
    data: API.graphql({
      query: getPost,
      variables: { label: "Home" },
    }),
  });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const { user }: any = useRouteLoaderData("root");
  const [edit, setEdit] = useState(false);
  const navigation = useNavigation();

  return (
    <Suspense fallback={<div className="loader"></div>}>
      <Await resolve={data} errorElement={<p>Error loading Index Page!</p>}>
        {({ data: { getPost } }) => (
          <main
            style={{
              animationName:
                navigation.state === "idle" ? "slideDown" : "slideUp",
            }}
          >
            <h2>{getPost.label}</h2>

            {user && <Edit data={getPost} />}
            <section className="slate">
              <TextEditor data={getPost} readOnly={true} />
            </section>
          </main>
        )}
      </Await>
    </Suspense>
  );
}

import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import TextEditor from "~/components/slate/editor";

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
 */
