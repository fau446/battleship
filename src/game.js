import player from "./modules/player";

const game = () => {
  // setup human and computer players
  const humanPlayer = player();
  const computerPlayer = player();

  // function setupGame, allows the human player to place ships and automatically places computer ships.

  function playTurn(row, col) {
    if (humanPlayer.attack(row, col, computerPlayer) === false) return false;
    computerPlayer.randomAttack(humanPlayer);
    return true;
  }

  function gameOver() {
    if (humanPlayer.gBoard.checkAllShipsSunk) {
      return humanPlayer;
    }
    if (computerPlayer.gBoard.checkAllShipsSunk) {
      return computerPlayer;
    }
    return false;
  }

  /*
  1. Click on start game.
  2. Human player goes first, clicks on a cell on the enemy board to attack.
    screenController calls a function in game module to attack.
  3. Checks if it's a hit, updates the computer player's board UI through screenController.
  4. Computer Player attacks.
  5. Update Human Player board UI.
  6. Checks if the game is over
    if not, loop back to step 2.
    if over, display a message and stop player from clicking on board.
  */

  return {
    get humanPlayer() {
      return humanPlayer;
    },
    get computerPlayer() {
      return computerPlayer;
    },
    playTurn,
    gameOver,
  };
};

export default game;