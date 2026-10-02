import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { findEnglishWords } from "../src/features/i18n/domain/english-leaks";

const isPhone = (info: TestInfo) => info.project.name.startsWith("phone");

async function open(page: Page, path: string) {
  await page.addInitScript(() => localStorage.setItem("portfolio.motion", "calm"));
  await page.goto(path);
  await page.waitForSelector("html[data-ready=true]");
  await page.waitForTimeout(600);
}

async function press(page: Page, locator: ReturnType<Page["locator"]>, info: TestInfo) {
  await locator.scrollIntoViewIfNeeded();
  if (isPhone(info)) await locator.tap();
  else await locator.click();
  await page.waitForTimeout(150);
}

/** Visible text nodes plus the accessible names of the current state. */
async function collect(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement;
      const text = (n.textContent ?? "").replace(/\s+/g, " ").trim();
      if (!el || !text || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(el.tagName)) continue;
      if (!el.checkVisibility({ checkVisibilityCSS: true }) && !el.closest(".sr-only")) continue;
      out.push(text);
    }
    for (const el of document.querySelectorAll("[aria-label],[title],img[alt]")) {
      if (el.closest("[hidden]")) continue;
      for (const a of ["aria-label", "title", "alt"]) {
        const v = el.getAttribute(a);
        if (v) out.push(v);
      }
    }
    return out;
  });
}

/** Title, meta description, Open Graph and Twitter text, and every human-readable JSON-LD string. */
async function head(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const meta = (sel: string) => document.querySelector(sel)?.getAttribute("content") ?? "";
    const strings: string[] = [];
    const walk = (v: unknown, key = "") => {
      if (typeof v === "string") {
        if (!/^(@|url$|sameAs$|availability$)/.test(key) && !/^https?:/.test(v)) strings.push(v);
      } else if (Array.isArray(v)) v.forEach((x) => walk(x, key));
      else if (v && typeof v === "object") Object.entries(v).forEach(([k, x]) => walk(x, k));
    };
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) walk(JSON.parse(s.textContent ?? "null"));
    return [
      document.title,
      meta('meta[name="description"]'),
      meta('meta[property="og:title"]'),
      meta('meta[property="og:description"]'),
      meta('meta[property="og:image:alt"]'),
      meta('meta[name="twitter:title"]'),
      ...strings,
    ];
  });
}

async function leaks(page: Page, label: string, seen: Map<string, string>) {
  for (const text of [...(await collect(page)), ...(await head(page))]) {
    const found = findEnglishWords(text);
    if (found.length) seen.set(text, `${label}: ${found.join(", ")}`);
  }
}

/** Walks every interactive part of the page and records any English UI text. */
async function walkSpanish(page: Page, info: TestInfo, seen: Map<string, string>) {
  await leaks(page, "initial", seen);
  if (isPhone(info)) {
    await press(page, page.getByTestId("menu-btn"), info);
    await leaks(page, "menu", seen);
    await press(page, page.getByTestId("menu-btn"), info);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await press(page, page.getByTestId("options-btn"), info);
  await leaks(page, "options", seen);
  for (const tier of ["calm", "static", "full"]) {
    await press(page, page.getByTestId(`tier-${tier}`), info);
    await leaks(page, `tier-${tier}`, seen);
  }
  await press(page, page.getByTestId("options-btn"), info);
  const tabs = page.getByTestId("quest-tab");
  for (let i = 0; i < (await tabs.count()); i++) {
    await press(page, tabs.nth(i), info);
    await leaks(page, `quest-tab-${i}`, seen);
  }
  const faq = page.getByTestId("faq-item");
  for (let i = 0; i < (await faq.count()); i++) {
    await press(page, faq.nth(i).locator("summary"), info);
    await leaks(page, `faq-${i}`, seen);
  }
  const starts = page.getByTestId("start-quest");
  for (let i = 0; i < (await starts.count()); i++) {
    await press(page, starts.nth(i), info);
    await page.waitForTimeout(500);
    await leaks(page, `start-quest-${i}`, seen);
  }
}

const report = (seen: Map<string, string>) => [...seen].map(([text, why]) => `${why} | ${text}`);

test.describe("Spanish has no English UI text", () => {
  test("/es: every state, tab, FAQ entry and quest handoff", async ({ page }, info) => {
    const seen = new Map<string, string>();
    await open(page, "/es");
    await walkSpanish(page, info, seen);
    expect(report(seen)).toEqual([]);
  });

  test("EN to ES with the visible switch leaves no stale English", async ({ page }, info) => {
    const seen = new Map<string, string>();
    await open(page, "/en");
    await press(page, page.getByTestId("lang-switch"), info);
    await page.waitForURL(/\/es(#.*)?$/);
    await page.waitForSelector("html[data-ready=true]");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await walkSpanish(page, info, seen);
    expect(report(seen)).toEqual([]);
  });

  test("the class names are Spanish in /es and English in /en", async ({ page }) => {
    const names = () => page.locator("[data-testid=class-card] h3").evaluateAll((els) => els.map((e) => e.firstChild?.textContent?.trim()));
    await open(page, "/es");
    expect(await names()).toEqual(["El Conducto", "El Artífice", "El Heraldo", "El Herrero"]);
    await open(page, "/en");
    expect(await names()).toEqual(["The Conduit", "The Artificer", "The Herald", "The Smith"]);
  });
});
