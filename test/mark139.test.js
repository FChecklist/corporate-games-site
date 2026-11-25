import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SITE = join(import.meta.dir, "..", "site");
const MARK = '<div class="mark139" lang="hi" aria-hidden="true"><span>१३९</span></div>';
const CSS = '.mark139{position:absolute;top:0;left:0;right:0;margin:0;padding:1px 0 0;text-align:center;line-height:1;pointer-events:none;user-select:none;z-index:2147483647;font-family:"Noto Sans Devanagari","Mukta","Nirmala UI","Mangal","Kohinoor Devanagari","Devanagari Sangam MN",sans-serif;font-size:6px;font-weight:700;color:#0B2A6B}\n.mark139 span{display:inline-block;border-bottom:.5px solid #7A1010;padding-bottom:.5px}';
const pages = readdirSync(SITE).filter((f) => f.endsWith(".html"));

describe("the १३९ mark", () => {
  test("there are pages to check", () => expect(pages.length).toBeGreaterThan(0));
  for (const p of pages) {
    test(`${p} has the mark exactly once, first in body`, () => {
      const h = readFileSync(join(SITE, p), "utf8");
      expect(h.split('class="mark139"').length - 1).toBe(1);
      expect(h).toContain("<body>" + MARK);
    });
  }
  test("site.css (loaded by every page) holds the approved CSS", () => {
    expect(readFileSync(join(SITE, "site.css"), "utf8")).toContain(CSS);
    for (const p of pages) expect(readFileSync(join(SITE, p), "utf8")).toContain('href="/site.css"');
  });
});
