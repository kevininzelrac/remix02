import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const response = {
    title: "Contact",
    content: "Bienvenue sur la page de Contact",
  };
  return json(response);
}

export default function Contact() {
  const { title, content } = useLoaderData();
  return (
    <main>
      <h2>{title}</h2>
      <section>{content}</section>
    </main>
  );
}
