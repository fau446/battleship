import game from "../game";

test("playTurn function is given the correct parameters", () => {
  const gameInstance = game();
  expect(gameInstance.playTurn(2, 3)).toEqual(true);
});

test("playTurn function is given incorrect parameters", () => {
  const gameInstance = game();
  expect(gameInstance.playTurn(10, 3)).toEqual(false);
});

test("playTurn function is given coordinates that have already been used", () => {
  const gameInstance = game();
  gameInstance.playTurn(2, 3);
  expect(gameInstance.playTurn(2, 3)).toEqual(false);
});
