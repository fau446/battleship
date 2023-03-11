import player from "../modules/player";
import gameboard from "../modules/gameboard";

// attack tests

test("Attack a valid enemy cell", () => {
  const attacker = player();
  const defender = player();
  expect(attacker.attack(5, 6, defender)).toEqual(true);
});

test("Attack a cell out of range", () => {
  const attacker = player();
  const defender = player();
  expect(attacker.attack(10, 11, defender)).toEqual(false);
});

test("Attack a cell that has already been hit", () => {
  const attacker = player();
  const defender = player();
  attacker.attack(2, 3, defender);
  expect(attacker.attack(2, 3, defender)).toEqual(false);
});
