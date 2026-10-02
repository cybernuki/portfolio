import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { findForbidden } from "../src/features/content/domain/forbidden";

const TIERS = ["full", "calm", "static"] as const;
const SECTIONS = ["abilities", "package", "quests", "journey", "codex", "arsenal", "party"] as const;

const isPhone = (info: TestInfo) => info.project.name.startsWith("phone");

async function open(page: Page, tier: string, path = "/en") {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript((t) => localStorage.setItem("portfolio.motion", t as string), tier);
  await page.goto(path);
  await page.waitForSelector("html[data-ready=true]");
  return errors;
}

async function press(locator: ReturnType<Page["locator"]>, info: TestInfo) {
  await locator.scrollIntoViewIfNeeded();
  if (isPhone(info)) await locator.tap();
  else await locator.click();
}

const overflow = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

async function shot(page: Page, id: string, file: string) {
  await page.evaluate((sid) => {
    const el = document.getElementById(sid)!;
    window.scrollTo(0, sid === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - 72);
  }, id);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `docs/evidence/obsidian/${file}.png` });
}

for (const tier of TIERS) {
  test.describe(`tier ${tier}`, () => {
    test("renders: ready flag, one h1, section h2s, embers per tier, no overflow, no errors", async ({ page }) => {
      const errors = await open(page, tier);
      await expect(page.locator("h1")).toHaveCount(1);
      for (const id of SECTIONS) await expect(page.locator(`#${id} h2`).first()).toBeAttached();
      await expect(page.locator("html")).toHaveAttribute("data-tier", tier);
      if (tier === "static") {
        await expect(page.getByTestId("embers")).toHaveCount(0);
        await expect(page.locator("html")).toHaveAttribute("data-webgl", "off");
      } else {
        await expect(page.locator("html")).toHaveAttribute("data-webgl", "on");
        await expect(page.getByTestId("embers")).toHaveAttribute("data-mode", tier === "full" ? "animated" : "still");
      }
      for (const id of SECTIONS) {
        await page.evaluate((sid) => document.getElementById(sid)!.scrollIntoView(), id);
        expect(await overflow(page)).toBeLessThanOrEqual(0);
      }
      expect(errors).toEqual([]);
    });

    test("hero CTA is visible in the first viewport", async ({ page }) => {
      await open(page, tier);
      await expect(page.getByTestId("hero-join")).toBeInViewport({ ratio: 1 });
      await expect(page.getByTestId("hud-join")).toBeInViewport({ ratio: 1 });
    });

    test("Start this quest preselects the contact quest by tap and by keyboard", async ({ page }, info) => {
      await open(page, tier);
      const cards = page.getByTestId("start-quest");
      await expect(cards).toHaveCount(4);
      await press(cards.nth(3), info);
      await expect(page.getByTestId("party-quest")).toContainText("Quest: Vibe-coded app to production");
      await expect(page).toHaveURL(/#party$/);
      await page.evaluate(() => window.scrollTo(0, 0));
      const bots = cards.nth(2);
      await bots.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByTestId("party-quest-name")).toHaveText("Bots and agents");
      expect(await page.evaluate(() => document.activeElement?.id)).toBe("party");
    });

    test("quest log: tabs by tap, arrow keys, Home and End", async ({ page }, info) => {
      await open(page, tier);
      const tabs = page.getByTestId("quest-tab");
      await expect(tabs).toHaveCount(6);
      await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
      await expect(page.locator("[data-testid=quest-panel]:not([hidden])")).toHaveAttribute("data-quest", "context-engine-mcp");
      await press(tabs.nth(2), info);
      await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
      await tabs.nth(2).focus();
      await page.keyboard.press("ArrowDown");
      await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");
      await expect(tabs.nth(3)).toBeFocused();
      await page.keyboard.press("ArrowUp");
      await page.keyboard.press("ArrowUp");
      await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("End");
      await expect(tabs.nth(5)).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press("Home");
      await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
      await expect(page.locator("[data-testid=quest-panel]:not([hidden])")).toHaveCount(1);
    });

    test("codex: FAQ items open and close", async ({ page }, info) => {
      await open(page, tier);
      const items = page.getByTestId("faq-item");
      await expect(items).toHaveCount(5);
      const first = items.first();
      await press(first.locator("summary"), info);
      await expect(first).toHaveAttribute("open", "");
      await press(first.locator("summary"), info);
      await expect(first).not.toHaveAttribute("open", "");
    });

    test("HUD: options, motion tiers, language switch, section menu", async ({ page }, info) => {
      await open(page, tier);
      await press(page.getByTestId("options-btn"), info);
      await expect(page.getByTestId("options")).toBeVisible();
      // Audio is switched off by default: no music or sfx controls.
      await expect(page.getByTestId("music-switch")).toHaveCount(0);
      await expect(page.getByTestId("sfx-switch")).toHaveCount(0);
      await press(page.getByTestId("tier-calm"), info);
      await expect(page.locator("html")).toHaveAttribute("data-tier", "calm");
      await page.keyboard.press("Escape");
      await expect(page.getByTestId("options")).toBeHidden();
      await page.keyboard.press("m");
      await expect(page.locator("html")).toHaveAttribute("data-tier", "static");
      await expect(page.getByTestId("live-region")).toContainText(/Motion: OFF/);
      await page.keyboard.press("m");
      await expect(page.locator("html")).toHaveAttribute("data-tier", "full");
      await expect(page.getByTestId("lang-switch")).toHaveAttribute("href", "/es");
      if (isPhone(info)) {
        await press(page.getByTestId("menu-btn"), info);
        await expect(page.getByTestId("site-menu")).toBeVisible();
        await press(page.getByTestId("site-menu").getByRole("link", { name: /Codex/ }), info);
        await expect(page.getByTestId("site-menu")).toBeHidden();
        await expect(page).toHaveURL(/#codex$/);
      } else {
        await expect(page.getByTestId("menu-btn")).toBeHidden();
        await page.locator(".hud-nav").getByRole("link", { name: "Codex" }).click();
        await expect(page).toHaveURL(/#codex$/);
      }
    });

    test("contact: TODO never renders, coming soon states, github and linkedin links", async ({ page }) => {
      await open(page, tier);
      expect(await page.locator("body").innerText()).not.toMatch(/TODO/);
      expect(await page.content()).not.toMatch(/TODO\(/);
      await expect(page.getByTestId("cta-upwork")).toHaveAttribute("href", /upwork\.com\/freelancers\//);
      await expect(page.getByTestId("cta-upwork")).toHaveClass(/primary/);
      await expect(page.getByTestId("cta-upwork")).toContainText("Hire me on Upwork");
      await expect(page.getByTestId("cta-booking")).toHaveAttribute("data-soon", "true");
      await expect(page.getByTestId("cta-booking")).toContainText("Coming soon");
      await expect(page.getByTestId("cta-github")).toHaveAttribute("href", /github\.com\/cybernuki/);
      await expect(page.getByTestId("cta-linkedin")).toHaveAttribute("href", /linkedin\.com/);
      await expect(page.locator(".btn.primary")).toHaveCount(4); // hero, hud, featured package, party: at most one per screen (package and party are far apart)
    });
  });
}

test("embers stay within the particle budget for the viewport", async ({ page }, info) => {
  await open(page, "full");
  const count = Number(await page.getByTestId("embers").getAttribute("data-count"));
  if (isPhone(info)) expect(count).toBeLessThanOrEqual(50);
  else expect(count).toBeLessThanOrEqual(150);
  expect(count).toBeGreaterThan(0);
});

test("HUD hides on scroll down and returns on scroll up", async ({ page }, info) => {
  test.skip(isPhone(info), "wheel scrolling is desktop only");
  await open(page, "full");
  const hud = page.locator("[data-hud]");
  await expect(hud).toHaveAttribute("data-visible", "true");
  await page.mouse.move(400, 400);
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(120);
  }
  await expect(hud).toHaveAttribute("data-visible", "false");
  for (let i = 0; i < 3; i++) {
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(120);
  }
  await expect(hud).toHaveAttribute("data-visible", "true");
});

test("HUD strip ignores pointer events, controls take them", async ({ page }) => {
  await open(page, "full");
  const pe = await page.evaluate(() => ({
    strip: getComputedStyle(document.querySelector(".hud-strip")!).pointerEvents,
    ctl: getComputedStyle(document.querySelector(".hud-ctl")!).pointerEvents,
    join: getComputedStyle(document.querySelector("[data-testid=hud-join]")!).pointerEvents,
  }));
  expect(pe).toEqual({ strip: "none", ctl: "auto", join: "auto" });
});

test("static tier downloads no GSAP", async ({ page }) => {
  const scripts: string[] = [];
  page.on("response", (r) => r.url().endsWith(".js") && scripts.push(r.url()));
  await open(page, "static");
  await page.waitForTimeout(500);
  const bodies = await Promise.all(scripts.map((u) => page.request.get(u).then((r) => r.text())));
  expect(bodies.some((b) => b.includes("_gsap") || b.includes("ScrollTrigger.create"))).toBe(false);
});

test("reduced motion maps to calm", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/en");
  await page.waitForSelector("html[data-ready=true]");
  await expect(page.locator("html")).toHaveAttribute("data-tier", "calm");
  await ctx.close();
});

test("Spanish locale: lang, hreflang, labels, JSON-LD, llms.txt, sitemap, no forbidden names", async ({ page, request }) => {
  const errors = await open(page, "static", "/es");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("link[rel=alternate][hreflang=en]")).toHaveCount(1);
  await expect(page.locator("link[rel=alternate][hreflang=x-default]")).toHaveCount(1);
  await expect(page.locator("#abilities h2")).toContainText("Habilidades");
  await expect(page.locator("#quests h2")).toContainText("Misiones");
  await expect(page.locator("#journey h2")).toContainText("El viaje");
  await expect(page.locator("#codex h2")).toContainText("Códice");
  await expect(page.getByTestId("hero-join")).toHaveText("Únete al grupo");
  const ld = await page.locator("script[type='application/ld+json']").first().textContent();
  for (const t of ["ProfilePage", "Person", "WebSite", "Service"]) expect(ld).toContain(t);
  expect((ld!.match(/"@type":"Service"/g) ?? []).length).toBe(4);
  expect((await request.get("/llms.txt")).ok()).toBe(true);
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/es");
  expect((await request.get("/robots.txt")).ok()).toBe(true);
  expect(findForbidden(await page.locator("html").innerText())).toEqual([]);
  expect(findForbidden(await page.content())).toEqual([]);
  expect(findForbidden(await (await request.get("/llms.txt")).text())).toEqual([]);
  expect(errors).toEqual([]);
});

test("per-locale OG images are served", async ({ request }) => {
  for (const l of ["en", "es"]) {
    const res = await request.get(`/${l}/opengraph-image`);
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toContain("image/png");
  }
});

test("root redirects by Accept-Language", async ({ browser }) => {
  const ctx = await browser.newContext({ locale: "es-CO", extraHTTPHeaders: { "Accept-Language": "es-CO,es;q=0.9" } });
  const page = await ctx.newPage();
  await page.goto("/");
  expect(page.url()).toMatch(/\/es$/);
  await ctx.close();
});

test("evidence screenshots", async ({ page }, info) => {
  test.skip(info.project.name === "phone-small", "evidence is captured on phone and desktop");
  mkdirSync("docs/evidence/obsidian", { recursive: true });
  await open(page, "full");
  await page.waitForTimeout(800);
  const p = isPhone(info) ? "01-phone" : "02-desktop";
  await shot(page, "top", `${p}-hero`);
  if (isPhone(info)) {
    await shot(page, "abilities", `${p}-abilities`);
    await shot(page, "quests", `${p}-quests`);
    await shot(page, "party", `${p}-party`);
  } else {
    for (const id of ["abilities", "quests", "journey", "codex", "party"]) await shot(page, id, `${p}-${id}`);
  }
});
