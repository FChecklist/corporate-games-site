// Runs before the static pages (see site/_routes.json, which lists the page addresses): the old pages.dev address answers 301 to the new address; every other request goes on unchanged.
export const OLD_HOST = "corporate-games.pages.dev";
export const NEW_ORIGIN = "https://games.corporatetambola.com";
// GET and HEAD only; /api, /__, /version.json and /.well-known are never redirected.
export function redirectTarget(url, method) {
  if (url.hostname !== OLD_HOST) return null;
  if (method !== "GET" && method !== "HEAD") return null;
  const p = url.pathname;
  if (p.startsWith("/api/") || p === "/api" || p.startsWith("/__") || p === "/version.json" || p.startsWith("/.well-known/")) return null;
  return NEW_ORIGIN + p + url.search;
}
export const onRequest = (ctx) => {
  const to = redirectTarget(new URL(ctx.request.url), ctx.request.method);
  return to ? Response.redirect(to, 301) : ctx.next();
};
