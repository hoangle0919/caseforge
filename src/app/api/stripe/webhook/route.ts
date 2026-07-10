import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe → subscriptions table mirror. No user session here, so the service
// role client is used; authenticity comes from signature verification.
export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      secret,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      if (!userId || !session.subscription || !session.customer) break;

      const subscription = await stripe.subscriptions.retrieve(
        String(session.subscription),
      );
      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: String(session.customer),
          stripe_subscription_id: subscription.id,
          plan: "pro",
          status: "active",
          current_period_end: periodEnd(subscription),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const active =
        subscription.status === "active" || subscription.status === "trialing";
      const fields = {
        plan: active ? "pro" : "free",
        status: active ? "active" : subscription.status,
        current_period_end: periodEnd(subscription),
        updated_at: new Date().toISOString(),
      };
      // Events can arrive before checkout.session.completed writes the id —
      // fall back to the user_id we set in subscription_data.metadata.
      const userId = subscription.metadata?.user_id;
      if (userId) {
        await supabase.from("subscriptions").upsert(
          {
            ...fields,
            user_id: userId,
            stripe_customer_id: String(subscription.customer),
            stripe_subscription_id: subscription.id,
          },
          { onConflict: "user_id" },
        );
      } else {
        await supabase
          .from("subscriptions")
          .update(fields)
          .eq("stripe_subscription_id", subscription.id);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await supabase
        .from("subscriptions")
        .update({
          plan: "free",
          status: "canceled",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function periodEnd(subscription: Stripe.Subscription): string | null {
  const ts = subscription.items.data[0]?.current_period_end;
  return ts ? new Date(ts * 1000).toISOString() : null;
}
