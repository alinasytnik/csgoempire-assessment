import { Page } from "@playwright/test";

export async function isRouletteSpinning(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const targetElement = document.querySelector("div.wheel");
    if (!targetElement) {
      return false;
    }
    const style = window.getComputedStyle(targetElement);
    const backgroundPosition = style.backgroundPosition;

    const positionValues = backgroundPosition.split(" ").map(Number);
    const isSpinning = positionValues.some((pos) => !isNaN(pos) && pos > 0);

    return isSpinning;
  });
}
