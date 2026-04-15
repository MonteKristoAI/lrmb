/**
 * Klaviyo client-side integration
 * Uses Klaviyo Client API with company_id for browser-safe calls.
 * No private keys exposed - uses public company ID only.
 */

const KLAVIYO_CLIENT_API = "https://a.klaviyo.com/client";
const REVISION = "2024-10-15";

function getCompanyId(): string | null {
  const id = import.meta.env.VITE_KLAVIYO_COMPANY_ID;
  return id && id !== "PLACEHOLDER" ? id : null;
}

function getListId(): string {
  return import.meta.env.VITE_KLAVIYO_LIST_ID || "";
}

async function klaviyoClientFetch(endpoint: string, body: any) {
  const companyId = getCompanyId();
  if (!companyId) return;

  await fetch(`${KLAVIYO_CLIENT_API}${endpoint}?company_id=${companyId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      revision: REVISION,
    },
    body: JSON.stringify(body),
  }).catch((err) => console.warn(`[Klaviyo] ${endpoint} failed:`, err));
}

/** Subscribe email to the main newsletter list */
export async function klaviyoSubscribe(email: string, firstName?: string) {
  const listId = getListId();
  if (!listId) return;

  return klaviyoClientFetch("/subscriptions/", {
    data: {
      type: "subscription",
      attributes: {
        custom_source: "Gummy Gurl Website",
        profile: {
          data: {
            type: "profile",
            attributes: { email },
          },
        },
      },
      relationships: {
        list: { data: { type: "list", id: listId } },
      },
    },
  });
}

/** Update profile with name and properties */
export async function klaviyoIdentify(email: string, firstName?: string, lastName?: string, properties?: Record<string, any>) {
  return klaviyoClientFetch("/profiles/", {
    data: {
      type: "profile",
      attributes: {
        email,
        first_name: firstName,
        last_name: lastName,
        properties: properties || {},
      },
    },
  });
}

/** Track a custom event */
export async function klaviyoTrackEvent(
  eventName: string,
  email: string,
  properties: Record<string, any> = {}
) {
  return klaviyoClientFetch("/events/", {
    data: {
      type: "event",
      attributes: {
        metric: { data: { type: "metric", attributes: { name: eventName } } },
        profile: { data: { type: "profile", attributes: { email } } },
        properties,
      },
    },
  });
}

/** Track "Started Checkout" */
export function trackStartedCheckout(
  email: string,
  items: Array<{ title: string; price: number; quantity: number }>,
  total: number
) {
  return klaviyoTrackEvent("Started Checkout", email, {
    $event_id: `checkout-${Date.now()}`,
    $value: total,
    ItemNames: items.map((i) => i.title),
    Items: items.map((i) => ({
      ProductName: i.title,
      Quantity: i.quantity,
      ItemPrice: i.price,
      RowTotal: i.price * i.quantity,
    })),
  });
}

/** Track "Placed Order" */
export function trackPlacedOrder(
  email: string,
  orderId: string,
  items: Array<{ title: string; price: number; quantity: number }>,
  total: number
) {
  return klaviyoTrackEvent("Placed Order", email, {
    $event_id: orderId,
    $value: total,
    OrderId: orderId,
    ItemNames: items.map((i) => i.title),
    Items: items.map((i) => ({
      ProductName: i.title,
      Quantity: i.quantity,
      ItemPrice: i.price,
      RowTotal: i.price * i.quantity,
    })),
  });
}

/** Track "Viewed Product" */
export function trackViewedProduct(
  email: string,
  product: { title: string; handle: string; price: number; image?: string | null }
) {
  return klaviyoTrackEvent("Viewed Product", email, {
    ProductName: product.title,
    ProductID: product.handle,
    Price: product.price,
    ImageURL: product.image || "",
    URL: `https://gummygurl.com/product/${product.handle}`,
  });
}
