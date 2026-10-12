import { expect, test } from "@playwright/test";

test("homepage renders shared UI and interactive Base UI controls", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Next.js starter template" })
  ).toBeVisible();

  const html = page.locator("html");
  const before = await html.getAttribute("class");
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect
    .poll(async () => await html.getAttribute("class"))
    .not.toBe(before);

  await page.getByRole("button", { name: "Open dialog" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Base UI dialog" })
  ).toBeVisible();
  await dialog
    .locator('[data-slot="dialog-footer"]')
    .getByRole("button", { name: "Close" })
    .click();
  await expect(dialog).toBeHidden();
});
