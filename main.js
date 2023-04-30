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
  const carrier = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(5);
  const battleship = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(4);
  const destroyer = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3);
  const submarine = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3);
  const patrolBoat = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(2);
  const playerShips = [carrier, battleship, destroyer, submarine, patrolBoat];

  // function setupGame, allows the human player to place ships and automatically places computer ships.
  // Player should see their own ships as blue cells.

  // setupGame

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
    const computerCarrier = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(5);
    const computerBattleship = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(4);
    const computerDestroyer = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3);
    const computerSubmarine = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3);
    const computerPatrolBoat = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(2);
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
    console.log(length);
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
const ship = (length) => {
  let timesHit = 0;
  let sunk = false;

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
  const friendlyCells = document.querySelectorAll(".friendly");
  const enemyCells = document.querySelectorAll(".enemy");
  const display = document.querySelector(".display");

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

    const boards = document.querySelectorAll(".board");
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
      this.parentElement.dataset.row,
      this.dataset.col
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
    }, 2000);
  }

  function placePlayerShip() {
    const { row } = this.parentElement.dataset;
    const { col } = this.dataset;

    // enemy board hidden by default. Rotate shown by default.
    // If false, update display
    // gameboard checkCoordinates function is flawed.
    if (
      gameController.placeShip(Number(row), Number(col), "horizontal") === false
    ) {
      display.innerText = "Invalid placement, please try again!";
      return;
    }
    const shipsArray = gameController.playerShips;

    display.innerText = "Good";

    // If true, update display
    if (shipsArray.length === 0) {
      unbindPlaceShipControls();
      // display enemy board.
    }

    renderBoard(gameController.humanPlayer);
  }

  /* placing player ships
  Allow the player to choose random placement if desired.

  Create ships and put them into array.
  Placing ships:
    1. Display tells player to place the ship (name and length).
      If invalid placement, update display, ship is not placed.
    2. Once ship has been placed, renderBoard.

  Unhide enemy board and hide rotate button.

  Start the game once all player ships have been placed.
  */

  bindControls();
  bindPlaceShipControls();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGdCQUFnQixFQUFDOzs7Ozs7O1VDMUtoQztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtEOztBQUVsRCw2REFBZ0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyZWVuQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGxheWVyIGZyb20gXCIuL21vZHVsZXMvcGxheWVyXCI7XG5pbXBvcnQgc2hpcCBmcm9tIFwiLi9tb2R1bGVzL3NoaXBcIjtcblxuY29uc3QgZ2FtZSA9ICgpID0+IHtcbiAgLy8gc2V0dXAgaHVtYW4gYW5kIGNvbXB1dGVyIHBsYXllcnNcbiAgY29uc3QgaHVtYW5QbGF5ZXIgPSBwbGF5ZXIoKTtcbiAgY29uc3QgY29tcHV0ZXJQbGF5ZXIgPSBwbGF5ZXIoKTtcbiAgY29uc3QgY2FycmllciA9IHNoaXAoNSk7XG4gIGNvbnN0IGJhdHRsZXNoaXAgPSBzaGlwKDQpO1xuICBjb25zdCBkZXN0cm95ZXIgPSBzaGlwKDMpO1xuICBjb25zdCBzdWJtYXJpbmUgPSBzaGlwKDMpO1xuICBjb25zdCBwYXRyb2xCb2F0ID0gc2hpcCgyKTtcbiAgY29uc3QgcGxheWVyU2hpcHMgPSBbY2FycmllciwgYmF0dGxlc2hpcCwgZGVzdHJveWVyLCBzdWJtYXJpbmUsIHBhdHJvbEJvYXRdO1xuXG4gIC8vIGZ1bmN0aW9uIHNldHVwR2FtZSwgYWxsb3dzIHRoZSBodW1hbiBwbGF5ZXIgdG8gcGxhY2Ugc2hpcHMgYW5kIGF1dG9tYXRpY2FsbHkgcGxhY2VzIGNvbXB1dGVyIHNoaXBzLlxuICAvLyBQbGF5ZXIgc2hvdWxkIHNlZSB0aGVpciBvd24gc2hpcHMgYXMgYmx1ZSBjZWxscy5cblxuICAvLyBzZXR1cEdhbWVcblxuICBmdW5jdGlvbiBwbGFjZVNoaXAocm93LCBjb2wsIG9yaWVudGF0aW9uKSB7XG4gICAgaWYgKFxuICAgICAgaHVtYW5QbGF5ZXIuZ0JvYXJkLnBsYWNlU2hpcChwbGF5ZXJTaGlwc1swXSwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSA9PT1cbiAgICAgIGZhbHNlXG4gICAgKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcGxheWVyU2hpcHMuc2hpZnQoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJTaGlwcygpIHtcbiAgICBjb25zdCBjb21wdXRlckNhcnJpZXIgPSBzaGlwKDUpO1xuICAgIGNvbnN0IGNvbXB1dGVyQmF0dGxlc2hpcCA9IHNoaXAoNCk7XG4gICAgY29uc3QgY29tcHV0ZXJEZXN0cm95ZXIgPSBzaGlwKDMpO1xuICAgIGNvbnN0IGNvbXB1dGVyU3VibWFyaW5lID0gc2hpcCgzKTtcbiAgICBjb25zdCBjb21wdXRlclBhdHJvbEJvYXQgPSBzaGlwKDIpO1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hdHMgPSBbXG4gICAgICBjb21wdXRlckNhcnJpZXIsXG4gICAgICBjb21wdXRlckJhdHRsZXNoaXAsXG4gICAgICBjb21wdXRlckRlc3Ryb3llcixcbiAgICAgIGNvbXB1dGVyU3VibWFyaW5lLFxuICAgICAgY29tcHV0ZXJQYXRyb2xCb2F0LFxuICAgIF07XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBbXCJob3Jpem9udGFsXCIsIFwidmVydGljYWxcIl07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXB1dGVyQm9hdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJvYXQgPSBjb21wdXRlckJvYXRzW2ldO1xuICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcHV0ZXJQbGF5ZXIuZ0JvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICBib2F0LFxuICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gICAgICAgICAgb3JpZW50YXRpb25bcmFuZG9tSW5kZXhdXG4gICAgICAgICkgPT09IGZhbHNlXG4gICAgICApXG4gICAgICAgIGktLTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5VHVybihyb3csIGNvbCkge1xuICAgIGNvbnN0IGh1bWFuQXR0YWNrUmVzdWx0ID0gaHVtYW5QbGF5ZXIuYXR0YWNrKHJvdywgY29sLCBjb21wdXRlclBsYXllcik7XG4gICAgaWYgKGh1bWFuQXR0YWNrUmVzdWx0ID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGlmIChnYW1lT3ZlcigpKSByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBudWxsLCBcImh1bWFuV2luXCJdO1xuICAgIGNvbnN0IGNvbXB1dGVyQXR0YWNrUmVzdWx0ID0gY29tcHV0ZXJQbGF5ZXIucmFuZG9tQXR0YWNrKGh1bWFuUGxheWVyKTtcbiAgICAvLyBpZiAoZ2FtZU92ZXIoKSlcbiAgICAvLyByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgXCJjb21wdXRlcldpblwiXTtcbiAgICByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgZmFsc2VdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgaWYgKFxuICAgICAgaHVtYW5QbGF5ZXIuZ0JvYXJkLmNoZWNrQWxsU2hpcHNTdW5rIHx8XG4gICAgICBjb21wdXRlclBsYXllci5nQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmtcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKlxuICAxLiBDbGljayBvbiBzdGFydCBnYW1lLlxuICAyLiBIdW1hbiBwbGF5ZXIgZ29lcyBmaXJzdCwgY2xpY2tzIG9uIGEgY2VsbCBvbiB0aGUgZW5lbXkgYm9hcmQgdG8gYXR0YWNrLlxuICAgIHNjcmVlbkNvbnRyb2xsZXIgY2FsbHMgYSBmdW5jdGlvbiBpbiBnYW1lIG1vZHVsZSB0byBhdHRhY2suXG4gIDMuIENoZWNrcyBpZiBpdCdzIGEgaGl0LCB1cGRhdGVzIHRoZSBjb21wdXRlciBwbGF5ZXIncyBib2FyZCBVSSB0aHJvdWdoIHNjcmVlbkNvbnRyb2xsZXIuXG4gIDQuIENvbXB1dGVyIFBsYXllciBhdHRhY2tzLlxuICA1LiBVcGRhdGUgSHVtYW4gUGxheWVyIGJvYXJkIFVJLlxuICA2LiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3ZlclxuICAgIGlmIG5vdCwgbG9vcCBiYWNrIHRvIHN0ZXAgMi5cbiAgICBpZiBvdmVyLCBkaXNwbGF5IGEgbWVzc2FnZSBhbmQgc3RvcCBwbGF5ZXIgZnJvbSBjbGlja2luZyBvbiBib2FyZC5cbiAgKi9cblxuICBwbGFjZUNvbXB1dGVyU2hpcHMoKTtcblxuICByZXR1cm4ge1xuICAgIGdldCBodW1hblBsYXllcigpIHtcbiAgICAgIHJldHVybiBodW1hblBsYXllcjtcbiAgICB9LFxuICAgIGdldCBjb21wdXRlclBsYXllcigpIHtcbiAgICAgIHJldHVybiBjb21wdXRlclBsYXllcjtcbiAgICB9LFxuICAgIGdldCBwbGF5ZXJTaGlwcygpIHtcbiAgICAgIHJldHVybiBwbGF5ZXJTaGlwcztcbiAgICB9LFxuICAgIHBsYXlUdXJuLFxuICAgIGdhbWVPdmVyLFxuICAgIHBsYWNlU2hpcCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWU7XG4iLCJjb25zdCBnYW1lYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGNvbnN0IHJvdyA9IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgY29uc3QgY2VsbCA9IHsgaXNIaXQ6IGZhbHNlLCBzaGlwT2JqOiBudWxsIH07XG4gICAgICByb3cucHVzaChjZWxsKTtcbiAgICB9XG4gICAgYm9hcmQucHVzaChyb3cpO1xuICB9XG4gIGNvbnN0IHNoaXBzID0gW107XG5cbiAgZnVuY3Rpb24gY2hlY2tDb29yZGluYXRlcyhsZW5ndGgsIHJvdywgY29sLCBvcmllbnRhdGlvbikge1xuICAgIGNvbnNvbGUubG9nKGxlbmd0aCk7XG4gICAgbGV0IG5ld1JvdyA9IHJvdztcbiAgICBsZXQgbmV3Q29sID0gY29sO1xuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBuZXdSb3cgKz0gbGVuZ3RoIC0gMTtcbiAgICAgIGlmIChuZXdSb3cgPCAwIHx8IG5ld1JvdyA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgIG5ld1JvdyA9IHJvdztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW25ld1Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbmV3Um93ICs9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIG5ld0NvbCArPSBsZW5ndGggLSAxO1xuICAgICAgaWYgKG5ld0NvbCA8IDAgfHwgbmV3Q29sID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgbmV3Q29sID0gY29sO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYm9hcmRbcm93XVtuZXdDb2xdLnNoaXBPYmogIT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBuZXdDb2wgKz0gMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcChzaGlwLCByb3csIGNvbCwgb3JpZW50YXRpb24pIHtcbiAgICBpZiAoY2hlY2tDb29yZGluYXRlcyhzaGlwLmxlbmd0aCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSA9PT0gZmFsc2UpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgbGV0IG5ld1JvdyA9IHJvdztcbiAgICBsZXQgbmV3Q29sID0gY29sO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZFtuZXdSb3ddW2NvbF0uc2hpcE9iaiA9IHNoaXA7XG4gICAgICAgIG5ld1JvdyArPSAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm9hcmRbcm93XVtuZXdDb2xdLnNoaXBPYmogPSBzaGlwO1xuICAgICAgICBuZXdDb2wgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICBpZiAocm93ID4gOSB8fCByb3cgPCAwIHx8IGNvbCA+IDkgfHwgY29sIDwgMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXS5pc0hpdCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgYm9hcmRbcm93XVtjb2xdLmlzSGl0ID0gdHJ1ZTtcblxuICAgIGlmIChib2FyZFtyb3ddW2NvbF0uc2hpcE9iaiAhPSBudWxsKSB7XG4gICAgICBib2FyZFtyb3ddW2NvbF0uc2hpcE9iai5oaXQoKTtcbiAgICAgIGlmIChib2FyZFtyb3ddW2NvbF0uc2hpcE9iai5zdW5rKSByZXR1cm4gXCJzaW5rXCI7XG4gICAgICByZXR1cm4gXCJoaXRcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwibWlzc1wiO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tBbGxTaGlwc1N1bmsoKSB7XG4gICAgaWYgKHNoaXBzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNoaXBzW2ldLnN1bmsgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgYm9hcmQoKSB7XG4gICAgICAvLyBzaG91bGQgcHJvYmFibHkgYmUgcHJpdmF0ZS5cbiAgICAgIHJldHVybiBib2FyZDtcbiAgICB9LFxuICAgIHBsYWNlU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGNoZWNrQWxsU2hpcHNTdW5rLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZWJvYXJkO1xuIiwiaW1wb3J0IGdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuY29uc3QgcGxheWVyID0gKCkgPT4ge1xuICBjb25zdCBnQm9hcmQgPSBnYW1lYm9hcmQoKTtcblxuICBmdW5jdGlvbiBhdHRhY2socm93LCBjb2wsIGVuZW15KSB7XG4gICAgcmV0dXJuIGVuZW15LmdCb2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgfVxuXG4gIC8vIEZvciBjb21wdXRlciBwbGF5ZXJzIG9ubHlcbiAgY29uc3QgdmFsaWRFbmVteUNlbGxzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgY29uc3QgY2VsbCA9IFtdO1xuICAgICAgY2VsbC5wdXNoKGkpO1xuICAgICAgY2VsbC5wdXNoKGopO1xuICAgICAgdmFsaWRFbmVteUNlbGxzLnB1c2goY2VsbCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tQXR0YWNrKGVuZW15KSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmFsaWRFbmVteUNlbGxzLmxlbmd0aCldO1xuICAgIGNvbnN0IHJhbmRvbUNlbGwgPSB2YWxpZEVuZW15Q2VsbHNbcmFuZG9tSW5kZXhdO1xuICAgIHZhbGlkRW5lbXlDZWxscy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICAgIHJldHVybiBhdHRhY2socmFuZG9tQ2VsbFswXSwgcmFuZG9tQ2VsbFsxXSwgZW5lbXkpO1xuICB9XG4gIC8vXG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgZ0JvYXJkKCkge1xuICAgICAgcmV0dXJuIGdCb2FyZDtcbiAgICB9LFxuICAgIGF0dGFjayxcbiAgICByYW5kb21BdHRhY2ssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwbGF5ZXI7XG4iLCJjb25zdCBzaGlwID0gKGxlbmd0aCkgPT4ge1xuICBsZXQgdGltZXNIaXQgPSAwO1xuICBsZXQgc3VuayA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGlzU3VuaygpIHtcbiAgICBpZiAobGVuZ3RoIDw9IHRpbWVzSGl0KSB7XG4gICAgICBzdW5rID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgdGltZXNIaXQgKz0gMTtcbiAgICBpc1N1bmsoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfSxcbiAgICBnZXQgdGltZXNIaXQoKSB7XG4gICAgICByZXR1cm4gdGltZXNIaXQ7XG4gICAgfSxcbiAgICBnZXQgc3VuaygpIHtcbiAgICAgIHJldHVybiBzdW5rO1xuICAgIH0sXG4gICAgaGl0LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2hpcDtcbiIsImltcG9ydCBnYW1lIGZyb20gXCIuL2dhbWVcIjtcblxuY29uc3Qgc2NyZWVuQ29udHJvbGxlciA9ICgpID0+IHtcbiAgY29uc3QgZ2FtZUNvbnRyb2xsZXIgPSBnYW1lKCk7XG5cbiAgLypcbiAgY29uc3QgdGhpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRoaW5nXCIpO1xuICBjb25zdCB0b2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRvZ2dsZVwiKTtcbiAgdG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgdGhpbmcuY2xhc3NMaXN0LnRvZ2dsZShcInRlc3RcIik7XG4gIH0pOyAqL1xuXG4gIC8vIENhY2hlIERPTVxuICBjb25zdCBmcmllbmRseUNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5mcmllbmRseVwiKTtcbiAgY29uc3QgZW5lbXlDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW5lbXlcIik7XG4gIGNvbnN0IGRpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpc3BsYXlcIik7XG5cbiAgZnVuY3Rpb24gZW1wdHlDZWxsSGl0KGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2NjdXBpZWRDZWxsSGl0KGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5ZXJTaGlwQ2VsbChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwicGxheWVyLXNoaXBcIik7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJCb2FyZChwbGF5ZXIpIHtcbiAgICBsZXQgYm9hcmROdW1iZXIgPSAwO1xuICAgIGlmIChwbGF5ZXIgPT09IGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyKSBib2FyZE51bWJlciA9IDE7XG5cbiAgICBjb25zdCBib2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJvYXJkXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIC8vIGlmIGJvYXJkTnVtYmVyID09PSAwLCBzZXQgcGxheWVyIHNoaXBzIHRvIGJsdWVcbiAgICAgICAgaWYgKGJvYXJkTnVtYmVyID09PSAwICYmIHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uc2hpcE9iaiAhPSBudWxsKSB7XG4gICAgICAgICAgcGxheWVyU2hpcENlbGwoYm9hcmRzW2Ake2JvYXJkTnVtYmVyfWBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLmlzSGl0ID09PSB0cnVlICYmXG4gICAgICAgICAgcGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5zaGlwT2JqICE9IG51bGxcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2NjdXBpZWRDZWxsSGl0KGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSk7XG4gICAgICAgICAgYm9hcmRzW2Ake2JvYXJkTnVtYmVyfWBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdLmNsYXNzTGlzdC5yZW1vdmUoXG4gICAgICAgICAgICBcInBsYXllci1zaGlwXCJcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uaXNIaXQgPT09IHRydWUpIHtcbiAgICAgICAgICBlbXB0eUNlbGxIaXQoYm9hcmRzW2Ake2JvYXJkTnVtYmVyfWBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGJpbmRQbGFjZVNoaXBDb250cm9scygpIHtcbiAgICBmcmllbmRseUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYWNlUGxheWVyU2hpcCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1bmJpbmRQbGFjZVNoaXBDb250cm9scygpIHtcbiAgICBmcmllbmRseUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHBsYWNlUGxheWVyU2hpcCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1bmJpbmRDb250cm9scygpIHtcbiAgICBlbmVteUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGF0dGFja0NlbGwpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYmluZENvbnRyb2xzKCkge1xuICAgIGVuZW15Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXR0YWNrQ2VsbCk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBhZGQgYSBtZXNzYWdlIHdoZW4gYSBzaGlwIGlzIHN1bmtcbiAgZnVuY3Rpb24gdXBkYXRlRGlzcGxheShwbGF5ZXIsIHJlc3VsdCkge1xuICAgIGlmIChyZXN1bHQgPT09IFwiaHVtYW5XaW5cIilcbiAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJBbGwgeW91ciBvcHBvbmVudCdzIHNoaXBzIGhhdmUgYmVlbiBzdW5rISBZb3Ugd2luIVwiO1xuICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJjb21wdXRlcldpblwiKVxuICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIkFsbCB5b3VyIHNoaXAncyBoYXZlIGJlZW4gc3VuayEgWW91IGxvc2UhXCI7XG5cbiAgICBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5odW1hblBsYXllcikge1xuICAgICAgaWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3UgbWlzc2VkIVwiO1xuICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSBcImhpdFwiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91IGhpdCBhIHNoaXAhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwic2lua1wiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91IHN1bmsgYSBzaGlwIVwiO1xuICAgIH0gZWxzZSBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcikge1xuICAgICAgaWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IG1pc3NlZCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJoaXRcIilcbiAgICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdXIgb3Bwb25lbnQgaGl0IGEgc2hpcCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJzaW5rXCIpXG4gICAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IHN1bmsgYSBzaGlwIVwiO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFja0NlbGwoKSB7XG4gICAgY29uc3QgcGxheVR1cm5SZXN1bHQgPSBnYW1lQ29udHJvbGxlci5wbGF5VHVybihcbiAgICAgIHRoaXMucGFyZW50RWxlbWVudC5kYXRhc2V0LnJvdyxcbiAgICAgIHRoaXMuZGF0YXNldC5jb2xcbiAgICApO1xuICAgIGlmIChwbGF5VHVyblJlc3VsdCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICByZW5kZXJCb2FyZChnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcik7XG4gICAgdW5iaW5kQ29udHJvbHMoKTtcbiAgICBpZiAocGxheVR1cm5SZXN1bHRbMl0gPT09IFwiaHVtYW5XaW5cIikge1xuICAgICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5odW1hblBsYXllciwgcGxheVR1cm5SZXN1bHRbMl0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1cGRhdGVEaXNwbGF5KGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyLCBwbGF5VHVyblJlc3VsdFswXSk7XG5cbiAgICAvLyBzZXQgYSBkZWxheSBiZWZvcmUgdGhlIGNvbXB1dGVyJ3MgYWN0aW9uIGlzIGRpc3BsYXllZC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJlbmRlckJvYXJkKGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyKTtcbiAgICAgIGlmIChwbGF5VHVyblJlc3VsdFsyXSA9PT0gXCJjb21wdXRlcldpblwiKSB7XG4gICAgICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzJdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYmluZENvbnRyb2xzKCk7XG4gICAgICB1cGRhdGVEaXNwbGF5KGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyLCBwbGF5VHVyblJlc3VsdFsxXSk7XG4gICAgfSwgMjAwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVBsYXllclNoaXAoKSB7XG4gICAgY29uc3QgeyByb3cgfSA9IHRoaXMucGFyZW50RWxlbWVudC5kYXRhc2V0O1xuICAgIGNvbnN0IHsgY29sIH0gPSB0aGlzLmRhdGFzZXQ7XG5cbiAgICAvLyBlbmVteSBib2FyZCBoaWRkZW4gYnkgZGVmYXVsdC4gUm90YXRlIHNob3duIGJ5IGRlZmF1bHQuXG4gICAgLy8gSWYgZmFsc2UsIHVwZGF0ZSBkaXNwbGF5XG4gICAgLy8gZ2FtZWJvYXJkIGNoZWNrQ29vcmRpbmF0ZXMgZnVuY3Rpb24gaXMgZmxhd2VkLlxuICAgIGlmIChcbiAgICAgIGdhbWVDb250cm9sbGVyLnBsYWNlU2hpcChOdW1iZXIocm93KSwgTnVtYmVyKGNvbCksIFwiaG9yaXpvbnRhbFwiKSA9PT0gZmFsc2VcbiAgICApIHtcbiAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJJbnZhbGlkIHBsYWNlbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiFcIjtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgc2hpcHNBcnJheSA9IGdhbWVDb250cm9sbGVyLnBsYXllclNoaXBzO1xuXG4gICAgZGlzcGxheS5pbm5lclRleHQgPSBcIkdvb2RcIjtcblxuICAgIC8vIElmIHRydWUsIHVwZGF0ZSBkaXNwbGF5XG4gICAgaWYgKHNoaXBzQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICB1bmJpbmRQbGFjZVNoaXBDb250cm9scygpO1xuICAgICAgLy8gZGlzcGxheSBlbmVteSBib2FyZC5cbiAgICB9XG5cbiAgICByZW5kZXJCb2FyZChnYW1lQ29udHJvbGxlci5odW1hblBsYXllcik7XG4gIH1cblxuICAvKiBwbGFjaW5nIHBsYXllciBzaGlwc1xuICBBbGxvdyB0aGUgcGxheWVyIHRvIGNob29zZSByYW5kb20gcGxhY2VtZW50IGlmIGRlc2lyZWQuXG5cbiAgQ3JlYXRlIHNoaXBzIGFuZCBwdXQgdGhlbSBpbnRvIGFycmF5LlxuICBQbGFjaW5nIHNoaXBzOlxuICAgIDEuIERpc3BsYXkgdGVsbHMgcGxheWVyIHRvIHBsYWNlIHRoZSBzaGlwIChuYW1lIGFuZCBsZW5ndGgpLlxuICAgICAgSWYgaW52YWxpZCBwbGFjZW1lbnQsIHVwZGF0ZSBkaXNwbGF5LCBzaGlwIGlzIG5vdCBwbGFjZWQuXG4gICAgMi4gT25jZSBzaGlwIGhhcyBiZWVuIHBsYWNlZCwgcmVuZGVyQm9hcmQuXG5cbiAgVW5oaWRlIGVuZW15IGJvYXJkIGFuZCBoaWRlIHJvdGF0ZSBidXR0b24uXG5cbiAgU3RhcnQgdGhlIGdhbWUgb25jZSBhbGwgcGxheWVyIHNoaXBzIGhhdmUgYmVlbiBwbGFjZWQuXG4gICovXG5cbiAgYmluZENvbnRyb2xzKCk7XG4gIGJpbmRQbGFjZVNoaXBDb250cm9scygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2NyZWVuQ29udHJvbGxlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHNjcmVlbkNvbnRyb2xsZXIgZnJvbSBcIi4vc2NyZWVuQ29udHJvbGxlclwiO1xuXG5zY3JlZW5Db250cm9sbGVyKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=