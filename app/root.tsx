import {
  Meta,
  Links,
  Outlet,
  Scripts,
  LiveReload,
  useLoaderData,
  ScrollRestoration,
} from "@remix-run/react";
import { Amplify } from "aws-amplify";

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
import { getNav, getUser } from "./appsync.server";
import Footer from "./components/footer/footer";
import awsconfig from "./awsconfig";

export const loader = async ({ request }: any) => {
  const ENV = {
    AWS_REGION: process.env.AWS_REGION,
    AWS_APPSYNC_GRAPHQLENDPOINT: process.env.AWS_APPSYNC_GRAPHQLENDPOINT,
    AWS_APPSYNC_KEY: process.env.AWS_APPSYNC_KEY,
    AWS_APPSYNC_AUTHENTICATIONTYPE: "API_KEY",
    USER_POOL_ID: process.env.USER_POOL_ID,
    USER_POOL_WEB_CLIENT_ID: process.env.USER_POOL_WEB_CLIENT_ID,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  };
  const { user }: any = await getUser({ request });
  const posts = await getNav(request);
  return { ENV, user, posts };
};

export default function App() {
  const { ENV, user, posts }: any = useLoaderData();

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
          <small>0.1.13</small>
        </h1>
        <Nav data={posts} user={user} />
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
        <Footer />
      </body>
    </html>
  );
}
