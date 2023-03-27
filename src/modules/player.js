import gameboard from "./gameboard";

const player = () => {
  const gBoard = gameboard();

  function attack(row, col, enemy) {
    // if (validAttack(row, col, enemy) === false) return false;
    // return true;
    return enemy.gBoard.receiveAttack(row, col);
  }

  // For computer players only
  const validEnemyCells = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const cell = [];
      cell.push(i);
      cell.push(j);
      validEnemyCells.push(cell);
    }
  }

  function randomAttack(enemy) {
    const randomIndex = [Math.floor(Math.random() * validEnemyCells.length)];
    const randomCell = validEnemyCells[randomIndex];
    validEnemyCells.splice(randomIndex, 1);
    return attack(randomCell[0], randomCell[1], enemy);
  }

  return {
    get gBoard() {
      return gBoard;
    },
    attack,
    randomAttack,
  };
};

export default player;
