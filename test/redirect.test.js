import { describe, expect, test } from "bun:test";
import { redirectTarget, onRequest } from "../functions/_middleware.js";

const OLD = "https://corporate-games.pages.dev", NEW = "https://games.corporatetambola.com";
describe("the old pages.dev address", () => {
  test("a page request (GET or HEAD) goes to the same path and query on the new address", () => {
    expect(redirectTarget(new URL(OLD + "/"), "GET")).toBe(NEW + "/");
    expect(redirectTarget(new URL(OLD + "/games.html?x=1#a"), "GET")).toBe(NEW + "/games.html?x=1");
    expect(redirectTarget(new URL(OLD + "/pricing.html"), "HEAD")).toBe(NEW + "/pricing.html");
  });
  test("/api, /__, /version.json, /.well-known and any POST are not redirected", () => {
    for (const p of ["/api/x", "/__x", "/version.json", "/.well-known/security.txt"]) expect(redirectTarget(new URL(OLD + p), "GET")).toBeNull();
    expect(redirectTarget(new URL(OLD + "/api/x"), "POST")).toBeNull();
    expect(redirectTarget(new URL(OLD + "/games.html"), "POST")).toBeNull();
  });
  test("the new address and other hosts are not redirected; the middleware answers 301 or passes on", async () => {
    expect(redirectTarget(new URL(NEW + "/"), "GET")).toBeNull();
    expect(redirectTarget(new URL("https://abc.corporate-games.pages.dev/"), "GET")).toBeNull();
    const next = async () => new Response("passed on");
    const r = await onRequest({ request: new Request(OLD + "/about.html?a=b"), next }); expect(r.status).toBe(301); expect(r.headers.get("location")).toBe(NEW + "/about.html?a=b");
    expect(await (await onRequest({ request: new Request(NEW + "/about.html"), next })).text()).toBe("passed on");
  });
});
