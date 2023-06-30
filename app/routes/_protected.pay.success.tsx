import { LoaderFunction, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { retrievePaymentIntent } from "~/services/pay.server";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("payment_intent");
  return await retrievePaymentIntent(id);
};

export default function Success() {
  const paymentIntent = useLoaderData();
  return (
    <>
      <h2>Thank you! 🎉</h2>
      <pre>{JSON.stringify(paymentIntent, null, 2)}</pre>
    </>
  );
}
