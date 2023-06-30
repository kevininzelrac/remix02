import { Form } from "@remix-run/react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";

export default function PayForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or elements not loaded");
      return;
    }
    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pay/success`,
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
    }
    setIsProcessing(false);
  };

  return (
    <Form method="post" onSubmit={handleChange}>
      <h2>Pay</h2>
      <PaymentElement />
      <button disabled={isProcessing || !stripe || !elements} type="submit">
        {isProcessing ? "Processing ... " : "Pay"}
      </button>
    </Form>
  );
}
