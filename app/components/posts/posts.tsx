import { Link } from "@remix-run/react";
import ReadOnly from "../slate/readOnly";

export default function Posts({ posts }: any) {
  return (
    <>
      {posts?.map(
        ({ label, category, author, date, content }: post, index: number) => (
          <article key={label}>
            <img src={"https://picsum.photos/id/" + (index + 22) + "/100"} />
            <section>
              <header>
                <h3>
                  <Link to={"/Blog/" + category + "/" + label}>{label}</Link>
                </h3>
                <p>
                  <Link to={"/Blog/" + category}>{category}</Link>
                  <span>{author}</span>
                  <time>{new Date(date).toLocaleDateString()}</time>
                </p>
              </header>
              <ReadOnly data={content} />
            </section>
          </article>
        )
      )}
    </>
  );
}

/* const Render = ({ content }: any) => {
  const data = content?.includes("type")
    ? JSON.parse(content)
    : [
        {
          type: "paragraph",
          textAlign: "left",
          children: [{ text: content }],
        },
      ];
  return (
    <>
      {data?.map(
        ({ type, textAlign, children }: any, index: any) =>
          type === "paragraph" && (
            <p key={index} className={textAlign}>
              {children?.map(({ text }: any) => text)}
            </p>
          )
      )}
    </>
  );
}; */
