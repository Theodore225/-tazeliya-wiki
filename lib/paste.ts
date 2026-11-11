const spacingProperties = [
  "margin", "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding", "padding-top", "padding-right", "padding-bottom", "padding-left",
  "line-height", "font-size", "text-indent", "letter-spacing",
  "height", "min-height", "max-height",
];

export function normalizePastedText(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(line => line.replace(/[\t ]+$/g, ""))
    .join("\n")
    .replace(/\n(?:[\t ]*\n)+/g, "\n")
    .replace(/^\n+|\n+$/g, "");
}

export function normalizePastedHTML(html: string) {
  if (typeof DOMParser === "undefined") return html;
  const parsed = new DOMParser().parseFromString(`<main data-paste-root>${html}</main>`, "text/html");
  const root = parsed.querySelector("main[data-paste-root]");
  if (!root) return html;

  root.querySelectorAll<HTMLElement>("[style]").forEach(element => {
    for (const property of spacingProperties) element.style.removeProperty(property);
    if (!element.getAttribute("style")?.trim()) element.removeAttribute("style");
  });

  root.querySelectorAll("p, div").forEach(element => {
    const text = (element.textContent || "").replace(/\u00a0/g, " ").trim();
    if (!text && !element.querySelector("img, hr")) element.remove();
  });

  root.querySelectorAll("br + br").forEach(element => element.remove());
  return root.innerHTML;
}
