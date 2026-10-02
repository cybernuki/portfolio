import { expect, test, type Page, type TestInfo } from "@playwright/test";

const CATALOG = "https://www.upwork.com/services/product/development-it-deploy-your-ai-built-app-to-production-2106139410396282667";
const isPhone = (info: TestInfo) => info.project.name.startsWith("phone");

async function open(page: Page, tier: string, path = "/en") {
  await page.addInitScript((t) => localStorage.setItem("portfolio.motion", t as string), tier);
  await page.goto(path);
  await page.waitForSelector("html[data-ready=true]");
}

async function press(locator: ReturnType<Page["locator"]>, info: TestInfo) {
  await locator.scrollIntoViewIfNeeded();
  if (isPhone(info)) await locator.tap();
  else await locator.click();
}

const paused = (page: Page) => page.getByTestId("package-loop").evaluate((v: HTMLVideoElement) => v.paused);

for (const locale of ["en", "es"] as const) {
  test.describe(`featured package ${locale}`, () => {
    test("section, tiers, CTA href, card link and no overflow", async ({ page }) => {
      await open(page, "full", `/${locale}`);
      const section = page.locator("#package");
      await expect(section.locator("h2")).toHaveText(locale === "en" ? /Featured package/ : /Paquete destacado/);
      await expect(section.getByTestId("package-tier")).toHaveCount(3);
      const cta = section.getByTestId("package-cta");
      await expect(cta).toHaveAttribute("href", CATALOG);
      await expect(cta).toHaveAttribute("target", "_blank");
      await expect(cta).toHaveAttribute("rel", /noopener/);
      await expect(cta).toHaveText(locale === "en" ? "See the package on Upwork" : "Ver el paquete en Upwork");
      const card = page.getByTestId("catalog-link");
      await expect(card).toHaveCount(1);
      await expect(card).toHaveAttribute("href", CATALOG);
      await expect(card).toHaveText(locale === "en" ? "Buy as a fixed-price package" : "Contrátalo como paquete a precio fijo");
      expect((await cta.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      expect((await card.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    });
  });
}

test("full tier: loop has preload=none and plays only while in view", async ({ page }) => {
  await open(page, "full");
  const loop = page.getByTestId("package-loop");
  await expect(loop).toHaveAttribute("preload", "none");
  await expect(loop).not.toHaveAttribute("autoplay", /.*/);
  expect(await paused(page)).toBe(true);
  await page.locator("#package").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.getElementById("package")!.scrollIntoView({ block: "center" }));
  await expect.poll(() => paused(page), { timeout: 10_000 }).toBe(false);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(() => paused(page), { timeout: 10_000 }).toBe(true);
});

test("calm tier: poster with a play button, never autoplays", async ({ page }) => {
  await open(page, "calm");
  await page.evaluate(() => document.getElementById("package")!.scrollIntoView({ block: "center" }));
  await expect(page.getByTestId("package-play")).toBeVisible();
  await page.waitForTimeout(800);
  expect(await paused(page)).toBe(true);
});

test("static tier: poster only, and the full video is a plain link", async ({ page }) => {
  await open(page, "static");
  await expect(page.getByTestId("package-poster")).toBeVisible();
  await expect(page.getByTestId("package-loop")).toHaveCount(0);
  await expect(page.locator("#package").getByTestId("overview-link")).toHaveAttribute("href", "/media/deploy-ai-app.mp4");
});

test("full video dialog opens by tap and by keyboard, uses the right src, and Esc closes it", async ({ page }, info) => {
  await open(page, "full");
  const dialog = page.locator("#package").getByTestId("overview-dialog");
  const trigger = page.locator("#package").getByTestId("overview-trigger");
  await expect(page.getByTestId("overview-video")).toHaveCount(0);

  await press(trigger, info);
  await expect(dialog).toBeVisible();
  const video = dialog.getByTestId("overview-video");
  await expect(video).toHaveAttribute("src", "/media/deploy-ai-app.mp4");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("autoplay", /.*/);
  await expect(dialog).toHaveAccessibleName(/./);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("overview-video")).toHaveCount(0);

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect(video).toHaveAttribute("src", "/media/deploy-ai-app.mp4");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("card overview opens the dialog too", async ({ page }, info) => {
  await open(page, "full");
  const card = page.locator("#service-prototype-to-production");
  await press(card.getByTestId("overview-trigger"), info);
  await expect(card.getByTestId("overview-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(card.getByTestId("overview-dialog")).toBeHidden();
});
