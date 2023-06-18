import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import awsconfig from "./export.server";

Amplify.configure(awsconfig);

import mainStyles from "~/styles/index.css";
import navStyles from "~/styles/nav.css";
import modalStyles from "~/styles/modal.css";
import zIndexStyles from "~/styles/zIndex.css";
export let links = () => {
  return [
    { rel: "stylesheet", href: mainStyles },
    { rel: "stylesheet", href: navStyles },
    { rel: "stylesheet", href: modalStyles },
    { rel: "stylesheet", href: zIndexStyles },
  ];
};

import Nav from "./components/nav/nav";
import { getNav } from "./appsync.server";
import { graph } from "./graphql.server";

export const loader = async ({ context, request }: any) => {
  const { user }: any = context;
  //await graph();
  //const { user }: any = await getUser({ request });
  const posts = await getNav(request);
  return { user, posts };
};

export default function App() {
  const { user, posts }: any = useLoaderData();
  const [isOpen, setIsOpen] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams.get("modal") === "signin" && setIsOpen("signin");
  }, [searchParams]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          Remix
          <small>0.1.12</small>
        </h1>
        <Nav data={posts} user={user} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <footer>
          <p>Remix - Server Side Rendering</p>
          <p>
            Serverless Architecture - AWS CloudFront Distribution - S3 Bucket
            Frontent
          </p>
          <p>Lambda/Edge - GraphQL - AppSync - DynamoDb Backend</p>
          <p>Web & Mobile App - built by Kevin Inzelrac</p>
        </footer>
      </body>
    </html>
  );
}
