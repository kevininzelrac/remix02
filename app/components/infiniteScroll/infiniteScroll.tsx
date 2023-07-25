import { useState, useEffect } from "react";

export default function InfiniteScroll({
  children,
  loaderData,
  fetcher,
  fetcherData,
  clientRef,
}: any) {
  const [posts, setPosts]: any = useState(loaderData?.posts);
  const [nextToken, setNextToken]: any = useState(loaderData?.nextToken);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [height, setHeight] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);

  useEffect(() => {
    setHeight(clientRef.current.getBoundingClientRect().height);
  }, [posts.length]);

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
    if (fetcher.data && fetcherData.nextToken === nextToken) {
      setShouldFetch(false);
      return;
    }

    if (fetcher.data && fetcherData?.nextToken !== nextToken) {
      setNextToken(fetcherData?.nextToken);
      fetcherData?.posts.map((newPosts: any) =>
        setPosts((prev: any) => [...prev, newPosts])
      );
      setShouldFetch(true);
    }
  }, [fetcher?.data]);

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

  return children(posts);
}
