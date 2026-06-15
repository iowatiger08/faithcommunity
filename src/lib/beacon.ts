import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function useEngagementBeacon() {
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    firedRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);

    function fire() {
      if (firedRef.current) return;
      firedRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("scroll", onScroll);
      fetch("/_beacon?p=" + encodeURIComponent(location.pathname), {
        keepalive: true,
      }).catch(() => {});
    }

    function onScroll() {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable > 0.2) fire();
    }

    timerRef.current = setTimeout(fire, 10_000);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, [location.pathname]);
}
