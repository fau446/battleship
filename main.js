/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/player */ "./src/modules/player.js");
/* harmony import */ var _modules_ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/ship */ "./src/modules/ship.js");



const game = () => {
  // setup human and computer players
  const humanPlayer = (0,_modules_player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const computerPlayer = (0,_modules_player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const carrier = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(5, "Carrier");
  const battleship = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(4, "Battleship");
  const destroyer = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3, "Destroyer");
  const submarine = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3, "Submarine");
  const patrolBoat = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(2, "Patrol Boat");
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
    const computerCarrier = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(5, "Carrier");
    const computerBattleship = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(4, "Battleship");
    const computerDestroyer = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3, "Destroyer");
    const computerSubmarine = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3, "Submarine");
    const computerPatrolBoat = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(2, "Patrol Boat");
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);


/***/ }),

/***/ "./src/modules/gameboard.js":
/*!**********************************!*\
  !*** ./src/modules/gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
  const ships = [];

  function checkCoordinates(length, row, col, orientation) {
    let newRow = row;
    let newCol = col;
    if (orientation === "vertical") {
      newRow += length - 1;
      if (newRow < 0 || newRow > 9) return false;
      newRow = row;
      for (let i = 0; i < length; i++) {
        if (board[newRow][col].shipObj != null) return false;
        newRow += 1;
      }
    } else if (orientation === "horizontal") {
      newCol += length - 1;
      if (newCol < 0 || newCol > 9) return false;
      newCol = col;
      for (let i = 0; i < length; i++) {
        if (board[row][newCol].shipObj != null) return false;
        newCol += 1;
      }
    }

    return true;
  }

  function placeShip(ship, row, col, orientation) {
    if (checkCoordinates(ship.length, row, col, orientation) === false)
      return false;
    let newRow = row;
    let newCol = col;

    if (orientation === "vertical") {
      for (let i = 0; i < ship.length; i++) {
        board[newRow][col].shipObj = ship;
        newRow += 1;
      }
    } else if (orientation === "horizontal") {
      for (let i = 0; i < ship.length; i++) {
        board[row][newCol].shipObj = ship;
        newCol += 1;
      }
    }
    ships.push(ship);
    return true;
  }

  function receiveAttack(row, col) {
    if (row > 9 || row < 0 || col > 9 || col < 0) return false;

    if (board[row][col].isHit) return false;

    board[row][col].isHit = true;

    if (board[row][col].shipObj != null) {
      board[row][col].shipObj.hit();
      if (board[row][col].shipObj.sunk) return "sink";
      return "hit";
    }
    return "miss";
  }

  function checkAllShipsSunk() {
    if (ships.length === 0) return false;

    for (let i = 0; i < ships.length; i++) {
      if (ships[i].sunk === false) return false;
    }
    return true;
  }

  return {
    get board() {
      // should probably be private.
      return board;
    },
    checkCoordinates,
    placeShip,
    receiveAttack,
    checkAllShipsSunk,
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (gameboard);


/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameboard */ "./src/modules/gameboard.js");


const player = () => {
  const gBoard = (0,_gameboard__WEBPACK_IMPORTED_MODULE_0__["default"])();

  function attack(row, col, enemy) {
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
  //

  return {
    get gBoard() {
      return gBoard;
    },
    attack,
    randomAttack,
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (player);


/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const ship = (length, shipName = null) => {
  let timesHit = 0;
  let sunk = false;
  const name = shipName;

  function isSunk() {
    if (length <= timesHit) {
      sunk = true;
    }
  }

  function hit() {
    timesHit += 1;
    isSunk();
  }

  return {
    get length() {
      return length;
    },
    get timesHit() {
      return timesHit;
    },
    get sunk() {
      return sunk;
    },
    get name() {
      return name;
    },
    hit,
  };
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ship);


/***/ }),

/***/ "./src/screenController.js":
/*!*********************************!*\
  !*** ./src/screenController.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");


const screenController = () => {
  const gameController = (0,_game__WEBPACK_IMPORTED_MODULE_0__["default"])();

  /*
  const thing = document.querySelector(".thing");
  const toggle = document.querySelector(".toggle");
  toggle.addEventListener("click", () => {
    thing.classList.toggle("test");
  }); */

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

  // add a message when a ship is sunk
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

    // enemy board hidden by default. Rotate shown by default.
    // If false, update display
    // gameboard checkCoordinates function is flawed.
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (screenController);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _screenController__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./screenController */ "./src/screenController.js");


(0,_screenController__WEBPACK_IMPORTED_MODULE_0__["default"])();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsWUFBWSxNQUFNO0FBQ2xCLFlBQVksTUFBTTs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5REFBeUQsbUJBQW1CO0FBQzVFOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQsbUNBQW1DO0FBQzFGOztBQUVBLGlFQUFlLGdCQUFnQixFQUFDOzs7Ozs7O1VDeE9oQztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtEOztBQUVsRCw2REFBZ0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyZWVuQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGxheWVyIGZyb20gXCIuL21vZHVsZXMvcGxheWVyXCI7XG5pbXBvcnQgc2hpcCBmcm9tIFwiLi9tb2R1bGVzL3NoaXBcIjtcblxuY29uc3QgZ2FtZSA9ICgpID0+IHtcbiAgLy8gc2V0dXAgaHVtYW4gYW5kIGNvbXB1dGVyIHBsYXllcnNcbiAgY29uc3QgaHVtYW5QbGF5ZXIgPSBwbGF5ZXIoKTtcbiAgY29uc3QgY29tcHV0ZXJQbGF5ZXIgPSBwbGF5ZXIoKTtcbiAgY29uc3QgY2FycmllciA9IHNoaXAoNSwgXCJDYXJyaWVyXCIpO1xuICBjb25zdCBiYXR0bGVzaGlwID0gc2hpcCg0LCBcIkJhdHRsZXNoaXBcIik7XG4gIGNvbnN0IGRlc3Ryb3llciA9IHNoaXAoMywgXCJEZXN0cm95ZXJcIik7XG4gIGNvbnN0IHN1Ym1hcmluZSA9IHNoaXAoMywgXCJTdWJtYXJpbmVcIik7XG4gIGNvbnN0IHBhdHJvbEJvYXQgPSBzaGlwKDIsIFwiUGF0cm9sIEJvYXRcIik7XG4gIGNvbnN0IHBsYXllclNoaXBzID0gW2NhcnJpZXIsIGJhdHRsZXNoaXAsIGRlc3Ryb3llciwgc3VibWFyaW5lLCBwYXRyb2xCb2F0XTtcbiAgbGV0IHBsYWNlbWVudE9yaWVudGF0aW9uID0gXCJob3Jpem9udGFsXCI7XG5cbiAgZnVuY3Rpb24gY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24oKSB7XG4gICAgcGxhY2VtZW50T3JpZW50YXRpb24gPVxuICAgICAgcGxhY2VtZW50T3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXAocm93LCBjb2wpIHtcbiAgICBpZiAoXG4gICAgICBodW1hblBsYXllci5nQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICBwbGF5ZXJTaGlwc1swXSxcbiAgICAgICAgcm93LFxuICAgICAgICBjb2wsXG4gICAgICAgIHBsYWNlbWVudE9yaWVudGF0aW9uXG4gICAgICApID09PSBmYWxzZVxuICAgIClcbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIHBsYXllclNoaXBzLnNoaWZ0KCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZUNvbXB1dGVyU2hpcHMoKSB7XG4gICAgY29uc3QgY29tcHV0ZXJDYXJyaWVyID0gc2hpcCg1LCBcIkNhcnJpZXJcIik7XG4gICAgY29uc3QgY29tcHV0ZXJCYXR0bGVzaGlwID0gc2hpcCg0LCBcIkJhdHRsZXNoaXBcIik7XG4gICAgY29uc3QgY29tcHV0ZXJEZXN0cm95ZXIgPSBzaGlwKDMsIFwiRGVzdHJveWVyXCIpO1xuICAgIGNvbnN0IGNvbXB1dGVyU3VibWFyaW5lID0gc2hpcCgzLCBcIlN1Ym1hcmluZVwiKTtcbiAgICBjb25zdCBjb21wdXRlclBhdHJvbEJvYXQgPSBzaGlwKDIsIFwiUGF0cm9sIEJvYXRcIik7XG4gICAgY29uc3QgY29tcHV0ZXJCb2F0cyA9IFtcbiAgICAgIGNvbXB1dGVyQ2FycmllcixcbiAgICAgIGNvbXB1dGVyQmF0dGxlc2hpcCxcbiAgICAgIGNvbXB1dGVyRGVzdHJveWVyLFxuICAgICAgY29tcHV0ZXJTdWJtYXJpbmUsXG4gICAgICBjb21wdXRlclBhdHJvbEJvYXQsXG4gICAgXTtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IFtcImhvcml6b250YWxcIiwgXCJ2ZXJ0aWNhbFwiXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29tcHV0ZXJCb2F0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYm9hdCA9IGNvbXB1dGVyQm9hdHNbaV07XG4gICAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xuICAgICAgaWYgKFxuICAgICAgICBjb21wdXRlclBsYXllci5nQm9hcmQucGxhY2VTaGlwKFxuICAgICAgICAgIGJvYXQsXG4gICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICAgICAgICBvcmllbnRhdGlvbltyYW5kb21JbmRleF1cbiAgICAgICAgKSA9PT0gZmFsc2VcbiAgICAgIClcbiAgICAgICAgaS0tO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYXlUdXJuKHJvdywgY29sKSB7XG4gICAgY29uc3QgaHVtYW5BdHRhY2tSZXN1bHQgPSBodW1hblBsYXllci5hdHRhY2socm93LCBjb2wsIGNvbXB1dGVyUGxheWVyKTtcbiAgICBpZiAoaHVtYW5BdHRhY2tSZXN1bHQgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGdhbWVPdmVyKCkpIHJldHVybiBbaHVtYW5BdHRhY2tSZXN1bHQsIG51bGwsIFwiaHVtYW5XaW5cIl07XG4gICAgY29uc3QgY29tcHV0ZXJBdHRhY2tSZXN1bHQgPSBjb21wdXRlclBsYXllci5yYW5kb21BdHRhY2soaHVtYW5QbGF5ZXIpO1xuICAgIGlmIChnYW1lT3ZlcigpKVxuICAgICAgcmV0dXJuIFtodW1hbkF0dGFja1Jlc3VsdCwgY29tcHV0ZXJBdHRhY2tSZXN1bHQsIFwiY29tcHV0ZXJXaW5cIl07XG4gICAgcmV0dXJuIFtodW1hbkF0dGFja1Jlc3VsdCwgY29tcHV0ZXJBdHRhY2tSZXN1bHQsIGZhbHNlXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdhbWVPdmVyKCkge1xuICAgIGlmIChcbiAgICAgIGh1bWFuUGxheWVyLmdCb2FyZC5jaGVja0FsbFNoaXBzU3VuaygpIHx8XG4gICAgICBjb21wdXRlclBsYXllci5nQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmsoKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHBsYWNlQ29tcHV0ZXJTaGlwcygpO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IGh1bWFuUGxheWVyKCkge1xuICAgICAgcmV0dXJuIGh1bWFuUGxheWVyO1xuICAgIH0sXG4gICAgZ2V0IGNvbXB1dGVyUGxheWVyKCkge1xuICAgICAgcmV0dXJuIGNvbXB1dGVyUGxheWVyO1xuICAgIH0sXG4gICAgZ2V0IHBsYXllclNoaXBzKCkge1xuICAgICAgcmV0dXJuIHBsYXllclNoaXBzO1xuICAgIH0sXG4gICAgZ2V0IHBsYWNlbWVudE9yaWVudGF0aW9uKCkge1xuICAgICAgcmV0dXJuIHBsYWNlbWVudE9yaWVudGF0aW9uO1xuICAgIH0sXG4gICAgY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24sXG4gICAgcGxheVR1cm4sXG4gICAgZ2FtZU92ZXIsXG4gICAgcGxhY2VTaGlwLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImNvbnN0IGdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgY29uc3Qgcm93ID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjZWxsID0geyBpc0hpdDogZmFsc2UsIHNoaXBPYmo6IG51bGwgfTtcbiAgICAgIHJvdy5wdXNoKGNlbGwpO1xuICAgIH1cbiAgICBib2FyZC5wdXNoKHJvdyk7XG4gIH1cbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBmdW5jdGlvbiBjaGVja0Nvb3JkaW5hdGVzKGxlbmd0aCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IG5ld1JvdyA9IHJvdztcbiAgICBsZXQgbmV3Q29sID0gY29sO1xuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBuZXdSb3cgKz0gbGVuZ3RoIC0gMTtcbiAgICAgIGlmIChuZXdSb3cgPCAwIHx8IG5ld1JvdyA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgIG5ld1JvdyA9IHJvdztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW25ld1Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbmV3Um93ICs9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIG5ld0NvbCArPSBsZW5ndGggLSAxO1xuICAgICAgaWYgKG5ld0NvbCA8IDAgfHwgbmV3Q29sID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgbmV3Q29sID0gY29sO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYm9hcmRbcm93XVtuZXdDb2xdLnNoaXBPYmogIT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBuZXdDb2wgKz0gMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwLCByb3csIGNvbCwgb3JpZW50YXRpb24pIHtcbiAgICBpZiAoY2hlY2tDb29yZGluYXRlcyhzaGlwLmxlbmd0aCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSA9PT0gZmFsc2UpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgbGV0IG5ld1JvdyA9IHJvdztcbiAgICBsZXQgbmV3Q29sID0gY29sO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZFtuZXdSb3ddW2NvbF0uc2hpcE9iaiA9IHNoaXA7XG4gICAgICAgIG5ld1JvdyArPSAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm9hcmRbcm93XVtuZXdDb2xdLnNoaXBPYmogPSBzaGlwO1xuICAgICAgICBuZXdDb2wgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICBpZiAocm93ID4gOSB8fCByb3cgPCAwIHx8IGNvbCA+IDkgfHwgY29sIDwgMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXS5pc0hpdCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgYm9hcmRbcm93XVtjb2xdLmlzSGl0ID0gdHJ1ZTtcblxuICAgIGlmIChib2FyZFtyb3ddW2NvbF0uc2hpcE9iaiAhPSBudWxsKSB7XG4gICAgICBib2FyZFtyb3ddW2NvbF0uc2hpcE9iai5oaXQoKTtcbiAgICAgIGlmIChib2FyZFtyb3ddW2NvbF0uc2hpcE9iai5zdW5rKSByZXR1cm4gXCJzaW5rXCI7XG4gICAgICByZXR1cm4gXCJoaXRcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwibWlzc1wiO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tBbGxTaGlwc1N1bmsoKSB7XG4gICAgaWYgKHNoaXBzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNoaXBzW2ldLnN1bmsgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgYm9hcmQoKSB7XG4gICAgICAvLyBzaG91bGQgcHJvYmFibHkgYmUgcHJpdmF0ZS5cbiAgICAgIHJldHVybiBib2FyZDtcbiAgICB9LFxuICAgIGNoZWNrQ29vcmRpbmF0ZXMsXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgY2hlY2tBbGxTaGlwc1N1bmssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lYm9hcmQ7XG4iLCJpbXBvcnQgZ2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5jb25zdCBwbGF5ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGdCb2FyZCA9IGdhbWVib2FyZCgpO1xuXG4gIGZ1bmN0aW9uIGF0dGFjayhyb3csIGNvbCwgZW5lbXkpIHtcbiAgICByZXR1cm4gZW5lbXkuZ0JvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuICB9XG5cbiAgLy8gRm9yIGNvbXB1dGVyIHBsYXllcnMgb25seVxuICBjb25zdCB2YWxpZEVuZW15Q2VsbHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjZWxsID0gW107XG4gICAgICBjZWxsLnB1c2goaSk7XG4gICAgICBjZWxsLnB1c2goaik7XG4gICAgICB2YWxpZEVuZW15Q2VsbHMucHVzaChjZWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21BdHRhY2soZW5lbXkpIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZEVuZW15Q2VsbHMubGVuZ3RoKV07XG4gICAgY29uc3QgcmFuZG9tQ2VsbCA9IHZhbGlkRW5lbXlDZWxsc1tyYW5kb21JbmRleF07XG4gICAgdmFsaWRFbmVteUNlbGxzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gICAgcmV0dXJuIGF0dGFjayhyYW5kb21DZWxsWzBdLCByYW5kb21DZWxsWzFdLCBlbmVteSk7XG4gIH1cbiAgLy9cblxuICByZXR1cm4ge1xuICAgIGdldCBnQm9hcmQoKSB7XG4gICAgICByZXR1cm4gZ0JvYXJkO1xuICAgIH0sXG4gICAgYXR0YWNrLFxuICAgIHJhbmRvbUF0dGFjayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXllcjtcbiIsImNvbnN0IHNoaXAgPSAobGVuZ3RoLCBzaGlwTmFtZSA9IG51bGwpID0+IHtcbiAgbGV0IHRpbWVzSGl0ID0gMDtcbiAgbGV0IHN1bmsgPSBmYWxzZTtcbiAgY29uc3QgbmFtZSA9IHNoaXBOYW1lO1xuXG4gIGZ1bmN0aW9uIGlzU3VuaygpIHtcbiAgICBpZiAobGVuZ3RoIDw9IHRpbWVzSGl0KSB7XG4gICAgICBzdW5rID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgdGltZXNIaXQgKz0gMTtcbiAgICBpc1N1bmsoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfSxcbiAgICBnZXQgdGltZXNIaXQoKSB7XG4gICAgICByZXR1cm4gdGltZXNIaXQ7XG4gICAgfSxcbiAgICBnZXQgc3VuaygpIHtcbiAgICAgIHJldHVybiBzdW5rO1xuICAgIH0sXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9LFxuICAgIGhpdCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNoaXA7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5cbmNvbnN0IHNjcmVlbkNvbnRyb2xsZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVDb250cm9sbGVyID0gZ2FtZSgpO1xuXG4gIC8qXG4gIGNvbnN0IHRoaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50aGluZ1wiKTtcbiAgY29uc3QgdG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2dnbGVcIik7XG4gIHRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHRoaW5nLmNsYXNzTGlzdC50b2dnbGUoXCJ0ZXN0XCIpO1xuICB9KTsgKi9cblxuICAvLyBDYWNoZSBET01cbiAgY29uc3QgYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib2FyZFwiKTtcbiAgY29uc3QgZnJpZW5kbHlDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZnJpZW5kbHlcIik7XG4gIGNvbnN0IGVuZW15Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVuZW15XCIpO1xuICBjb25zdCBkaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXNwbGF5XCIpO1xuICBjb25zdCByb3RhdGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZVwiKTtcbiAgcm90YXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaGFuZ2VQbGFjZW1lbnRPcmllbnRhdGlvbik7XG5cbiAgZnJpZW5kbHlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIG1vdXNlb3Zlckdob3N0U2hpcCk7XG4gIH0pO1xuICBmcmllbmRseUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBtb3VzZW91dEdob3N0U2hpcCk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIG1vdXNlb3Zlckdob3N0U2hpcCgpIHtcbiAgICBsZXQgcm93ID0gTnVtYmVyKHRoaXMucGFyZW50RWxlbWVudC5kYXRhc2V0LnJvdyk7XG4gICAgbGV0IGNvbCA9IE51bWJlcih0aGlzLmRhdGFzZXQuY29sKTtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gZ2FtZUNvbnRyb2xsZXIucGxheWVyU2hpcHNbMF0ubGVuZ3RoO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZ2FtZUNvbnRyb2xsZXIucGxhY2VtZW50T3JpZW50YXRpb247XG5cbiAgICBpZiAoXG4gICAgICBnYW1lQ29udHJvbGxlci5odW1hblBsYXllci5nQm9hcmQuY2hlY2tDb29yZGluYXRlcyhcbiAgICAgICAgc2hpcExlbmd0aCxcbiAgICAgICAgcm93LFxuICAgICAgICBjb2wsXG4gICAgICAgIG9yaWVudGF0aW9uXG4gICAgICApID09PSBmYWxzZVxuICAgIClcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkc1swXS5jaGlsZHJlbltyb3ddLmNoaWxkcmVuW2NvbF0uY2xhc3NMaXN0LmFkZChcImhvdmVyXCIpO1xuICAgICAgICBjb2wrKztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkc1swXS5jaGlsZHJlbltyb3ddLmNoaWxkcmVuW2NvbF0uY2xhc3NMaXN0LmFkZChcImhvdmVyXCIpO1xuICAgICAgICByb3crKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtb3VzZW91dEdob3N0U2hpcCgpIHtcbiAgICBsZXQgcm93ID0gTnVtYmVyKHRoaXMucGFyZW50RWxlbWVudC5kYXRhc2V0LnJvdyk7XG4gICAgbGV0IGNvbCA9IE51bWJlcih0aGlzLmRhdGFzZXQuY29sKTtcbiAgICBjb25zdCBzaGlwTGVuZ3RoID0gZ2FtZUNvbnRyb2xsZXIucGxheWVyU2hpcHNbMF0ubGVuZ3RoO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gZ2FtZUNvbnRyb2xsZXIucGxhY2VtZW50T3JpZW50YXRpb247XG5cbiAgICBpZiAoXG4gICAgICBnYW1lQ29udHJvbGxlci5odW1hblBsYXllci5nQm9hcmQuY2hlY2tDb29yZGluYXRlcyhcbiAgICAgICAgc2hpcExlbmd0aCxcbiAgICAgICAgcm93LFxuICAgICAgICBjb2wsXG4gICAgICAgIG9yaWVudGF0aW9uXG4gICAgICApID09PSBmYWxzZVxuICAgIClcbiAgICAgIHJldHVybjtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkc1swXS5jaGlsZHJlbltyb3ddLmNoaWxkcmVuW2NvbF0uY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyXCIpO1xuICAgICAgICBjb2wrKztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcExlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkc1swXS5jaGlsZHJlbltyb3ddLmNoaWxkcmVuW2NvbF0uY2xhc3NMaXN0LnJlbW92ZShcImhvdmVyXCIpO1xuICAgICAgICByb3crKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjaGFuZ2VQbGFjZW1lbnRPcmllbnRhdGlvbigpIHtcbiAgICBnYW1lQ29udHJvbGxlci5jaGFuZ2VQbGFjZW1lbnRPcmllbnRhdGlvbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gZW1wdHlDZWxsSGl0KGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2NjdXBpZWRDZWxsSGl0KGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5ZXJTaGlwQ2VsbChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwicGxheWVyLXNoaXBcIik7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJCb2FyZChwbGF5ZXIpIHtcbiAgICBsZXQgYm9hcmROdW1iZXIgPSAwO1xuICAgIGlmIChwbGF5ZXIgPT09IGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyKSBib2FyZE51bWJlciA9IDE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAvLyBpZiBib2FyZE51bWJlciA9PT0gMCwgc2V0IHBsYXllciBzaGlwcyB0byBibHVlXG4gICAgICAgIGlmIChib2FyZE51bWJlciA9PT0gMCAmJiBwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLnNoaXBPYmogIT0gbnVsbCkge1xuICAgICAgICAgIHBsYXllclNoaXBDZWxsKGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgcGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5pc0hpdCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgIHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uc2hpcE9iaiAhPSBudWxsXG4gICAgICAgICkge1xuICAgICAgICAgIG9jY3VwaWVkQ2VsbEhpdChib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0pO1xuICAgICAgICAgIGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXS5jbGFzc0xpc3QucmVtb3ZlKFxuICAgICAgICAgICAgXCJwbGF5ZXItc2hpcFwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLmlzSGl0ID09PSB0cnVlKSB7XG4gICAgICAgICAgZW1wdHlDZWxsSGl0KGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kUGxhY2VTaGlwQ29udHJvbHMoKSB7XG4gICAgZnJpZW5kbHlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGFjZVBsYXllclNoaXApO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5iaW5kUGxhY2VTaGlwQ29udHJvbHMoKSB7XG4gICAgZnJpZW5kbHlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGFjZVBsYXllclNoaXApO1xuICAgICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIsIG1vdXNlb3Zlckdob3N0U2hpcCk7XG4gICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBtb3VzZW91dEdob3N0U2hpcCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1bmJpbmRDb250cm9scygpIHtcbiAgICBlbmVteUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGF0dGFja0NlbGwpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYmluZENvbnRyb2xzKCkge1xuICAgIGVuZW15Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXR0YWNrQ2VsbCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBhZGQgYSBtZXNzYWdlIHdoZW4gYSBzaGlwIGlzIHN1bmtcbiAgZnVuY3Rpb24gdXBkYXRlRGlzcGxheShwbGF5ZXIsIHJlc3VsdCkge1xuICAgIGlmIChyZXN1bHQgPT09IFwiaHVtYW5XaW5cIilcbiAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJBbGwgeW91ciBvcHBvbmVudCdzIHNoaXBzIGhhdmUgYmVlbiBzdW5rISBZb3Ugd2luIVwiO1xuICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJjb21wdXRlcldpblwiKVxuICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIkFsbCB5b3VyIHNoaXAncyBoYXZlIGJlZW4gc3VuayEgWW91IGxvc2UhXCI7XG5cbiAgICBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5odW1hblBsYXllcikge1xuICAgICAgaWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3UgbWlzc2VkIVwiO1xuICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSBcImhpdFwiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91IGhpdCBhIHNoaXAhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwic2lua1wiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91IHN1bmsgYSBzaGlwIVwiO1xuICAgIH0gZWxzZSBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcikge1xuICAgICAgaWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IG1pc3NlZCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJoaXRcIilcbiAgICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdXIgb3Bwb25lbnQgaGl0IGEgc2hpcCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJzaW5rXCIpXG4gICAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IHN1bmsgYSBzaGlwIVwiO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFja0NlbGwoKSB7XG4gICAgY29uc3QgcGxheVR1cm5SZXN1bHQgPSBnYW1lQ29udHJvbGxlci5wbGF5VHVybihcbiAgICAgIE51bWJlcih0aGlzLnBhcmVudEVsZW1lbnQuZGF0YXNldC5yb3cpLFxuICAgICAgTnVtYmVyKHRoaXMuZGF0YXNldC5jb2wpXG4gICAgKTtcbiAgICBpZiAocGxheVR1cm5SZXN1bHQgPT09IGZhbHNlKSByZXR1cm47XG4gICAgcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIpO1xuICAgIHVuYmluZENvbnRyb2xzKCk7XG4gICAgaWYgKHBsYXlUdXJuUmVzdWx0WzJdID09PSBcImh1bWFuV2luXCIpIHtcbiAgICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzJdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5odW1hblBsYXllciwgcGxheVR1cm5SZXN1bHRbMF0pO1xuXG4gICAgLy8gc2V0IGEgZGVsYXkgYmVmb3JlIHRoZSBjb21wdXRlcidzIGFjdGlvbiBpcyBkaXNwbGF5ZWQuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZW5kZXJCb2FyZChnYW1lQ29udHJvbGxlci5odW1hblBsYXllcik7XG4gICAgICBpZiAocGxheVR1cm5SZXN1bHRbMl0gPT09IFwiY29tcHV0ZXJXaW5cIikge1xuICAgICAgICB1cGRhdGVEaXNwbGF5KGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyLCBwbGF5VHVyblJlc3VsdFsyXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGJpbmRDb250cm9scygpO1xuICAgICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllciwgcGxheVR1cm5SZXN1bHRbMV0pO1xuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VQbGF5ZXJTaGlwKCkge1xuICAgIGNvbnN0IHsgcm93IH0gPSB0aGlzLnBhcmVudEVsZW1lbnQuZGF0YXNldDtcbiAgICBjb25zdCB7IGNvbCB9ID0gdGhpcy5kYXRhc2V0O1xuXG4gICAgLy8gZW5lbXkgYm9hcmQgaGlkZGVuIGJ5IGRlZmF1bHQuIFJvdGF0ZSBzaG93biBieSBkZWZhdWx0LlxuICAgIC8vIElmIGZhbHNlLCB1cGRhdGUgZGlzcGxheVxuICAgIC8vIGdhbWVib2FyZCBjaGVja0Nvb3JkaW5hdGVzIGZ1bmN0aW9uIGlzIGZsYXdlZC5cbiAgICBpZiAoZ2FtZUNvbnRyb2xsZXIucGxhY2VTaGlwKE51bWJlcihyb3cpLCBOdW1iZXIoY29sKSkgPT09IGZhbHNlKSB7XG4gICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiSW52YWxpZCBwbGFjZW1lbnQsIHBsZWFzZSB0cnkgYWdhaW4hXCI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIpO1xuXG4gICAgY29uc3Qgc2hpcHNBcnJheSA9IGdhbWVDb250cm9sbGVyLnBsYXllclNoaXBzO1xuXG4gICAgLy8gSWYgdHJ1ZSwgdXBkYXRlIGRpc3BsYXlcbiAgICBpZiAoc2hpcHNBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgIHVuYmluZFBsYWNlU2hpcENvbnRyb2xzKCk7XG4gICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiQ2xpY2sgb24gYW4gZW5lbXkgdGlsZSB0byBhdHRhY2shXCI7XG4gICAgICByb3RhdGVCdXR0b24uY2xhc3NMaXN0LmFkZChcImhpZGVcIik7XG4gICAgICBib2FyZHNbMV0uY2xhc3NMaXN0LnRvZ2dsZShcImhpZGVcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGlzcGxheS5pbm5lclRleHQgPSBgQ2xpY2sgb24gYSB0aWxlIHRvIHBsYWNlIHlvdXIgJHtzaGlwc0FycmF5WzBdLm5hbWV9LmA7XG4gIH1cblxuICBiaW5kQ29udHJvbHMoKTtcbiAgYmluZFBsYWNlU2hpcENvbnRyb2xzKCk7XG4gIGRpc3BsYXkuaW5uZXJUZXh0ID0gYENsaWNrIG9uIGEgdGlsZSB0byBwbGFjZSB5b3VyICR7Z2FtZUNvbnRyb2xsZXIucGxheWVyU2hpcHNbMF0ubmFtZX0uYDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNjcmVlbkNvbnRyb2xsZXI7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBzY3JlZW5Db250cm9sbGVyIGZyb20gXCIuL3NjcmVlbkNvbnRyb2xsZXJcIjtcblxuc2NyZWVuQ29udHJvbGxlcigpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9