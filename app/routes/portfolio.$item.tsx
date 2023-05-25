import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export function loader({ params }: LoaderArgs) {
  const response = {
    item: params.item,
  };
  return json(response);
}

export default function Portfolio() {
  const { item } = useLoaderData();
  return <p>{item}</p>;
}
