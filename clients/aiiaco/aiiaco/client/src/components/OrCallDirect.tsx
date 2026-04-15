/**
 * OrCallDirect - Subtle "Or call 888-808-0001" line beneath CTAs.
 * Intentionally small and muted. Not a CTA - just a quiet option.
 */
import { DIRECT_DIAL, DIRECT_DIAL_TEL } from "@/const";

const FF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";

interface OrCallDirectProps {
  /** Extra top margin override (default 10px) */
  marginTop?: string;
  /** Center the text (default true) */
  center?: boolean;
}

export default function OrCallDirect({ marginTop = "10px", center = true }: OrCallDirectProps) {
  return (
    <p
      style={{
        fontFamily: FF,
        fontSize: "12px",
        color: "rgba(200,215,230,0.32)",
        margin: `${marginTop} 0 0`,
        textAlign: center ? "center" : "left",
        letterSpacing: "0.01em",
        lineHeight: 1,
      }}
    >
      Or call{" "}
      <a
        href={DIRECT_DIAL_TEL}
        style={{
          color: "rgba(200,215,230,0.40)",
          textDecoration: "none",
          borderBottom: "1px dotted rgba(200,215,230,0.18)",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(212,168,67,0.6)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(200,215,230,0.40)")}
      >
        {DIRECT_DIAL}
      </a>
    </p>
  );
}
