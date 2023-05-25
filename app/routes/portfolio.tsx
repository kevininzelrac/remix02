import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { To } from "react-router";

export async function loader() {
  const response = {
    title: "Portfolio",
    content: "Bienvenue sur la page de Portfolio",
    items: ["Exposition", "Festival", "Voyage"],
  };
  return json(response);
}

export default function Portfolio() {
  const { title, content, items } = useLoaderData();

  return (
    <main>
      <h2>{title}</h2>
      <section>{content}</section>
      <nav>
        {items?.map((item: string) => (
          <NavLink key={item} to={item}>
            {item}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </main>
  );
}
