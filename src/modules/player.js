import gameboard from "./gameboard";

const player = () => {
  const gBoard = gameboard();

  function validAttack(row, col, enemy) {
    return enemy.gBoard.receiveAttack(row, col);
  }

  function attack(row, col, enemy) {
    if (validAttack(row, col, enemy) === false) return false;
    return true;
  }

  return {
    get gBoard() {
      return gBoard;
    },
    attack,
  };
};

export default player;
