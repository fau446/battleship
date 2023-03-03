import gameboard from "../modules/gameboard";
import ship from "../modules/ship";

const gBoard = gameboard();

test("Invalid placement of ship of Length 2 at [9, 9] horizontally", () => {
  const shipLengthTwo = ship(2);
  expect(gBoard.placeShip(shipLengthTwo, 9, 9, "horizontal")).toEqual(false);
});

test("Invalid placement of ship of Length 4 at [5, 6] vertically", () => {
  const shipLengthFour = ship(4);
  expect(gBoard.placeShip(shipLengthFour, 7, 6, "vertical")).toEqual(false);
});

test("Place ship of Length 2 at [0, 1] vetically", () => {
  const shipLengthTwo = ship(2);
  gBoard.placeShip(shipLengthTwo, 0, 1, "vertical");
  expect(gBoard.board[0][1].shipObj).toEqual(shipLengthTwo);
  expect(gBoard.board[1][1].shipObj).toEqual(shipLengthTwo);
});

test("Place ship of Length 4 at [4, 5] horizontally", () => {
  const shipLengthFour = ship(4);
  gBoard.placeShip(shipLengthFour, 4, 5, "horizontal");
  expect(gBoard.board[4][5].shipObj).toEqual(shipLengthFour);
  expect(gBoard.board[4][6].shipObj).toEqual(shipLengthFour);
  expect(gBoard.board[4][7].shipObj).toEqual(shipLengthFour);
  expect(gBoard.board[4][8].shipObj).toEqual(shipLengthFour);
  expect(gBoard.board[4][9].shipObj).toEqual(null);
});
