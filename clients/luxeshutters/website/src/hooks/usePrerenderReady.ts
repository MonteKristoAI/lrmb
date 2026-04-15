import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Signals Netlify's prerender headless browser that the page is ready to capture.
 * Resets on route changes, then sets `window.prerenderReady = true` after a short delay.
 */
export function usePrerenderReady(delay = 500) {
  const location = useLocation();
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    window.prerenderReady = false;

    timer.current = setTimeout(() => {
      window.prerenderReady = true;
    }, delay);

    return () => {
      clearTimeout(timer.current);
    };
  }, [location.pathname, delay]);
}
