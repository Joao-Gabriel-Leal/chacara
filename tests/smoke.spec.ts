import { expect, test } from "@playwright/test";

test("landing e dashboard carregam", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("O hub premium da nossa chacara.")).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByText("Dashboard individual")).toBeVisible();
  await expect(page.getByText("Bem-vindo de volta")).toBeVisible();
});
