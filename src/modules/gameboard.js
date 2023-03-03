const gameboard = () => {
  const board = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      const cell = { isHit: false, shipObj: null };
      row.push(cell);
    }
    board.push(row);
  }

  function checkCoordinates(length, row, col, orientation) {
    if (orientation === "vertical") {
      row += length - 1;
      if (row < 0 || row > 9) return false;
    } else if (orientation === "horizontal") {
      col += length - 1;
      if (col < 0 || col > 9) return false;
    }
  }

  function placeShip(ship, row, col, orientation) {
    if (checkCoordinates(ship.length, row, col, orientation) === false)
      return false;

    if (orientation === "vertical") {
      for (let i = 0; i < ship.length; i++) {
        board[row][col].shipObj = ship;
        row += 1;
      }
    } else if (orientation === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        board[row][col].shipObj = ship;
        col += 1;
      }
    }
  }

  return {
    get board() {
      // should probably be private.
      return board;
    },
    placeShip,
  };
};

export default gameboard;
