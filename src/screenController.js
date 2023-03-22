import game from "./game";

const screenController = () => {
  const gameController = game();

  // Cache DOM
  const enemyCells = document.querySelectorAll(".enemy");

  function attackCell() {
    return gameController.playTurn(
      this.parentElement.dataset.row,
      this.dataset.col
    );
  }

  enemyCells.forEach((cell) => {
    cell.addEventListener("click", attackCell);
  });
};

export default screenController;
