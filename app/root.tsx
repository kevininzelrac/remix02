import {
  Meta,
  Links,
  Outlet,
  Scripts,
  LiveReload,
  useLoaderData,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import Nav from "./components/nav/nav";
import Footer from "./components/footer/footer";
import getNav from "./graphQL/query/getNav.gql";
import { getSession } from "./sessions";
import awsconfig from "./services/awsconfig.server";

import { API, Amplify } from "aws-amplify";
Amplify.configure(awsconfig);

import mainStyles from "~/styles/index.css";
import navStyles from "~/styles/nav.css";
import modalStyles from "~/styles/modal.css";
import zIndexStyles from "~/styles/zIndex.css";

export let links = () => [
  { rel: "stylesheet", href: mainStyles },
  { rel: "stylesheet", href: navStyles },
  { rel: "stylesheet", href: modalStyles },
  { rel: "stylesheet", href: zIndexStyles },
];

export const loader = async ({ request }: any) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  const { data }: any = await API.graphql({
    query: getNav,
    variables: { category: "" },
  });
  const posts = data.getNav;

  return { user, posts };
};

export default function App() {
  const { user, posts }: any = useLoaderData();
  const navigation = useNavigation();

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
          <small>0.1.17</small>
        </h1>
        <Nav data={posts} user={user} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Footer />
      </body>
    </html>
  );
}
