"use strict";

export function createElement(
  elTag = "div",
  classes = [],
  innerHTML = "",
  parent = null,
  id = null
) {
  const el = document.createElement(elTag);
  for (const cls of classes) {
    el.classList.add(cls);
  }
  el.innerHTML = innerHTML;
  if (parent) parent.append(el);

  if (id) el.id = id;

  return el;
}
