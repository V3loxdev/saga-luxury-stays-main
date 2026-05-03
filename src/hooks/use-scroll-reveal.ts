import { useEffect, useRef } from "react";

const REVEAL_CLASSES = [
  "scroll-reveal",
  "scroll-reveal-left",
  "scroll-reveal-right",
  "scroll-reveal-scale",
];

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const el = ref.current;
    if (el) {
      const selector = REVEAL_CLASSES.map((c) => `.${c}`).join(", ");
      const children = el.querySelectorAll(selector);
      children.forEach((child, i) => {
        if (!(child as HTMLElement).style.transitionDelay) {
          (child as HTMLElement).style.transitionDelay = `${i * 100}ms`;
        }
        observer.observe(child);
      });
    }

    return () => observer.disconnect();
  }, []);

  return ref;
}
