import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export async function createPaymentIntent() {
  try {
    const { client_secret } = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: 1999,
      automatic_payment_methods: { enabled: true },
    });

    return {
      client_secret,
      publicKey: process.env.STRIPE_PUBLIC_KEY as string,
    };
  } catch (e: any) {
    return {
      error: {
        message: e.message,
      },
    };
  }
}

export async function retrievePaymentIntent(id: any) {
  return await stripe.paymentIntents.retrieve(id);
}
