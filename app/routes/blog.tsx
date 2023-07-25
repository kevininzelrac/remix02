import { API } from "aws-amplify";
import { Await, useFetcher, useLoaderData } from "@remix-run/react";
import { ActionArgs, defer, json } from "@remix-run/node";
import { Suspense, useRef } from "react";
import { GraphQLQuery } from "@aws-amplify/api";
import getPostsByType from "../graphQL/query/getPostsByType.gql";
import InfiniteScroll from "../components/infiniteScroll/infiniteScroll";
import Posts from "~/components/posts/posts";

import styles from "~/styles/blog.css";
export let links = () => [{ rel: "stylesheet", href: styles }];

export const loader = async () => {
  const data = API.graphql<GraphQLQuery<post>>({
    query: getPostsByType,
    variables: { type: "post", limit: 4 },
  });
  return defer({ data });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const { nextToken }: any = Object.fromEntries(formData);
  const { data } = await API.graphql<GraphQLQuery<post>>({
    query: getPostsByType,
    variables: { type: "post", limit: 4, nextToken },
  });
  return json(data);
};

export default function Blog() {
  const { data }: any = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const clientRef: any = useRef();

  return (
    <main ref={clientRef}>
      <h2>Blog</h2>
      <Suspense fallback={<div className="loader"></div>}>
        <Await resolve={data} errorElement={<p>Error loading Index Page!</p>}>
          {({ data: { getPostsByType } }) => (
            <InfiniteScroll
              loaderData={getPostsByType}
              fetcherData={fetcher.data?.getPostsByType}
              fetcher={fetcher}
              clientRef={clientRef}
            >
              {(posts: any) => <Posts posts={posts} />}
            </InfiniteScroll>
          )}
        </Await>
      </Suspense>
      {fetcher.state === "submitting" && <div className="loader"></div>}
    </main>
  );
}
