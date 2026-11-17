import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

/** Smooth-scroll to a pixel offset (falls back to native scroll without Lenis). */
export function scrollToY(y: number, opts: { immediate?: boolean } = {}) {
  if (instance) {
    instance.scrollTo(y, { immediate: opts.immediate, duration: 1.6 });
  } else {
    window.scrollTo({ top: y, behavior: opts.immediate ? "auto" : "smooth" });
  }
}
