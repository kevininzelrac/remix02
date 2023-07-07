import { useState, useCallback, useEffect, createContext } from "react";

export const InfiniteScrollContext = createContext({});

export default function InfiniteScroll({ children, data, fetcher }: any) {
  const [posts, setPosts]: any = useState(data.posts);
  const [nextToken, setNextToken]: any = useState(data.nextToken);
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
    if (fetcher.data && fetcher.data?.getPostsByType.nextToken === nextToken) {
      setShouldFetch(false);
      return;
    }

    if (fetcher.data && fetcher.data?.getPostsByType.nextToken !== nextToken) {
      setNextToken(fetcher.data?.getPostsByType.nextToken);
      fetcher.data?.getPostsByType.posts.map((newPosts: any) =>
        setPosts((prev: any) => [...prev, newPosts])
      );
      setShouldFetch(true);
    }
  }, [fetcher.data]);

  return (
    <InfiniteScrollContext.Provider value={{ posts }}>
      <section ref={divHeight}>
        {children}
        {fetcher.state === "submitting" && <div className="loader"></div>}
      </section>
    </InfiniteScrollContext.Provider>
  );
}
