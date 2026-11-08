import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useEngagementBeacon() {
  const location = useLocation();

  useEffect(() => {
    // Whichever trigger fires first removes the other, so each page view
    // pings at most once.
    function fire() {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      fetch("/_beacon?p=" + encodeURIComponent(location.pathname), {
        keepalive: true,
      }).catch(() => {});
    }

    function onScroll() {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable > 0 && window.scrollY / scrollable > 0.2) fire();
    }

    const timer = setTimeout(fire, 10_000);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [location.pathname]);
}
