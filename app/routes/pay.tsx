import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { createPaymentIntent } from "../services/pay.server";
import { authorize } from "~/services/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { idToken, user, headers }: any = await authorize(request);
  const { client_secret, publicKey }: any = await createPaymentIntent();
  return json(
    { client_secret, publicKey },
    {
      headers,
    }
  );
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
