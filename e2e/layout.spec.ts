import { expect, test } from "@playwright/test";

test("touch targets are at least 44px", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("portfolio.motion", "full"));
  await page.goto("/en");
  await page.waitForSelector("html[data-ready=true]");
  const small = await page.evaluate(() => {
    const sel = "button, a[href], [role=tab], summary";
    return [...document.querySelectorAll<HTMLElement>(sel)]
      .filter((el) => !el.closest("[hidden]") && !el.closest(".skip") && !el.closest(".answer"))
      .map((el) => ({ t: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 24), r: el.getBoundingClientRect() }))
      .filter((x) => x.r.width > 0 && (x.r.height < 43.5 || x.r.width < 43.5))
      .map((x) => `${x.t} ${Math.round(x.r.width)}x${Math.round(x.r.height)}`);
  });
  expect(small).toEqual([]);
});

test("hero fits the first screen with the CTA above the fold", async ({ page }) => {
  await page.goto("/en");
  await page.waitForSelector("html[data-ready=true]");
  const box = await page.getByTestId("hero-join").boundingBox();
  const vh = page.viewportSize()!.height;
  expect(box!.y + box!.height).toBeLessThanOrEqual(vh);
});
