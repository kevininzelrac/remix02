import { API } from "aws-amplify";
import {
  Await,
  Link,
  useFetcher,
  useLoaderData,
  useParams,
} from "@remix-run/react";
import { ActionArgs, LoaderArgs, defer, json } from "@remix-run/node";
import { Suspense, useCallback, useEffect, useState } from "react";
import { GraphQLQuery } from "@aws-amplify/api";
import getPostsByCategory from "../graphQL/query/getPostsByCategory.gql";

import styles from "~/styles/blog.css";
export let links = () => [{ rel: "stylesheet", href: styles }];

export const loader = async ({ params }: LoaderArgs) => {
  const { data }: any = await API.graphql<GraphQLQuery<post>>({
    query: getPostsByCategory,
    variables: { category: params.category, limit: 20 },
  });

  return json(data);
};

export const action = async ({ params, request }: ActionArgs) => {
  const formData = await request.formData();
  const { nextToken }: any = Object.fromEntries(formData);
  const { data } = await API.graphql<GraphQLQuery<post>>({
    query: getPostsByCategory,
    variables: { category: params.category, limit: 20, nextToken },
  });
  return json(data);
};

export default function Category() {
  const { getPostsByCategory }: any = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { category } = useParams();

  const [posts, setPosts]: any = useState(getPostsByCategory.posts);
  const [nextToken, setNextToken]: any = useState(getPostsByCategory.nextToken);
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
      fetcher.data?.getPostsByCategory.nextToken === nextToken
    ) {
      setShouldFetch(false);
      return;
    }

    if (
      fetcher.data &&
      fetcher.data?.getPostsByCategory.nextToken !== nextToken
    ) {
      setNextToken(fetcher.data?.getPostsByCategory.nextToken);
      fetcher.data?.getPostsByCategory.posts.map((newPosts: any) =>
        setPosts((prev: any) => [...prev, newPosts])
      );
      setShouldFetch(true);
    }
  }, [fetcher.data]);

  function random(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <main ref={divHeight}>
      <h2>{category}</h2>

      {posts?.map(
        ({ label, category, author, date, content }: post, index: number) => (
          <article key={label}>
            <img src={"https://picsum.photos/id/" + (index + 22) + "/100"} />
            <section>
              <header>
                <h3>
                  <Link to={label}>{label}</Link>
                </h3>
                <p>
                  <Link to="#">{category}</Link>
                  <span>{author}</span>
                  <time>{new Date(date).toLocaleDateString()}</time>
                </p>
              </header>
              <p>{content}</p>
            </section>
          </article>
        )
      )}
      {fetcher.state === "submitting" && <div className="loader"></div>}
    </main>
  );
}
