import { formatAmountForStripe } from "@/utils/stripe-helper";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(req: NextApiRequest) {
  const amount: number = req.body.amount;

  const params: Stripe.Checkout.SessionCreateParams = {
    submit_type: "pay",
    payment_method_types: ["card", "klarna"],
    line_items: [
      {
        name: "Custom amount donation",
        amount: formatAmountForStripe(amount, "sek"),
        currency: "sek",
        quantity: 1,
      },
    ],
    success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.origin}/donate-with-checkout`,
  };

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create(params);

  return NextResponse.json(checkoutSession);
}
