/*
  Ref callback for Universe ambient loops (.uni-amb in globals.css): marks the element
  with data-on while it is on screen (plus a small margin), so its CSS animation only
  runs then. One shared observer serves every element.

    <svg className="uni-amb uni-amb-spin" ref={ambient} />
*/
let observer;

const getObserver = () =>
  (observer ??= new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.toggleAttribute("data-on", e.isIntersecting)),
    { rootMargin: "120px 0px" }
  ));

export const ambient = (el) => {
  if (!el || typeof IntersectionObserver === "undefined") return;
  const io = getObserver();
  io.observe(el);
  return () => io.unobserve(el);
};
