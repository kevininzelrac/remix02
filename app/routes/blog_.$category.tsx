import { API } from "aws-amplify";
import { Link, useLoaderData, useParams } from "@remix-run/react";
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { GraphQLQuery } from "@aws-amplify/api";
import getPostsByCategory from "../graphQL/query/getPostsByCategory.gql";

import styles from "~/styles/blog.css";
import Posts from "~/components/posts/posts";
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
      <Posts posts={getPostsByCategory.posts} />
    </main>
  );
}
