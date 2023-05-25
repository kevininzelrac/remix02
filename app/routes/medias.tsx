import { json } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";

export async function loader() {
  const response = {
    title: "Médias",
    content: "Bienvenue sur la page de Médias",
    items: ["Photos", "Videos"],
  };
  return json(response);
}

export default function Medias() {
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
