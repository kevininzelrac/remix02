import { Link } from "@remix-run/react";
import { InfiniteScrollContext } from "../infiniteScroll/infiniteScroll";
import { useContext } from "react";

export default function Posts() {
  const { posts }: any = useContext(InfiniteScrollContext);
  return (
    <>
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
                  <Link to={category}>{category}</Link>
                  <span>{author}</span>
                  <time>{new Date(date).toLocaleDateString()}</time>
                </p>
              </header>
              <p>{content}</p>
            </section>
          </article>
        )
      )}
    </>
  );
}
