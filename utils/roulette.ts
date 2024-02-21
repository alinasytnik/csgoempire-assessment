import { Page, expect } from "@playwright/test";
import { TIMEOUT } from "dns";

export class RoulettePage {
  page: Page;
  timerSelector = "div.font-numeric.text-2xl.font-bold";
  timerVisibleSelector = "div.wheel__item--visible";
  betInputSelector = 'input[placeholder="Enter bet amount..."]';
  // No choice to pick it up in other way. Otherwise I would add a test ID
  soundToggleButtonXPath =
    '//*[@id="app"]/div[1]/div[2]/div/div/div[1]/div[2]/div/div[1]/button';
  bettingOptionsSelector = "button.bet-btn";

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("https://csgoempire.com/");
    await expect(this.page).toHaveTitle(
      /CSGOEmpire | The most trusted CSGO Skin Gambling Site/i,
    );
  }

  async isRouletteSpinning(page: Page): Promise<boolean> {
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

  async verifyRouletteNotSpinning() {
    await expect(this.page.locator(this.timerSelector)).toBeVisible();
    const spinning = await this.isRouletteSpinning(this.page);
    expect(spinning).toBeFalsy();
  }

  async waitForTimerToReachZero() {
    await this.page.waitForFunction((selector: string) => {
      const timer: Element | null = document.querySelector(selector);
      return timer && timer.textContent?.trim() === "0.00";
    }, this.timerSelector);

    await expect(this.page.locator(this.timerVisibleSelector)).toHaveCount(1);
  }

  async toggleSound(expectedState: string[]) {
    for (const state of expectedState) {
      await this.page.click(this.soundToggleButtonXPath);
      await expect(this.page.locator(this.soundToggleButtonXPath)).toHaveText(
        state,
      );
    }
  }

  async verifyTotalWinsEquals100() {
    const selectors = ["coin-ct", "coin-bonus", "coin-t"];
    let totalWins = 0;
    for (const selector of selectors) {
      const text = await this.page.evaluate((className) => {
        const targetElement = document.querySelector(`.${className}.h-16.w-16`);
        const numberElement = targetElement?.nextElementSibling;
        return numberElement ? numberElement.textContent : null;
      }, selector);
      totalWins += parseInt(text || "0", 10);
    }
    expect(totalWins).toBe(100);
  }

  async verifyInputReflection(amount: string) {
    await this.page.fill(this.betInputSelector, amount);
    await expect(this.page.locator(this.betInputSelector)).toHaveValue(amount);
  }

  async verifyButtonFunctionality(
    buttonName: string,
    originalValue: number,
    expectedValue: string,
  ) {
    await this.page.fill(this.betInputSelector, originalValue.toString());
    await this.page.getByRole("button", { name: buttonName }).click();
    await expect(this.page.locator(this.betInputSelector)).toHaveValue(
      expectedValue,
    );
  }

  async verifyPlusOneButtonFunctionality(
    buttonName: string,
    originalValue: number,
    expectedValue: string,
  ) {
    await this.page.fill(this.betInputSelector, originalValue.toString());
    await this.page.getByRole("button", { name: buttonName }).first().click();
    await expect(this.page.locator(this.betInputSelector)).toHaveValue(
      expectedValue,
    );
  }

  async verifyBettingOptionsAvailability() {
    const bettingOptions = this.page.locator(this.bettingOptionsSelector);
    await expect(bettingOptions).toHaveCount(3);
    await bettingOptions.first().isEnabled();
    await bettingOptions.nth(1).isEnabled();
    await bettingOptions.nth(2).isEnabled();
  }

  async verifySignInModalOnBet() {
    await this.page.waitForLoadState("networkidle");

    await this.page.fill(this.betInputSelector, "123");
    const customSelector = `button[disable="false"].bet-btn`;
    await this.page.waitForSelector(customSelector);
    await this.page.locator(customSelector).first().click();
    const signInModal = this.page.getByText("Please sign in to start playing!");
    expect(signInModal).toBeVisible();
  }
}
