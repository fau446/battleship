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
  let placementOrientation = "horizontal";

  function changePlacementOrientation() {
    placementOrientation =
      placementOrientation === "horizontal" ? "vertical" : "horizontal";
  }

  function placeShip(row, col) {
    console.log(placementOrientation);
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
  const rotateButton = document.querySelector(".rotate");
  rotateButton.addEventListener("click", changePlacementOrientation);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUVBQWUsZ0JBQWdCLEVBQUM7Ozs7Ozs7VUM5S2hDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0Q7O0FBRWxELDZEQUFnQiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JlZW5Db250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwbGF5ZXIgZnJvbSBcIi4vbW9kdWxlcy9wbGF5ZXJcIjtcbmltcG9ydCBzaGlwIGZyb20gXCIuL21vZHVsZXMvc2hpcFwiO1xuXG5jb25zdCBnYW1lID0gKCkgPT4ge1xuICAvLyBzZXR1cCBodW1hbiBhbmQgY29tcHV0ZXIgcGxheWVyc1xuICBjb25zdCBodW1hblBsYXllciA9IHBsYXllcigpO1xuICBjb25zdCBjb21wdXRlclBsYXllciA9IHBsYXllcigpO1xuICBjb25zdCBjYXJyaWVyID0gc2hpcCg1KTtcbiAgY29uc3QgYmF0dGxlc2hpcCA9IHNoaXAoNCk7XG4gIGNvbnN0IGRlc3Ryb3llciA9IHNoaXAoMyk7XG4gIGNvbnN0IHN1Ym1hcmluZSA9IHNoaXAoMyk7XG4gIGNvbnN0IHBhdHJvbEJvYXQgPSBzaGlwKDIpO1xuICBjb25zdCBwbGF5ZXJTaGlwcyA9IFtjYXJyaWVyLCBiYXR0bGVzaGlwLCBkZXN0cm95ZXIsIHN1Ym1hcmluZSwgcGF0cm9sQm9hdF07XG4gIGxldCBwbGFjZW1lbnRPcmllbnRhdGlvbiA9IFwiaG9yaXpvbnRhbFwiO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZVBsYWNlbWVudE9yaWVudGF0aW9uKCkge1xuICAgIHBsYWNlbWVudE9yaWVudGF0aW9uID1cbiAgICAgIHBsYWNlbWVudE9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIiA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKHJvdywgY29sKSB7XG4gICAgY29uc29sZS5sb2cocGxhY2VtZW50T3JpZW50YXRpb24pO1xuICAgIGlmIChcbiAgICAgIGh1bWFuUGxheWVyLmdCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgIHBsYXllclNoaXBzWzBdLFxuICAgICAgICByb3csXG4gICAgICAgIGNvbCxcbiAgICAgICAgcGxhY2VtZW50T3JpZW50YXRpb25cbiAgICAgICkgPT09IGZhbHNlXG4gICAgKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcGxheWVyU2hpcHMuc2hpZnQoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJTaGlwcygpIHtcbiAgICBjb25zdCBjb21wdXRlckNhcnJpZXIgPSBzaGlwKDUpO1xuICAgIGNvbnN0IGNvbXB1dGVyQmF0dGxlc2hpcCA9IHNoaXAoNCk7XG4gICAgY29uc3QgY29tcHV0ZXJEZXN0cm95ZXIgPSBzaGlwKDMpO1xuICAgIGNvbnN0IGNvbXB1dGVyU3VibWFyaW5lID0gc2hpcCgzKTtcbiAgICBjb25zdCBjb21wdXRlclBhdHJvbEJvYXQgPSBzaGlwKDIpO1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hdHMgPSBbXG4gICAgICBjb21wdXRlckNhcnJpZXIsXG4gICAgICBjb21wdXRlckJhdHRsZXNoaXAsXG4gICAgICBjb21wdXRlckRlc3Ryb3llcixcbiAgICAgIGNvbXB1dGVyU3VibWFyaW5lLFxuICAgICAgY29tcHV0ZXJQYXRyb2xCb2F0LFxuICAgIF07XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBbXCJob3Jpem9udGFsXCIsIFwidmVydGljYWxcIl07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXB1dGVyQm9hdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJvYXQgPSBjb21wdXRlckJvYXRzW2ldO1xuICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcHV0ZXJQbGF5ZXIuZ0JvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICBib2F0LFxuICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gICAgICAgICAgb3JpZW50YXRpb25bcmFuZG9tSW5kZXhdXG4gICAgICAgICkgPT09IGZhbHNlXG4gICAgICApXG4gICAgICAgIGktLTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5VHVybihyb3csIGNvbCkge1xuICAgIGNvbnN0IGh1bWFuQXR0YWNrUmVzdWx0ID0gaHVtYW5QbGF5ZXIuYXR0YWNrKHJvdywgY29sLCBjb21wdXRlclBsYXllcik7XG4gICAgaWYgKGh1bWFuQXR0YWNrUmVzdWx0ID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChnYW1lT3ZlcigpKSByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBudWxsLCBcImh1bWFuV2luXCJdO1xuICAgIGNvbnN0IGNvbXB1dGVyQXR0YWNrUmVzdWx0ID0gY29tcHV0ZXJQbGF5ZXIucmFuZG9tQXR0YWNrKGh1bWFuUGxheWVyKTtcbiAgICBpZiAoZ2FtZU92ZXIoKSlcbiAgICAgIHJldHVybiBbaHVtYW5BdHRhY2tSZXN1bHQsIGNvbXB1dGVyQXR0YWNrUmVzdWx0LCBcImNvbXB1dGVyV2luXCJdO1xuICAgIHJldHVybiBbaHVtYW5BdHRhY2tSZXN1bHQsIGNvbXB1dGVyQXR0YWNrUmVzdWx0LCBmYWxzZV07XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICBpZiAoXG4gICAgICBodW1hblBsYXllci5nQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmsoKSB8fFxuICAgICAgY29tcHV0ZXJQbGF5ZXIuZ0JvYXJkLmNoZWNrQWxsU2hpcHNTdW5rKClcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKlxuICAxLiBDbGljayBvbiBzdGFydCBnYW1lLlxuICAyLiBIdW1hbiBwbGF5ZXIgZ29lcyBmaXJzdCwgY2xpY2tzIG9uIGEgY2VsbCBvbiB0aGUgZW5lbXkgYm9hcmQgdG8gYXR0YWNrLlxuICAgIHNjcmVlbkNvbnRyb2xsZXIgY2FsbHMgYSBmdW5jdGlvbiBpbiBnYW1lIG1vZHVsZSB0byBhdHRhY2suXG4gIDMuIENoZWNrcyBpZiBpdCdzIGEgaGl0LCB1cGRhdGVzIHRoZSBjb21wdXRlciBwbGF5ZXIncyBib2FyZCBVSSB0aHJvdWdoIHNjcmVlbkNvbnRyb2xsZXIuXG4gIDQuIENvbXB1dGVyIFBsYXllciBhdHRhY2tzLlxuICA1LiBVcGRhdGUgSHVtYW4gUGxheWVyIGJvYXJkIFVJLlxuICA2LiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3ZlclxuICAgIGlmIG5vdCwgbG9vcCBiYWNrIHRvIHN0ZXAgMi5cbiAgICBpZiBvdmVyLCBkaXNwbGF5IGEgbWVzc2FnZSBhbmQgc3RvcCBwbGF5ZXIgZnJvbSBjbGlja2luZyBvbiBib2FyZC5cbiAgKi9cblxuICBwbGFjZUNvbXB1dGVyU2hpcHMoKTtcblxuICByZXR1cm4ge1xuICAgIGdldCBodW1hblBsYXllcigpIHtcbiAgICAgIHJldHVybiBodW1hblBsYXllcjtcbiAgICB9LFxuICAgIGdldCBjb21wdXRlclBsYXllcigpIHtcbiAgICAgIHJldHVybiBjb21wdXRlclBsYXllcjtcbiAgICB9LFxuICAgIGdldCBwbGF5ZXJTaGlwcygpIHtcbiAgICAgIHJldHVybiBwbGF5ZXJTaGlwcztcbiAgICB9LFxuICAgIGNoYW5nZVBsYWNlbWVudE9yaWVudGF0aW9uLFxuICAgIHBsYXlUdXJuLFxuICAgIGdhbWVPdmVyLFxuICAgIHBsYWNlU2hpcCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWU7XG4iLCJjb25zdCBnYW1lYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGNvbnN0IHJvdyA9IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgY29uc3QgY2VsbCA9IHsgaXNIaXQ6IGZhbHNlLCBzaGlwT2JqOiBudWxsIH07XG4gICAgICByb3cucHVzaChjZWxsKTtcbiAgICB9XG4gICAgYm9hcmQucHVzaChyb3cpO1xuICB9XG4gIGNvbnN0IHNoaXBzID0gW107XG5cbiAgZnVuY3Rpb24gY2hlY2tDb29yZGluYXRlcyhsZW5ndGgsIHJvdywgY29sLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBuZXdSb3cgPSByb3c7XG4gICAgbGV0IG5ld0NvbCA9IGNvbDtcbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgbmV3Um93ICs9IGxlbmd0aCAtIDE7XG4gICAgICBpZiAobmV3Um93IDwgMCB8fCBuZXdSb3cgPiA5KSByZXR1cm4gZmFsc2U7XG4gICAgICBuZXdSb3cgPSByb3c7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChib2FyZFtuZXdSb3ddW2NvbF0uc2hpcE9iaiAhPSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIG5ld1JvdyArPSAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBuZXdDb2wgKz0gbGVuZ3RoIC0gMTtcbiAgICAgIGlmIChuZXdDb2wgPCAwIHx8IG5ld0NvbCA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgIG5ld0NvbCA9IGNvbDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW3Jvd11bbmV3Q29sXS5zaGlwT2JqICE9IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbmV3Q29sICs9IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSB7XG4gICAgaWYgKGNoZWNrQ29vcmRpbmF0ZXMoc2hpcC5sZW5ndGgsIHJvdywgY29sLCBvcmllbnRhdGlvbikgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGxldCBuZXdSb3cgPSByb3c7XG4gICAgbGV0IG5ld0NvbCA9IGNvbDtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm9hcmRbbmV3Um93XVtjb2xdLnNoaXBPYmogPSBzaGlwO1xuICAgICAgICBuZXdSb3cgKz0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkW3Jvd11bbmV3Q29sXS5zaGlwT2JqID0gc2hpcDtcbiAgICAgICAgbmV3Q29sICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHJvdywgY29sKSB7XG4gICAgaWYgKHJvdyA+IDkgfHwgcm93IDwgMCB8fCBjb2wgPiA5IHx8IGNvbCA8IDApIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChib2FyZFtyb3ddW2NvbF0uaXNIaXQpIHJldHVybiBmYWxzZTtcblxuICAgIGJvYXJkW3Jvd11bY29sXS5pc0hpdCA9IHRydWU7XG5cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdLnNoaXBPYmogIT0gbnVsbCkge1xuICAgICAgYm9hcmRbcm93XVtjb2xdLnNoaXBPYmouaGl0KCk7XG4gICAgICBpZiAoYm9hcmRbcm93XVtjb2xdLnNoaXBPYmouc3VuaykgcmV0dXJuIFwic2lua1wiO1xuICAgICAgcmV0dXJuIFwiaGl0XCI7XG4gICAgfVxuICAgIHJldHVybiBcIm1pc3NcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrQWxsU2hpcHNTdW5rKCkge1xuICAgIGlmIChzaGlwcy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5zdW5rID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0IGJvYXJkKCkge1xuICAgICAgLy8gc2hvdWxkIHByb2JhYmx5IGJlIHByaXZhdGUuXG4gICAgICByZXR1cm4gYm9hcmQ7XG4gICAgfSxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBjaGVja0FsbFNoaXBzU3VuayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVib2FyZDtcbiIsImltcG9ydCBnYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmNvbnN0IHBsYXllciA9ICgpID0+IHtcbiAgY29uc3QgZ0JvYXJkID0gZ2FtZWJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gYXR0YWNrKHJvdywgY29sLCBlbmVteSkge1xuICAgIHJldHVybiBlbmVteS5nQm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG4gIH1cblxuICAvLyBGb3IgY29tcHV0ZXIgcGxheWVycyBvbmx5XG4gIGNvbnN0IHZhbGlkRW5lbXlDZWxscyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBbXTtcbiAgICAgIGNlbGwucHVzaChpKTtcbiAgICAgIGNlbGwucHVzaChqKTtcbiAgICAgIHZhbGlkRW5lbXlDZWxscy5wdXNoKGNlbGwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbUF0dGFjayhlbmVteSkge1xuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkRW5lbXlDZWxscy5sZW5ndGgpXTtcbiAgICBjb25zdCByYW5kb21DZWxsID0gdmFsaWRFbmVteUNlbGxzW3JhbmRvbUluZGV4XTtcbiAgICB2YWxpZEVuZW15Q2VsbHMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgICByZXR1cm4gYXR0YWNrKHJhbmRvbUNlbGxbMF0sIHJhbmRvbUNlbGxbMV0sIGVuZW15KTtcbiAgfVxuICAvL1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IGdCb2FyZCgpIHtcbiAgICAgIHJldHVybiBnQm9hcmQ7XG4gICAgfSxcbiAgICBhdHRhY2ssXG4gICAgcmFuZG9tQXR0YWNrLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcGxheWVyO1xuIiwiY29uc3Qgc2hpcCA9IChsZW5ndGgpID0+IHtcbiAgbGV0IHRpbWVzSGl0ID0gMDtcbiAgbGV0IHN1bmsgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgaWYgKGxlbmd0aCA8PSB0aW1lc0hpdCkge1xuICAgICAgc3VuayA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGl0KCkge1xuICAgIHRpbWVzSGl0ICs9IDE7XG4gICAgaXNTdW5rKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH0sXG4gICAgZ2V0IHRpbWVzSGl0KCkge1xuICAgICAgcmV0dXJuIHRpbWVzSGl0O1xuICAgIH0sXG4gICAgZ2V0IHN1bmsoKSB7XG4gICAgICByZXR1cm4gc3VuaztcbiAgICB9LFxuICAgIGhpdCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNoaXA7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5cbmNvbnN0IHNjcmVlbkNvbnRyb2xsZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVDb250cm9sbGVyID0gZ2FtZSgpO1xuXG4gIC8qXG4gIGNvbnN0IHRoaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50aGluZ1wiKTtcbiAgY29uc3QgdG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2dnbGVcIik7XG4gIHRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHRoaW5nLmNsYXNzTGlzdC50b2dnbGUoXCJ0ZXN0XCIpO1xuICB9KTsgKi9cblxuICAvLyBDYWNoZSBET01cbiAgY29uc3QgZnJpZW5kbHlDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZnJpZW5kbHlcIik7XG4gIGNvbnN0IGVuZW15Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVuZW15XCIpO1xuICBjb25zdCBkaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXNwbGF5XCIpO1xuICBjb25zdCByb3RhdGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZVwiKTtcbiAgcm90YXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaGFuZ2VQbGFjZW1lbnRPcmllbnRhdGlvbik7XG5cbiAgZnVuY3Rpb24gY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24oKSB7XG4gICAgZ2FtZUNvbnRyb2xsZXIuY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtcHR5Q2VsbEhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9jY3VwaWVkQ2VsbEhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxheWVyU2hpcENlbGwoY2VsbCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInBsYXllci1zaGlwXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQm9hcmQocGxheWVyKSB7XG4gICAgbGV0IGJvYXJkTnVtYmVyID0gMDtcbiAgICBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcikgYm9hcmROdW1iZXIgPSAxO1xuXG4gICAgY29uc3QgYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib2FyZFwiKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICAvLyBpZiBib2FyZE51bWJlciA9PT0gMCwgc2V0IHBsYXllciBzaGlwcyB0byBibHVlXG4gICAgICAgIGlmIChib2FyZE51bWJlciA9PT0gMCAmJiBwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLnNoaXBPYmogIT0gbnVsbCkge1xuICAgICAgICAgIHBsYXllclNoaXBDZWxsKGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgcGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5pc0hpdCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgIHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uc2hpcE9iaiAhPSBudWxsXG4gICAgICAgICkge1xuICAgICAgICAgIG9jY3VwaWVkQ2VsbEhpdChib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0pO1xuICAgICAgICAgIGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXS5jbGFzc0xpc3QucmVtb3ZlKFxuICAgICAgICAgICAgXCJwbGF5ZXItc2hpcFwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLmlzSGl0ID09PSB0cnVlKSB7XG4gICAgICAgICAgZW1wdHlDZWxsSGl0KGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kUGxhY2VTaGlwQ29udHJvbHMoKSB7XG4gICAgZnJpZW5kbHlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGFjZVBsYXllclNoaXApO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5iaW5kUGxhY2VTaGlwQ29udHJvbHMoKSB7XG4gICAgZnJpZW5kbHlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBwbGFjZVBsYXllclNoaXApO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5iaW5kQ29udHJvbHMoKSB7XG4gICAgZW5lbXlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2tDZWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJpbmRDb250cm9scygpIHtcbiAgICBlbmVteUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGF0dGFja0NlbGwpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gYWRkIGEgbWVzc2FnZSB3aGVuIGEgc2hpcCBpcyBzdW5rXG4gIGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkocGxheWVyLCByZXN1bHQpIHtcbiAgICBpZiAocmVzdWx0ID09PSBcImh1bWFuV2luXCIpXG4gICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiQWxsIHlvdXIgb3Bwb25lbnQncyBzaGlwcyBoYXZlIGJlZW4gc3VuayEgWW91IHdpbiFcIjtcbiAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwiY29tcHV0ZXJXaW5cIilcbiAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJBbGwgeW91ciBzaGlwJ3MgaGF2ZSBiZWVuIHN1bmshIFlvdSBsb3NlIVwiO1xuXG4gICAgaWYgKHBsYXllciA9PT0gZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIpIHtcbiAgICAgIGlmIChyZXN1bHQgPT09IFwibWlzc1wiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91IG1pc3NlZCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJoaXRcIikgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdSBoaXQgYSBzaGlwIVwiO1xuICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSBcInNpbmtcIikgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdSBzdW5rIGEgc2hpcCFcIjtcbiAgICB9IGVsc2UgaWYgKHBsYXllciA9PT0gZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIpIHtcbiAgICAgIGlmIChyZXN1bHQgPT09IFwibWlzc1wiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91ciBvcHBvbmVudCBtaXNzZWQhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpXG4gICAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IGhpdCBhIHNoaXAhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwic2lua1wiKVxuICAgICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91ciBvcHBvbmVudCBzdW5rIGEgc2hpcCFcIjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhdHRhY2tDZWxsKCkge1xuICAgIGNvbnN0IHBsYXlUdXJuUmVzdWx0ID0gZ2FtZUNvbnRyb2xsZXIucGxheVR1cm4oXG4gICAgICBOdW1iZXIodGhpcy5wYXJlbnRFbGVtZW50LmRhdGFzZXQucm93KSxcbiAgICAgIE51bWJlcih0aGlzLmRhdGFzZXQuY29sKVxuICAgICk7XG4gICAgaWYgKHBsYXlUdXJuUmVzdWx0ID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIHJlbmRlckJvYXJkKGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyKTtcbiAgICB1bmJpbmRDb250cm9scygpO1xuICAgIGlmIChwbGF5VHVyblJlc3VsdFsyXSA9PT0gXCJodW1hbldpblwiKSB7XG4gICAgICB1cGRhdGVEaXNwbGF5KGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyLCBwbGF5VHVyblJlc3VsdFsyXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzBdKTtcblxuICAgIC8vIHNldCBhIGRlbGF5IGJlZm9yZSB0aGUgY29tcHV0ZXIncyBhY3Rpb24gaXMgZGlzcGxheWVkLlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIpO1xuICAgICAgaWYgKHBsYXlUdXJuUmVzdWx0WzJdID09PSBcImNvbXB1dGVyV2luXCIpIHtcbiAgICAgICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllciwgcGxheVR1cm5SZXN1bHRbMl0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBiaW5kQ29udHJvbHMoKTtcbiAgICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzFdKTtcbiAgICB9LCAxMDAwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlUGxheWVyU2hpcCgpIHtcbiAgICBjb25zdCB7IHJvdyB9ID0gdGhpcy5wYXJlbnRFbGVtZW50LmRhdGFzZXQ7XG4gICAgY29uc3QgeyBjb2wgfSA9IHRoaXMuZGF0YXNldDtcblxuICAgIC8vIGVuZW15IGJvYXJkIGhpZGRlbiBieSBkZWZhdWx0LiBSb3RhdGUgc2hvd24gYnkgZGVmYXVsdC5cbiAgICAvLyBJZiBmYWxzZSwgdXBkYXRlIGRpc3BsYXlcbiAgICAvLyBnYW1lYm9hcmQgY2hlY2tDb29yZGluYXRlcyBmdW5jdGlvbiBpcyBmbGF3ZWQuXG4gICAgaWYgKGdhbWVDb250cm9sbGVyLnBsYWNlU2hpcChOdW1iZXIocm93KSwgTnVtYmVyKGNvbCkpID09PSBmYWxzZSkge1xuICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIkludmFsaWQgcGxhY2VtZW50LCBwbGVhc2UgdHJ5IGFnYWluIVwiO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzaGlwc0FycmF5ID0gZ2FtZUNvbnRyb2xsZXIucGxheWVyU2hpcHM7XG5cbiAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiR29vZFwiO1xuXG4gICAgLy8gSWYgdHJ1ZSwgdXBkYXRlIGRpc3BsYXlcbiAgICBpZiAoc2hpcHNBcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgIHVuYmluZFBsYWNlU2hpcENvbnRyb2xzKCk7XG4gICAgICAvLyBkaXNwbGF5IGVuZW15IGJvYXJkLlxuICAgIH1cblxuICAgIHJlbmRlckJvYXJkKGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyKTtcbiAgfVxuXG4gIC8qIHBsYWNpbmcgcGxheWVyIHNoaXBzXG4gIEFsbG93IHRoZSBwbGF5ZXIgdG8gY2hvb3NlIHJhbmRvbSBwbGFjZW1lbnQgaWYgZGVzaXJlZC5cblxuICBDcmVhdGUgc2hpcHMgYW5kIHB1dCB0aGVtIGludG8gYXJyYXkuXG4gIFBsYWNpbmcgc2hpcHM6XG4gICAgMS4gRGlzcGxheSB0ZWxscyBwbGF5ZXIgdG8gcGxhY2UgdGhlIHNoaXAgKG5hbWUgYW5kIGxlbmd0aCkuXG4gICAgICBJZiBpbnZhbGlkIHBsYWNlbWVudCwgdXBkYXRlIGRpc3BsYXksIHNoaXAgaXMgbm90IHBsYWNlZC5cbiAgICAyLiBPbmNlIHNoaXAgaGFzIGJlZW4gcGxhY2VkLCByZW5kZXJCb2FyZC5cblxuICBVbmhpZGUgZW5lbXkgYm9hcmQgYW5kIGhpZGUgcm90YXRlIGJ1dHRvbi5cblxuICBTdGFydCB0aGUgZ2FtZSBvbmNlIGFsbCBwbGF5ZXIgc2hpcHMgaGF2ZSBiZWVuIHBsYWNlZC5cbiAgKi9cblxuICBiaW5kQ29udHJvbHMoKTtcbiAgYmluZFBsYWNlU2hpcENvbnRyb2xzKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzY3JlZW5Db250cm9sbGVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgc2NyZWVuQ29udHJvbGxlciBmcm9tIFwiLi9zY3JlZW5Db250cm9sbGVyXCI7XG5cbnNjcmVlbkNvbnRyb2xsZXIoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==