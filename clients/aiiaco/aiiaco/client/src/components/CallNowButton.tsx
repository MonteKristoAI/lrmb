/**
 * CallNowButton - Smart CTA that shows a tel: link when a phone number is configured,
 * or falls back to opening the Calendly booking page when PHONE_NUMBER is null.
 *
 * To activate the phone number: update PHONE_NUMBER and PHONE_NUMBER_DISPLAY in client/src/const.ts
 */
import { PHONE_NUMBER, PHONE_NUMBER_DISPLAY, CALENDLY_URL } from "@/const";
import { trackCalendlyLinkClick } from "@/hooks/useCalendlyTracking";

interface CallNowButtonProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "gold" | "outline" | "minimal";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function CallNowButton({
  className = "",
  style,
  variant = "gold",
  size = "md",
  showIcon = true,
}: CallNowButtonProps) {
  const hasPhone = Boolean(PHONE_NUMBER);

  const href = hasPhone ? `tel:${PHONE_NUMBER}` : CALENDLY_URL;
  const target = hasPhone ? undefined : "_blank";
  const rel = hasPhone ? undefined : "noopener noreferrer";

  const label = hasPhone
    ? `${PHONE_NUMBER_DISPLAY}`
    : "Book a Call";

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { fontSize: "0.8rem", padding: "0.4rem 0.9rem", borderRadius: "6px" },
    md: { fontSize: "0.875rem", padding: "0.55rem 1.2rem", borderRadius: "8px" },
    lg: { fontSize: "1rem", padding: "0.75rem 1.75rem", borderRadius: "10px" },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    gold: {
      background: "linear-gradient(135deg, #B89C4A 0%, #D4A843 50%, #B89C4A 100%)",
      color: "#03050A",
      fontWeight: 700,
      border: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      textDecoration: "none",
      letterSpacing: "0.02em",
      transition: "opacity 0.2s",
    },
    outline: {
      background: "transparent",
      color: "#D4A843",
      fontWeight: 600,
      border: "1px solid #D4A843",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      textDecoration: "none",
      letterSpacing: "0.02em",
      transition: "background 0.2s, color 0.2s",
    },
    minimal: {
      background: "transparent",
      color: "#D4A843",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.35rem",
      textDecoration: "none",
      letterSpacing: "0.01em",
    },
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      style={{ ...variantStyles[variant], ...sizeStyles[size], ...style }}
      onClick={!hasPhone ? () => trackCalendlyLinkClick("call_now_button") : undefined}
    >
      {showIcon && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      )}
      {hasPhone ? (
        <>
          Call Now &mdash; <strong style={{ color: variant === "gold" ? "#03050A" : "#D4A843" }}>{label}</strong>
        </>
      ) : (
        <>
          {label}
        </>
      )}
    </a>
  );
}
