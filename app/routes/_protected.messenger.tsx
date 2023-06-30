import {
  ActionArgs,
  ActionFunction,
  LinksFunction,
  LoaderArgs,
  LoaderFunction,
  defer,
  json,
} from "@remix-run/node";
import {
  Await,
  useFetcher,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { API, GraphQLSubscription } from "@aws-amplify/api";
import { Suspense, useEffect, useRef } from "react";
import getAllMessages from "../graphQL/query/getAllMessages.gql";
import addMessage from "../graphQL/mutation/addMessage.gql";
import onAddMessage from "../graphQL/subscription/onAddMessage.gql";
import { getSession } from "~/sessions";

import styles from "~/styles/messenger.css";
export let links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const idToken = session.get("idToken");
  const user = session.get("user");

  const data: any = API.graphql({
    query: getAllMessages,
    variables: { from: user.name },
    authMode: "AWS_LAMBDA",
    authToken: idToken,
  });

  return defer({
    idToken: await idToken,
    user: await user,
    data,
  });
};

export let action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const idToken = session.get("idToken");

  const { data }: any = await API.graphql({
    query: addMessage,
    variables: Object.fromEntries(formData),
    authMode: "AWS_LAMBDA",
    authToken: idToken,
  });
  return json(data);
};

export default function Messenger() {
  const { idToken, user, data }: any = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const fetcher = useFetcher();
  let isIdle = (fetcher.state = "idle");
  let formRef: any = useRef();

  useEffect(() => {
    isIdle && formRef.current?.reset();
  }, [fetcher.data]);

  useEffect(() => {
    (async () => {
      const sub = API.graphql<GraphQLSubscription<message>>({
        query: onAddMessage,
        variables: { to: "Dani" },
        authMode: "AWS_LAMBDA",
        authToken: idToken,
      }).subscribe({
        next: () => revalidator.revalidate(),
        error: (error: any) => console.log("SUBSCRIBE ERROR : ", error),
      });
      return () => {
        sub.unsubscribe();
      };
    })();
  }, []);

  return (
    <main>
      <div>
        <h2>Messenger</h2>
        <Suspense fallback={<div className="loader"></div>}>
          <Await resolve={data} errorElement={<p>Error loading Messenger!</p>}>
            {({ data: { getAllMessages } }) => (
              getAllMessages.sort((a: any, b: any) =>
                a.date > b.date ? 1 : b.date > a.date ? -1 : 0
              ),
              (
                <ul>
                  {getAllMessages?.map(({ id, from, message }: message) => (
                    <li key={id}>
                      <strong>{from} : </strong>
                      {message}
                    </li>
                  ))}
                </ul>
              )
            )}
          </Await>
        </Suspense>
        <fetcher.Form ref={formRef} method="post">
          <fieldset>
            <legend>Send a message</legend>
            <input placeholder="to" type="text" name="to" />
            <br />
            <input placeholder="message" type="text" name="message" />
            <br />
            <input type="hidden" name="from" value={user?.name} />

            <button type="submit">Send</button>
          </fieldset>
        </fetcher.Form>
      </div>
    </main>
  );
}
