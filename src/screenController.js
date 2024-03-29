import game from "./game";

const screenController = () => {
  const gameController = game();

  // Cache DOM
  const boards = document.querySelectorAll(".board");
  const friendlyCells = document.querySelectorAll(".friendly");
  const enemyCells = document.querySelectorAll(".enemy");
  const display = document.querySelector(".display");
  const rotateButton = document.querySelector(".rotate");
  rotateButton.addEventListener("click", changePlacementOrientation);

  friendlyCells.forEach((cell) => {
    cell.addEventListener("mouseover", mouseoverGhostShip);
  });
  friendlyCells.forEach((cell) => {
    cell.addEventListener("mouseout", mouseoutGhostShip);
  });

  function mouseoverGhostShip() {
    let row = Number(this.parentElement.dataset.row);
    let col = Number(this.dataset.col);
    const shipLength = gameController.playerShips[0].length;
    const orientation = gameController.placementOrientation;

    if (
      gameController.humanPlayer.gBoard.checkCoordinates(
        shipLength,
        row,
        col,
        orientation
      ) === false
    )
      return;

    if (orientation === "horizontal") {
      for (let i = 0; i < shipLength; i++) {
        boards[0].children[row].children[col].classList.add("hover");
        col++;
      }
    } else if (orientation === "vertical") {
      for (let i = 0; i < shipLength; i++) {
        boards[0].children[row].children[col].classList.add("hover");
        row++;
      }
    }
  }

  function mouseoutGhostShip() {
    let row = Number(this.parentElement.dataset.row);
    let col = Number(this.dataset.col);
    const shipLength = gameController.playerShips[0].length;
    const orientation = gameController.placementOrientation;

    if (
      gameController.humanPlayer.gBoard.checkCoordinates(
        shipLength,
        row,
        col,
        orientation
      ) === false
    )
      return;

    if (orientation === "horizontal") {
      for (let i = 0; i < shipLength; i++) {
        boards[0].children[row].children[col].classList.remove("hover");
        col++;
      }
    } else if (orientation === "vertical") {
      for (let i = 0; i < shipLength; i++) {
        boards[0].children[row].children[col].classList.remove("hover");
        row++;
      }
    }
  }

  function changePlacementOrientation() {
    gameController.changePlacementOrientation();
  }

  function emptyCellHit(cell) {
    cell.classList.add("miss");
  }

  function occupiedCellHit(cell) {
    cell.classList.add("hit");
  }

  function playerShipCell(cell) {
    cell.classList.add("player-ship");
  }

  function renderBoard(player) {
    let boardNumber = 0;
    if (player === gameController.computerPlayer) boardNumber = 1;

    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // if boardNumber === 0, set player ships to blue
        if (boardNumber === 0 && player.gBoard.board[i][j].shipObj != null) {
          playerShipCell(boards[`${boardNumber}`].children[i].children[j]);
        }

        if (
          player.gBoard.board[i][j].isHit === true &&
          player.gBoard.board[i][j].shipObj != null
        ) {
          occupiedCellHit(boards[`${boardNumber}`].children[i].children[j]);
          boards[`${boardNumber}`].children[i].children[j].classList.remove(
            "player-ship"
          );
        } else if (player.gBoard.board[i][j].isHit === true) {
          emptyCellHit(boards[`${boardNumber}`].children[i].children[j]);
        }
      }
    }
  }

  function bindPlaceShipControls() {
    friendlyCells.forEach((cell) => {
      cell.addEventListener("click", placePlayerShip);
    });
  }

  function unbindPlaceShipControls() {
    friendlyCells.forEach((cell) => {
      cell.removeEventListener("click", placePlayerShip);
      cell.removeEventListener("mouseover", mouseoverGhostShip);
      cell.removeEventListener("mouseout", mouseoutGhostShip);
    });
  }

  function unbindControls() {
    enemyCells.forEach((cell) => {
      cell.removeEventListener("click", attackCell);
    });
  }

  function bindControls() {
    enemyCells.forEach((cell) => {
      cell.addEventListener("click", attackCell);
    });
  }

  function updateDisplay(player, result) {
    if (result === "humanWin")
      display.innerText = "All your opponent's ships have been sunk! You win!";
    else if (result === "computerWin")
      display.innerText = "All your ship's have been sunk! You lose!";

    if (player === gameController.humanPlayer) {
      if (result === "miss") display.innerText = "You missed!";
      else if (result === "hit") display.innerText = "You hit a ship!";
      else if (result === "sink") display.innerText = "You sunk a ship!";
    } else if (player === gameController.computerPlayer) {
      if (result === "miss") display.innerText = "Your opponent missed!";
      else if (result === "hit")
        display.innerText = "Your opponent hit a ship!";
      else if (result === "sink")
        display.innerText = "Your opponent sunk a ship!";
    }
  }

  function attackCell() {
    const playTurnResult = gameController.playTurn(
      Number(this.parentElement.dataset.row),
      Number(this.dataset.col)
    );
    if (playTurnResult === false) return;
    renderBoard(gameController.computerPlayer);
    unbindControls();
    if (playTurnResult[2] === "humanWin") {
      updateDisplay(gameController.humanPlayer, playTurnResult[2]);
      return;
    }
    updateDisplay(gameController.humanPlayer, playTurnResult[0]);

    // set a delay before the computer's action is displayed.
    setTimeout(() => {
      renderBoard(gameController.humanPlayer);
      if (playTurnResult[2] === "computerWin") {
        updateDisplay(gameController.computerPlayer, playTurnResult[2]);
        return;
      }
      bindControls();
      updateDisplay(gameController.computerPlayer, playTurnResult[1]);
    }, 1000);
  }

  function placePlayerShip() {
    const { row } = this.parentElement.dataset;
    const { col } = this.dataset;

    if (gameController.placeShip(Number(row), Number(col)) === false) {
      display.innerText = "Invalid placement, please try again!";
      return;
    }

    renderBoard(gameController.humanPlayer);

    const shipsArray = gameController.playerShips;

    // If true, update display
    if (shipsArray.length === 0) {
      unbindPlaceShipControls();
      display.innerText = "Click on an enemy tile to attack!";
      rotateButton.classList.add("hide");
      boards[1].classList.toggle("hide");
      return;
    }

    display.innerText = `Click on a tile to place your ${shipsArray[0].name}.`;
  }

  bindControls();
  bindPlaceShipControls();
  display.innerText = `Click on a tile to place your ${gameController.playerShips[0].name}.`;
};

export default screenController;
