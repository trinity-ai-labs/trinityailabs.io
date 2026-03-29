const API_URL = "https://api.lemonsqueezy.com/v1";

function headers() {
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  };
}

export async function createCheckoutUrl(
  email: string,
  userId: string,
  options?: {
    variantId?: string;
    trialEndsAt?: string;
    customData?: Record<string, string>;
  },
): Promise<string> {
  const variantId = options?.variantId ?? process.env.LEMONSQUEEZY_VARIANT_ID;

  const res = await fetch(`${API_URL}/checkouts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_options: {
            embed: false,
          },
          checkout_data: {
            email,
            custom: { user_id: userId, ...options?.customData },
          },
          product_options: {
            redirect_url: `${process.env.BETTER_AUTH_URL}/dashboard`,
          },
          ...(options?.trialEndsAt
            ? { trial_ends_at: options.trialEndsAt }
            : {}),
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMONSQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId,
            },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Lemon Squeezy checkout failed: ${error}`);
  }

  const data = await res.json();
  return data.data.attributes.url;
}

export async function createCustomerPortalUrl(
  customerId: string,
): Promise<string> {
  const res = await fetch(`${API_URL}/customers/${customerId}`, {
    headers: headers(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch customer");
  }

  const data = await res.json();
  return data.data.attributes.urls.customer_portal;
}

export async function cancelSubscription(subscriptionId: string) {
  const res = await fetch(`${API_URL}/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "subscriptions",
        id: subscriptionId,
        attributes: { cancelled: true },
      },
    }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to cancel subscription: ${error}`);
  }
  return res.json();
}

export async function pauseSubscription(
  subscriptionId: string,
  mode: "void" | "free" = "void",
) {
  const res = await fetch(`${API_URL}/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "subscriptions",
        id: subscriptionId,
        attributes: { pause: { mode } },
      },
    }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to pause subscription: ${error}`);
  }
  return res.json();
}

export async function updateSubscriptionQuantity(
  subscriptionId: string,
  quantity: number,
) {
  const res = await fetch(`${API_URL}/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "subscriptions",
        id: subscriptionId,
        attributes: { quantity },
      },
    }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to update subscription quantity: ${error}`);
  }
  return res.json();
}

export async function resumeSubscription(subscriptionId: string) {
  const res = await fetch(`${API_URL}/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: "subscriptions",
        id: subscriptionId,
        attributes: { pause: null },
      },
    }),
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to resume subscription: ${error}`);
  }
  return res.json();
}
