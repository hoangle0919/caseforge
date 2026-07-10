"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStripe, appUrl } from "@/lib/stripe";

/** Find or create the Stripe customer for this user, mirrored in subscriptions. */
async function getOrCreateCustomerId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string,
): Promise<string> {
  const { data: row } = await supabase
    .from("subscriptions")
    .select("id, stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (row?.stripe_customer_id) return row.stripe_customer_id;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  });

  if (row) {
    await supabase
      .from("subscriptions")
      .update({ stripe_customer_id: customer.id })
      .eq("id", row.id);
  } else {
    await supabase.from("subscriptions").insert({
      user_id: userId,
      stripe_customer_id: customer.id,
      plan: "free",
      status: "active",
    });
  }
  return customer.id;
}

export async function startCheckout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) throw new Error("STRIPE_PRICE_ID is not set");

  const customerId = await getOrCreateCustomerId(
    supabase,
    user.id,
    user.email ?? "",
  );

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: { metadata: { user_id: user.id } },
    metadata: { user_id: user.id },
    success_url: appUrl("/billing?success=1"),
    cancel_url: appUrl("/billing"),
    allow_promotion_codes: true,
  });

  if (!session.url) throw new Error("Stripe did not return a checkout URL");
  redirect(session.url);
}

export async function openBillingPortal() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: row } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!row?.stripe_customer_id) redirect("/billing");

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: row.stripe_customer_id,
    return_url: appUrl("/billing"),
  });
  redirect(session.url);
}
