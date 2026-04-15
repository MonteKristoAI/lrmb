/**
 * useCalendlyTracking - Listens for Calendly postMessage events from embedded
 * iframes and fires GA4 custom events via gtag().
 *
 * Events tracked:
 *   - calendly_booking_complete  (conversion)  - invitee schedules an event
 *   - calendly_date_selected     (micro)       - invitee selects date/time
 *   - calendly_page_viewed       (engagement)  - profile page viewed
 *   - calendly_event_type_viewed (engagement)  - event type viewed
 *
 * Usage:
 *   useCalendlyTracking();          // in any component with a Calendly iframe
 *   useCalendlyTracking("contact"); // pass a source label for attribution
 */
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type CalendlyEventName =
  | "calendly.event_scheduled"
  | "calendly.date_and_time_selected"
  | "calendly.profile_page_viewed"
  | "calendly.event_type_viewed";

interface CalendlyPostMessage {
  event: CalendlyEventName;
  payload?: {
    event?: { uri?: string };
    invitee?: { uri?: string };
  };
}

function isCalendlyEvent(e: MessageEvent): e is MessageEvent<CalendlyPostMessage> {
  return (
    e.data &&
    typeof e.data.event === "string" &&
    e.data.event.indexOf("calendly") === 0
  );
}

const GA4_EVENT_MAP: Record<CalendlyEventName, string> = {
  "calendly.event_scheduled": "calendly_booking_complete",
  "calendly.date_and_time_selected": "calendly_date_selected",
  "calendly.profile_page_viewed": "calendly_page_viewed",
  "calendly.event_type_viewed": "calendly_event_type_viewed",
};

export function useCalendlyTracking(source: string = "unknown") {
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!isCalendlyEvent(e)) return;

      const ga4Event = GA4_EVENT_MAP[e.data.event];
      if (!ga4Event) return;

      // Fire GA4 event
      if (window.gtag) {
        window.gtag("event", ga4Event, {
          event_category: "calendly",
          event_label: source,
          calendly_event_uri: e.data.payload?.event?.uri || "",
          calendly_invitee_uri: e.data.payload?.invitee?.uri || "",
        });
      }

      // Log for debugging
      console.log(`[GA4] ${ga4Event}`, { source, payload: e.data.payload });
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [source]);
}

/**
 * trackCalendlyLinkClick - Fire a GA4 event when a user clicks an external
 * Calendly link (not an iframe embed). Call this in onClick handlers.
 */
export function trackCalendlyLinkClick(source: string = "unknown") {
  if (window.gtag) {
    window.gtag("event", "calendly_link_click", {
      event_category: "calendly",
      event_label: source,
      transport_type: "beacon",
    });
  }
}
