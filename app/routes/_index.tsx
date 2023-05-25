import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const response = { title: "Home", content: "Bienvenue sur la page de Home" };
  return json(response);
}

export default function Index() {
  const { title, content } = useLoaderData();

  return (
    <main>
      <h2>{title}</h2>
      <section>{content}</section>
    </main>
  );
}
