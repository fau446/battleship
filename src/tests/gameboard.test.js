import gameboard from "../modules/gameboard";
import ship from "../modules/ship";

// placeShip tests

test("Invalid placement of ship of Length 2 at [9, 9] horizontally", () => {
  const shipLengthTwo = ship(2);
  const gBoard = gameboard();
  expect(gBoard.placeShip(shipLengthTwo, 9, 9, "horizontal")).toEqual(false);
});

test("Invalid placement of ship of Length 4 at [5, 6] vertically", () => {
  const shipLengthFour = ship(4);
  const gBoard = gameboard();
  expect(gBoard.placeShip(shipLengthFour, 7, 6, "vertical")).toEqual(false);
});

test("Place ship of Length 2 at [0, 1] vetically", () => {
  const shipLengthTwo = ship(2);
  const gBoard = gameboard();
  gBoard.placeShip(shipLengthTwo, 0, 1, "vertical");
  expect(gBoard.board[0][1].shipObj).toEqual(shipLengthTwo);
  expect(gBoard.board[1][1].shipObj).toEqual(shipLengthTwo);
});

test("Place ship of Length 4 at [4, 5] horizontally", () => {
  const shipLengthFour = ship(4);
  const gBoard = gameboard();
  gBoard.placeShip(shipLengthFour, 4, 5, "horizontal");
  expect(gBoard.board[4][5].shipObj).toEqual(shipLengthFour);
  expect(gBoard.board[4][6].shipObj).toEqual(shipLengthFour);
  expect(gBoard.board[4][7].shipObj).toEqual(shipLengthFour);
  expect(gBoard.board[4][8].shipObj).toEqual(shipLengthFour);
  expect(gBoard.board[4][9].shipObj).toEqual(null);
});

// receiveAttack Tests

test("Receive attack on an empty square", () => {
  const emptyBoard = gameboard();
  emptyBoard.receiveAttack(6, 5);
  expect(emptyBoard.board[6][5].isHit).toEqual(true);
});

test("Receive attack on a ship", () => {
  const shipLengthTwo = ship(2);
  const gBoard = gameboard();
  gBoard.placeShip(shipLengthTwo, 0, 0, "vertical");
  gBoard.receiveAttack(0, 0);
  expect(gBoard.board[0][0].isHit).toEqual(true);
  expect(shipLengthTwo.timesHit).toEqual(1);
});

// This test might be redundant
test("Receive attack on a ship that sinks", () => {
  const shipLengthOne = ship(1);
  const gBoard = gameboard();
  gBoard.placeShip(shipLengthOne, 0, 0, "vertical");
  gBoard.receiveAttack(0, 0);
  expect(gBoard.board[0][0].isHit).toEqual(true);
  expect(shipLengthOne.sunk).toEqual(true);
});
