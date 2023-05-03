import player from "./modules/player";
import ship from "./modules/ship";

const game = () => {
  // setup human and computer players
  const humanPlayer = player();
  const computerPlayer = player();
  const carrier = ship(5, "Carrier");
  const battleship = ship(4, "Battleship");
  const destroyer = ship(3, "Destroyer");
  const submarine = ship(3, "Submarine");
  const patrolBoat = ship(2, "Patrol Boat");
  const playerShips = [carrier, battleship, destroyer, submarine, patrolBoat];
  let placementOrientation = "horizontal";

  function changePlacementOrientation() {
    placementOrientation =
      placementOrientation === "horizontal" ? "vertical" : "horizontal";
  }

  function placeShip(row, col) {
    if (
      humanPlayer.gBoard.placeShip(
        playerShips[0],
        row,
        col,
        placementOrientation
      ) === false
    )
      return false;

    playerShips.shift();
    return true;
  }

  function placeComputerShips() {
    const computerCarrier = ship(5, "Carrier");
    const computerBattleship = ship(4, "Battleship");
    const computerDestroyer = ship(3, "Destroyer");
    const computerSubmarine = ship(3, "Submarine");
    const computerPatrolBoat = ship(2, "Patrol Boat");
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
    if (gameOver()) return [humanAttackResult, null, "humanWin"];
    const computerAttackResult = computerPlayer.randomAttack(humanPlayer);
    if (gameOver())
      return [humanAttackResult, computerAttackResult, "computerWin"];
    return [humanAttackResult, computerAttackResult, false];
  }

  function gameOver() {
    if (
      humanPlayer.gBoard.checkAllShipsSunk() ||
      computerPlayer.gBoard.checkAllShipsSunk()
    ) {
      return true;
    }
    return false;
  }

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
    get placementOrientation() {
      return placementOrientation;
    },
    changePlacementOrientation,
    playTurn,
    gameOver,
    placeShip,
  };
};

export default game;
