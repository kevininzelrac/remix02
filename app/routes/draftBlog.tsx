import { API } from "aws-amplify";
import { Await, Link, useFetcher, useLoaderData } from "@remix-run/react";
import { ActionArgs, defer, json } from "@remix-run/node";
import { Suspense, useCallback, useEffect, useState } from "react";
import { GraphQLQuery } from "@aws-amplify/api";
import getPostsByType from "../graphQL/query/getPostsByType.gql";

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

  return (
    <main>
      <h2>Blog</h2>
      <Suspense fallback={<div className="loader"></div>}>
        <Await resolve={data} errorElement={<p>Error loading Index Page!</p>}>
          {({ data: { getPostsByType } }) => {
            const [posts, setPosts]: any = useState(getPostsByType.posts);
            const [nextToken, setNextToken]: any = useState(
              getPostsByType.nextToken
            );
            const [scrollPosition, setScrollPosition] = useState(0);
            const [clientHeight, setClientHeight] = useState(0);
            const [height, setHeight] = useState(null);
            const [shouldFetch, setShouldFetch] = useState(true);

            const divHeight = useCallback(
              (node: any) => {
                if (node !== null) {
                  setHeight(node.getBoundingClientRect().height);
                }
              },
              [posts.length]
            );

            useEffect(() => {
              const scrollListener = () => {
                setClientHeight(window.innerHeight);
                setScrollPosition(window.scrollY);
              };

              if (typeof window !== "undefined") {
                window.addEventListener("scroll", scrollListener);
              }

              return () => {
                if (typeof window !== "undefined") {
                  window.removeEventListener("scroll", scrollListener);
                }
              };
            }, []);

            useEffect(() => {
              if (!shouldFetch || !height) return;
              if (clientHeight + scrollPosition - 180 < height) return;

              fetcher.submit(
                {
                  nextToken,
                },
                { method: "post" }
              );
              setShouldFetch(false);
            }, [clientHeight, scrollPosition, fetcher]);

            useEffect(() => {
              if (
                fetcher.data &&
                fetcher.data?.getPostsByType.nextToken === nextToken
              ) {
                setShouldFetch(false);
                return;
              }

              if (
                fetcher.data &&
                fetcher.data?.getPostsByType.nextToken !== nextToken
              ) {
                setNextToken(fetcher.data?.getPostsByType.nextToken);
                fetcher.data?.getPostsByType.posts.map((newPosts: any) =>
                  setPosts((prev: any) => [...prev, newPosts])
                );
                setShouldFetch(true);
              }
            }, [fetcher.data]);

            return (
              <section ref={divHeight}>
                {posts?.map(
                  ({ label, category, author, date, content }: post) => (
                    <article key={label}>
                      <header>
                        <h3>
                          <Link to={category + "/" + label}>{label}</Link>
                        </h3>
                        <p>
                          <Link to={category}>{category}</Link>
                          <span>{author}</span>
                          <time>{new Date(date).toLocaleDateString()}</time>
                        </p>
                      </header>
                      <p>{content}</p>
                    </article>
                  )
                )}
                {fetcher.state === "submitting" && (
                  <div className="loader"></div>
                )}
              </section>
            );
          }}
        </Await>
      </Suspense>
    </main>
  );
}
