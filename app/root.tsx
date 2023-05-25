import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import styles from "~/styles/index.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Remix 0.1.0</h1>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/Portfolio">Portfolio</NavLink>
          <NavLink to="/Medias">Médias</NavLink>
          <NavLink to="/Contact">Contact</NavLink>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <footer>
          <small>
            <i>Remix app built by Kevin Inzelrac</i>
          </small>
        </footer>
      </body>
    </html>
  );
}
