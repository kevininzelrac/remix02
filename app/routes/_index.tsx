import { Await, useLoaderData, useNavigation } from "@remix-run/react";
import { LoaderArgs, LoaderFunction, defer } from "@remix-run/node";
import { API } from "aws-amplify";
import getPost from "../graphQL/query/getPost.gql";
import { Suspense } from "react";

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
  const navigation = useNavigation();

  return (
    <main>
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
              <section>{getPost.content}</section>
              <br />
              <h3>REMIX WEB APP</h3>
              <br />
              <p>
                <strong>Frontent</strong> - <i>Server Side Rendering</i>
              </p>
              <p>CloudFront Distribution</p>
              <p>S3 Bucket</p>
              <br />
              <p>
                <strong>Backend</strong> - <i>Serverless Architecture</i>
              </p>
              <p>Lambda:Edge</p>
              <p>GraphQL Queries / Mutations / Subscriptions</p>
              <p>AppSync Schemas & JS Resolvers</p>
              <p>DynamoDb</p>
              <p>Cognito Authentication</p>
              <br />
              <p>
                <strong>Deployment</strong> - <i>CI/CD pipeline</i>
              </p>
              <p>Github Actions</p>
            </main>
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
