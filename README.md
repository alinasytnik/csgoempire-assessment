# CSGO Empire Roulette Automation Tests

### Prerequisites

Node.js (v18.0 or newer)
npm (v7.0 or newer)

### Installation

Install dependencies using npm:

`npm install`

### Usage

To run the Playwright tests in UI mode:

`npm start`

# CSGO Empire Test Cases

> 🤖 - The logic is automated in the code

**Pre-conditions:** Navigate to [csgoempire.com](http://csgoempire.com/) (Verify that it’s redirecting to the Roulette (Main) page)

## Roulette Page

### 1. Roulette Wheel:

- 🤖 Verify the roulette isn’t spinning while the timer is visible.
- Verify the smoothness and realism of the roulette wheel spin animation and the ball movement. Ensure these animations perform well without lagging or stuttering.
- Verify the coin images are alternating one after the other and they don't repeat themselves.
- Verify that when the game starts, the roulette is in a neutral state with no previous results highlighted.
- Verify the roulette starts spinning after the 15-second timer expires.
- Verify the spin is complete within a reasonable time, not exceeding a few seconds.
- Verify the results do not show any predictable patterns over a large number of spins.

### 2. Timer:

- 🤖 Verify the timer is hidden once it reaches 0 sec.
- Verify the timer is displayed and started after the winners are announced.
- Verify the timer count down second by second (millisecond by millisecond) and reach zero precisely at the 15-second mark.

### 3. Sound Toggle:

- 🤖 Verify the sound can be toggled on and off.
- Verify the setting persists between spins.

### 4. Previous Rolls:

- Verify the previous rolls displayed accurately reflect the actual past spin results.
- Verify the most recent spin result was added to the previous rolls without delay.
- Verify the latest roll displayed last, followed by older rolls in sequence.
- Verify that the display only shows the last 10 spins, with older results removed as new ones are added.

### 5. Last 100:

- 🤖 Verify that the total number of all winning bets is 100.
- Verify the number of wins remains unchanged until the completion of the 100th spin, at which point they should update to reflect the new results.
- Verify that each number shows the correct number of wins in the previous 100 rolls.
- Verify that the number of wins is consistent across sessions, provided that the 100th spin has not been reached in the interim.
- Verify the number of wins for each betting option matches the rules and logic of the game.

### 6. Bet Amount Field:

- 🤖 Verify that the system accepts the input and reflects the correct amount in the field.
- 🤖 Verify the “Clear” button resets the entered number to zero.
- 🤖 Verify the “+0.01” button adds 0.01 to the number entered in the field.
- 🤖 Verify the “+0.1” button adds 0.1 to the number entered in the field.
- 🤖 Verify the “+1” button adds 1 to the number entered in the field.
- 🤖 Verify the “+10” button adds 10 to the number entered in the field.
- 🤖 Verify the “+100” button adds 100 to the number entered in the field.
- 🤖 Verify the “1/2” button divides the number entered in the field by two.
- 🤖 Verify the “x2” button multiplies the number entered in the field by two.
- Verify the “Max” button sets the bet to the maximum available amount that the user has on the deposit.
- Verify that the system rejects invalid inputs (letters, not allowed characters, negative numbers, numbers that are lower than minimal bet), not allowing them to be entered into the field.

### 7. Place Bet:

- 🤖 Verify the display and availability of all three betting options while the roulette is idle and the betting timer is active.
- 🤖 Verify the Sign In modal is shown if not authenticated user trying to place a bet
- Verify the display of all three betting options as non-interactive during the roulette spin.
- Verify the betting interface prevents bet placement once the betting timer has expired.
- Verify the total bets display reflects the accurate count and sum of players' bets for each betting option.
- Verify the table of winning bets is visually highlighted when the corresponding betting option wins in roulette.
- Verify the table of winning bets accurately multiplies the sum of all winning bets by the winning multiplier (2x or 14x) specific to the betting option that was rolled.
- Verify the table of losing bets correctly reflects the subtraction of the total bet amount from the players' balances.
- Verify the "Place Bet" button submits the entered bet amount for the selected betting option.
- Verify the bet amount field does not accept inputs once the "Place Bet" button is activated until the next betting round.
- Verify the update of the player's balance immediately after the results are revealed.
- Verify the bet amount is cleared from the bet field upon successful placement.
- Verify that the bet placement is blocked and the “Insufficient balance” message is displayed if the player attempts to exceed their available balance.
- Verify that the bet placement is blocked and the “Minimum bet amount is 0.01” error message is displayed if the player attempts to enter a value lower then 0.01.
- Verify the reset of the bet amount field to a default value or empty state when a new betting round starts.
