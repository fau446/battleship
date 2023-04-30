import player from "./modules/player";
import ship from "./modules/ship";

const game = () => {
  // setup human and computer players
  const humanPlayer = player();
  const computerPlayer = player();
  const carrier = ship(5);
  const battleship = ship(4);
  const destroyer = ship(3);
  const submarine = ship(3);
  const patrolBoat = ship(2);
  const playerShips = [carrier, battleship, destroyer, submarine, patrolBoat];

  function placeShip(row, col, orientation) {
    if (
      humanPlayer.gBoard.placeShip(playerShips[0], row, col, orientation) ===
      false
    )
      return false;

    playerShips.shift();
    return true;
  }

  function placeComputerShips() {
    const computerCarrier = ship(5);
    const computerBattleship = ship(4);
    const computerDestroyer = ship(3);
    const computerSubmarine = ship(3);
    const computerPatrolBoat = ship(2);
    const computerBoats = [
      computerCarrier,
      computerBattleship,
      computerDestroyer,
      computerSubmarine,
      computerPatrolBoat,
    ];
    const orientation = ["horizontal", "vertical"];

    for (let i = 0; i < computerBoats.length; i++) {
      const boat = computerBoats[i];
      const randomIndex = Math.floor(Math.random() * 2);
      if (
        computerPlayer.gBoard.placeShip(
          boat,
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientation[randomIndex]
        ) === false
      )
        i--;
    }
  }

  function playTurn(row, col) {
    const humanAttackResult = humanPlayer.attack(row, col, computerPlayer);
    if (humanAttackResult === false) return false;
    // if (gameOver()) return [humanAttackResult, null, "humanWin"];
    const computerAttackResult = computerPlayer.randomAttack(humanPlayer);
    // if (gameOver())
    // return [humanAttackResult, computerAttackResult, "computerWin"];
    return [humanAttackResult, computerAttackResult, false];
  }

  function gameOver() {
    if (
      humanPlayer.gBoard.checkAllShipsSunk ||
      computerPlayer.gBoard.checkAllShipsSunk
    ) {
      return true;
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

  placeComputerShips();

  return {
    get humanPlayer() {
      return humanPlayer;
    },
    get computerPlayer() {
      return computerPlayer;
    },
    get playerShips() {
      return playerShips;
    },
    playTurn,
    gameOver,
    placeShip,
  };
};

export default game;
