import { API } from "aws-amplify";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { GraphQLQuery } from "@aws-amplify/api";
import getPostsByCategory from "../graphQL/query/getPostsByCategory.gql";

import styles from "~/styles/blog.css";
export let links = () => [{ rel: "stylesheet", href: styles }];

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const { data }: any = await API.graphql<GraphQLQuery<post>>({
    query: getPostsByCategory,
    variables: { category: params.category, limit: 30 },
  });

  return json(data);
};

export default function Category() {
  const { getPostsByCategory }: any = useLoaderData<typeof loader>();
  const { category } = useParams();

  return (
    <main>
      <h2>{category}</h2>

      {getPostsByCategory.posts?.map(
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
    </main>
  );
}
