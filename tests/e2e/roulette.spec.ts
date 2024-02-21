import { test } from "@playwright/test";
import { RoulettePage } from "../../utils/roulette";

test.describe("Roulette", () => {
  let roulettePage: RoulettePage;

  test.beforeEach(async ({ page }) => {
    roulettePage = new RoulettePage(page);
    await roulettePage.goto();
  });

  test("Verifies the roulette isn't spinning while the timer is visible", async () => {
    await roulettePage.verifyRouletteNotSpinning();
  });

  test("Verifies the timer is hidden once it reaches 0 sec", async () => {
    await roulettePage.waitForTimerToReachZero();
  });

  test("Verifies the sound can be toggled on and off", async () => {
    await roulettePage.toggleSound(["Sound off", "Sound on"]);
  });

  test("Verifies that the total number of all winning bets is 100", async () => {
    await roulettePage.verifyTotalWinsEquals100();
  });

  test("Verifies that the system accepts the input and reflects the correct amount in the field", async () => {
    await roulettePage.verifyInputReflection("100");
  });

  test("Verifies the “Clear” button resets the entered number to zero", async () => {
    await roulettePage.verifyInputReflection("123");
    await roulettePage.verifyButtonFunctionality("Clear", 123, "0");
  });

  test("Verifies button functionality adds the correct amount", async () => {
    const originalValue = 1.26;

    //"Verifies the “+0.01” button adds 0.01 to the number entered in the field"
    await roulettePage.verifyButtonFunctionality(
      "+ 0.01",
      originalValue,
      (originalValue + 0.01).toFixed(2),
    );

    //"Verifies the “+0.1” button adds 0.1 to the number entered in the field"
    await roulettePage.verifyButtonFunctionality(
      "+ 0.1",
      originalValue,
      (originalValue + 0.1).toFixed(2),
    );

    //"Verifies the “+1” button adds 1 to the number entered in the field"
    await roulettePage.verifyPlusOneButtonFunctionality(
      "+ 1",
      originalValue,
      (originalValue + 1).toFixed(2),
    );

    //"Verifies the “+10” button adds 10 to the number entered in the field"
    await roulettePage.verifyPlusOneButtonFunctionality(
      "+ 10",
      originalValue,
      (originalValue + 10).toFixed(2),
    );

    //"Verifies the “+100” button adds 100 to the number entered in the field"
    await roulettePage.verifyButtonFunctionality(
      "+ 100",
      originalValue,
      (originalValue + 100).toFixed(2),
    );

    //"Verifies the “1/2” button divides the number entered in the field by two"
    await roulettePage.verifyButtonFunctionality(
      "1/ 2",
      originalValue,
      (originalValue / 2).toFixed(2),
    );

    //Verifies the “x2” button multiplies the number entered in the field by two
    await roulettePage.verifyButtonFunctionality(
      "x 2",
      originalValue,
      (originalValue * 2).toFixed(2),
    );
  });

  test("Verifies the display and availability of all three betting options while the roulette is idle and the betting timer is active", async () => {
    await roulettePage.verifyBettingOptionsAvailability();
  });

  test("Verifies the Sign In modal is shown if not authenticated user trying to place a bet", async () => {
    test.setTimeout(30000);
    await roulettePage.verifySignInModalOnBet();
  });
});
