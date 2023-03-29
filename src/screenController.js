import game from "./game";

const screenController = () => {
  const gameController = game();

  // Cache DOM
  const enemyCells = document.querySelectorAll(".enemy");

  function emptyCellHit(cell) {
    cell.classList.add("miss");
  }

  function occupiedCellHit(cell) {
    cell.classList.add("hit");
  }

  function renderBoard(player) {
    let boardNumber = 0;
    if (player === gameController.computerPlayer) boardNumber = 1;

    const boards = document.querySelectorAll(".board");
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (
          player.gBoard.board[i][j].isHit === true &&
          player.gBoard.board[i][j].shipObj != null
        ) {
          occupiedCellHit(boards[`${boardNumber}`].children[i].children[j]);
        } else if (player.gBoard.board[i][j].isHit === true) {
          emptyCellHit(boards[`${boardNumber}`].children[i].children[j]);
        }
      }
    }
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

  function attackCell() {
    if (
      gameController.playTurn(
        this.parentElement.dataset.row,
        this.dataset.col
      ) === false
    )
      return;
    renderBoard(gameController.computerPlayer);
    unbindControls();
    // display updates depending on hit or miss.
    setTimeout(() => {
      renderBoard(gameController.humanPlayer);
      bindControls();
      // display updates depending on hit or miss.
    }, 2000);
  }

  bindControls();
};

export default screenController;
