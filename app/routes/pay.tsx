import { LoaderArgs, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { createPaymentIntent } from "../pay.server";
import { getUser } from "../appsync.server";

export const loader: LoaderFunction = async ({
  request,
  context,
}: LoaderArgs) => {
  //const { user } = context;
  const { user }: any = await getUser({ request });
  if (!user) return redirect("/");
  return await createPaymentIntent();
};

export default function Pay() {
  const { publicKey, client_secret }: any = useLoaderData();

  const [stripePromise, setStripePromise]: any = useState(
    async () => await loadStripe(publicKey)
  );

  return (
    <div style={{ padding: "20px" }}>
      {stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: client_secret }}
        >
          <Outlet />
        </Elements>
      )}
    </div>
  );
}
