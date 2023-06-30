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
import awsconfig from "./services/awsconfig";
import { getSession } from "./sessions";

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

  const env = {
    AWS_REGION: process.env.AWS_REGION,
    AWS_APPSYNC_GRAPHQLENDPOINT: process.env.AWS_APPSYNC_GRAPHQLENDPOINT,
    AWS_APPSYNC_KEY: process.env.AWS_APPSYNC_KEY,
    AWS_APPSYNC_AUTHENTICATIONTYPE: "API_KEY",
    USER_POOL_ID: process.env.USER_POOL_ID,
    USER_POOL_WEB_CLIENT_ID: process.env.USER_POOL_WEB_CLIENT_ID,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  };

  return { env, user, posts };
};

export default function App() {
  const { env, user, posts }: any = useLoaderData();
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
        {/* <main
        style={{
            animationName:
              navigation.state === "idle" ? "slideDown" : "slideUp",
          }}
        > */}
        <Outlet />
        {/* </main> */}

        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
        <Scripts />
        <LiveReload />
        {/* <Footer /> */}
      </body>
    </html>
  );
}
