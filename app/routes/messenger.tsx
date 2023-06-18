import { useFetcher, useLoaderData, useRevalidator } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useEffect, useRef } from "react";

import styles from "~/styles/messenger.css";
import { API, GraphQLSubscription, graphqlOperation } from "@aws-amplify/api";
//import {API} from "@aws-amplify/api"
//import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";

import { addMessage, getUserMessages } from "~/appsync.server";

interface message {
  id: string;
  date: number;
  from: String;
  to: String;
  message: String;
  status: Boolean;
}

const subscription = `
  subscription MySubscription($to: String!) {
    onAddMessage(to: $to) {
      date
      from
      id
      message
      status
      to
    }
  }
`;

export let links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader = async ({ request, context }: any) => {
  const { jwtToken, user }: any = context;
  //const { user, jwtToken }: any = await getUser({ request });
  if (!user) {
    return redirect("/signin");
  }

  const { messages } = await getUserMessages({ request, user, jwtToken });
  return {
    user,
    messages,
    jwtToken,
  };
};

export let action = async ({ request, context }: any) => {
  const { jwtToken }: any = context;
  //const { jwtToken }: any = await getUser({ request });
  const formData = await request.formData();
  return await addMessage({ request, formData, jwtToken });
};

export default function Messenger() {
  const { user, jwtToken, messages } = useLoaderData();

  const revalidator = useRevalidator();

  const fetcher = useFetcher();
  let isSubmitting = (fetcher.state = "submitting");
  let isLoading = (fetcher.state = "loading");
  let isIdle = (fetcher.state = "idle");

  let formRef: any = useRef();

  useEffect(() => {
    isIdle && formRef.current?.reset();
  }, [fetcher.data]);

  useEffect(() => {
    (async () => {
      const sub = API.graphql<GraphQLSubscription<message>>({
        query: subscription,
        variables: { to: "Dani" },
        authMode: "AWS_LAMBDA",
        authToken: jwtToken,
      }).subscribe({
        //next: ({ value }: any) => SetNewMessage(value.data.onAddMessage),
        //next: ({ value }: any) => console.log(value),
        next: () => revalidator.revalidate(),
        error: (error: any) => console.log("SUBSCRIBE ERROR : ", error),
      });
      return () => {
        sub.unsubscribe();
      };
    })();
  }, []);

  return (
    <div>
      <ul>
        {messages?.map(({ id, from, message }: message) => (
          <li key={id}>
            <strong>{from} : </strong>
            {message}
          </li>
        ))}
      </ul>
      <fetcher.Form ref={formRef} method="post">
        <fieldset>
          <legend>Send a message</legend>
          <input placeholder="to" type="text" name="to" />
          <br />
          <input placeholder="message" type="text" name="message" />
          <br />
          <input type="hidden" name="from" value={user.name} />

          <button type="submit">Send</button>
        </fieldset>
      </fetcher.Form>
    </div>
  );
}
