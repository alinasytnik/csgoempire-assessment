import { test, expect } from "@playwright/test";
import { isRouletteSpinning } from "../../utils/roulette";

test.describe("Roulette", () => {
  const timerSelector = "div.font-numeric.text-2xl.font-bold";
  const timerVisibleSelector = "div.wheel__item--visible";
  const betInputSelector = 'input[placeholder="Enter bet amount..."]';
  const originalValue = 1.23;

  test.beforeEach(async ({ page }) => {
    await page.goto("https://csgoempire.com/");
    await expect(page).toHaveTitle(
      /CSGOEmpire | The most trusted CSGO Skin Gambling Site/i,
    );
  });

  test("Verifies the roulette isn't spinning while the timer is visible", async ({
    page,
  }) => {
    await expect(page.locator(timerSelector)).toBeVisible();

    const rouletteSpinning = await isRouletteSpinning(page);
    expect(rouletteSpinning).toBeFalsy();
  });

  test("Verifies the timer is hidden once it reaches 0 sec", async ({
    page,
  }) => {
    await expect(page.locator(timerSelector)).toBeVisible();

    // Note: During the spin, two `timerVisibleSelector`s are visible
    await expect(page.locator(timerVisibleSelector)).toHaveCount(2);

    await page.waitForFunction((selector: string) => {
      const timer: Element | null = document.querySelector(selector);
      return timer && timer.textContent?.trim() === "0.00";
    }, timerSelector);

    // Note: After the spin, only one `timerVisibleSelector` is visible
    await expect(page.locator(timerVisibleSelector)).toHaveCount(1);
  });

  test("Verifies the sound can be toggled on and off", async ({ page }) => {
    // No choice to pick it up in other way. Otherwise I would add a test ID
    const soundToggleButtonSelector =
      '//*[@id="app"]/div[1]/div[2]/div/div/div[1]/div[2]/div/div[1]/button';

    await page.click(soundToggleButtonSelector);

    await expect(page.locator(soundToggleButtonSelector)).toHaveText(
      "Sound off",
    );

    await page.click(soundToggleButtonSelector);

    await expect(page.locator(soundToggleButtonSelector)).toHaveText(
      "Sound on",
    );
  });

  test("Verifies that the total number of all winning bets is 100", async ({
    page,
  }) => {
    const getNumberNextToCoinClass = (className: string) =>
      page.evaluate((className) => {
        const targetElement = document.querySelector(`.${className}.h-16.w-16`);
        const numberElement = targetElement?.nextElementSibling;
        return numberElement ? numberElement.textContent : null;
      }, className);

    const coinCTnumberOfWinsText = await getNumberNextToCoinClass("coin-ct");
    const coinBonusNumberOfWinsText =
      await getNumberNextToCoinClass("coin-bonus");
    const coinTnumberOfWinsText = await getNumberNextToCoinClass("coin-t");

    const tWinsNumber = parseInt(coinTnumberOfWinsText || "0", 10);
    const ctWinsNumber = parseInt(coinCTnumberOfWinsText || "0", 10);
    const bonusWinsNumber = parseInt(coinBonusNumberOfWinsText || "0", 10);

    const totalWins = tWinsNumber + ctWinsNumber + bonusWinsNumber;

    expect(totalWins).toBe(100);
  });

  test("Verifies that the system accepts the input and reflects the correct amount in the field", async ({
    page,
  }) => {
    const amountToInput = "100";

    await page.fill(betInputSelector, amountToInput);

    await expect(page.locator(betInputSelector)).toHaveValue(amountToInput);
  });
  test("Verifies the “Clear” button resets the entered number to zero", async ({
    page,
  }) => {
    await page.fill(betInputSelector, "123");

    await page.getByRole("button", { name: "Clear" }).first().click();

    await expect(page.locator(betInputSelector)).toHaveValue("0");
  });

  test("Verifies the “+0.01” button adds 0.01 to the number entered in the field", async ({
    page,
  }) => {
    await page.fill(betInputSelector, originalValue.toString());

    await page.getByRole("button", { name: "+ 0.01" }).click();

    const expectedValue = (originalValue + 0.01).toFixed(2);
    await expect(page.locator(betInputSelector)).toHaveValue(expectedValue);
  });
  test("Verifies the “+0.1” button adds 0.1 to the number entered in the field", async ({
    page,
  }) => {
    await page.fill(betInputSelector, originalValue.toString());

    await page.getByRole("button", { name: "+ 0.1" }).click();

    const expectedValue = (originalValue + 0.1).toFixed(2);
    await expect(page.locator(betInputSelector)).toHaveValue(expectedValue);
  });
  test("Verifies the “+1” button adds 1 to the number entered in the field", async ({
    page,
  }) => {
    await page.fill(betInputSelector, originalValue.toString());

    await page.getByRole("button", { name: "+ 1" }).first().click();

    const expectedValue = (originalValue + 1).toFixed(2);
    await expect(page.locator(betInputSelector)).toHaveValue(expectedValue);
  });
  test("Verifies the “+10” button adds 10 to the number entered in the field", async ({
    page,
  }) => {
    await page.fill(betInputSelector, originalValue.toString());

    // Isn't picking up by text
    await page.getByRole("button", { name: "+ 10" }).first().click();

    const expectedValue = (originalValue + 10).toFixed(2);
    await expect(page.locator(betInputSelector)).toHaveValue(expectedValue);
  });
  test("Verifies the “+100” button adds 100 to the number entered in the field", async ({
    page,
  }) => {
    await page.fill(betInputSelector, originalValue.toString());

    await page.getByRole("button", { name: "+ 100" }).first().click();

    const expectedValue = (originalValue + 100).toFixed(2);
    await expect(page.locator(betInputSelector)).toHaveValue(expectedValue);
  });
  test("Verifies the “1/2” button divides the number entered in the field by two", async ({
    page,
  }) => {
    const originalValue = 10;
    await page.fill(betInputSelector, originalValue.toString());

    await page.getByRole("button", { name: "1/ 2" }).click();

    const expectedValue = (originalValue / 2).toString();
    await expect(page.locator(betInputSelector)).toHaveValue(expectedValue);
  });
  test("Verifies the “x2” button multiplies the number entered in the field by two", async ({
    page,
  }) => {
    const originalValue = 10;
    await page.fill(betInputSelector, originalValue.toString());

    await page.getByRole("button", { name: "x 2" }).click();

    const expectedValue = (originalValue * 2).toString();
    await expect(page.locator(betInputSelector)).toHaveValue(expectedValue);
  });

  test("Verifies the display and availability of all three betting options while the roulette is idle and the betting timer is active", async ({
    page,
  }) => {
    test.setTimeout(30000);
    const bettingOptions = page.locator("button.bet-btn");
    await expect(bettingOptions).toHaveCount(3);

    await bettingOptions.first().isEnabled();
    await bettingOptions.nth(1).isEnabled();
    await bettingOptions.nth(2).isEnabled();
  });

  test("Verifies the Sign In modal is shown if not authenticated user trying to place a bet", async ({
    page,
  }) => {
    test.setTimeout(15000);
    await page.fill(betInputSelector, "123");

    const bettingOptions = page.locator("button.bet-btn");
    await bettingOptions.first().click();

    const signInModal = page.getByText("Please sign in to start playing!");

    expect(signInModal).toBeVisible;
  });

  //   NOTE: Needs authentication/balance to pass
  //   test("Verifies the “Max” button sets the bet to the maximum available amount that the user has on the deposit", async ({
  //     page,
  //   }) => {
  //     const depositAmountSelector =
  //       '//*[@id="empire-header"]/div[1]/div/div[3]/div[2]/div[3]/div/div/span/span/div/span[2]';
  //     const maxDepositAmount: string | null = await page
  //       .locator(depositAmountSelector)
  //       .textContent();

  //     await page.getByRole("button", { name: "Max" }).click();

  //     await expect(page.locator(betInputSelector)).toHaveValue(
  //       maxDepositAmount.trim(),
  //     );
  //   });
});
