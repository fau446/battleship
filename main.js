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

  // function setupGame, allows the human player to place ships and automatically places computer ships.

  function placeComputerShips() {
    const carrier = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(5);
    const battleship = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(4);
    const destroyer = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3);
    const submarine = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(3);
    const patrolBoat = (0,_modules_ship__WEBPACK_IMPORTED_MODULE_1__["default"])(2);
    const boats = [carrier, battleship, destroyer, submarine, patrolBoat];
    const orientation = ["horizontal", "vertical"];

    for (let i = 0; i < boats.length; i++) {
      const boat = boats[i];
      const randomIndex = Math.floor(Math.random() * 2);
      if (
        computerPlayer.gBoard.placeShip(
          boat,
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10),
          orientation[randomIndex]
        ) === false
      ) {
        i--;
        console.log("False");
      }
      console.log(boat.length);
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
    playTurn,
    gameOver,
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
    console.log("he");
    ships.push(ship);
    console.log(ships);
    return true;
  }

  function receiveAttack(row, col) {
    if (row > 9 || row < 0 || col > 9 || col < 0) return false;

    if (board[row][col].isHit) return false;

    board[row][col].isHit = true;

    if (board[row][col].shipObj != null) {
      board[row][col].shipObj.hit();
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

  // Cache DOM
  const enemyCells = document.querySelectorAll(".enemy");
  const display = document.querySelector(".display");

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

  function updateDisplay(player, result) {
    if (result === "humanWin")
      display.innerText = "All your opponent's ships have been sunk! You win!";
    else if (result === "computerWin")
      display.innerText = "All your ship's have been sunk! You lose!";

    if (player === gameController.humanPlayer) {
      if (result === "miss") display.innerText = "You missed!";
      else if (result === "hit") display.innerText = "You hit a ship!";
    } else if (player === gameController.computerPlayer) {
      if (result === "miss") display.innerText = "Your opponent missed!";
      else if (result === "hit")
        display.innerText = "Your opponent hit a ship!";
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

  bindControls();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBLGlFQUFlLGdCQUFnQixFQUFDOzs7Ozs7O1VDN0ZoQztVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtEOztBQUVsRCw2REFBZ0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyZWVuQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGxheWVyIGZyb20gXCIuL21vZHVsZXMvcGxheWVyXCI7XG5pbXBvcnQgc2hpcCBmcm9tIFwiLi9tb2R1bGVzL3NoaXBcIjtcblxuY29uc3QgZ2FtZSA9ICgpID0+IHtcbiAgLy8gc2V0dXAgaHVtYW4gYW5kIGNvbXB1dGVyIHBsYXllcnNcbiAgY29uc3QgaHVtYW5QbGF5ZXIgPSBwbGF5ZXIoKTtcbiAgY29uc3QgY29tcHV0ZXJQbGF5ZXIgPSBwbGF5ZXIoKTtcblxuICAvLyBmdW5jdGlvbiBzZXR1cEdhbWUsIGFsbG93cyB0aGUgaHVtYW4gcGxheWVyIHRvIHBsYWNlIHNoaXBzIGFuZCBhdXRvbWF0aWNhbGx5IHBsYWNlcyBjb21wdXRlciBzaGlwcy5cblxuICBmdW5jdGlvbiBwbGFjZUNvbXB1dGVyU2hpcHMoKSB7XG4gICAgY29uc3QgY2FycmllciA9IHNoaXAoNSk7XG4gICAgY29uc3QgYmF0dGxlc2hpcCA9IHNoaXAoNCk7XG4gICAgY29uc3QgZGVzdHJveWVyID0gc2hpcCgzKTtcbiAgICBjb25zdCBzdWJtYXJpbmUgPSBzaGlwKDMpO1xuICAgIGNvbnN0IHBhdHJvbEJvYXQgPSBzaGlwKDIpO1xuICAgIGNvbnN0IGJvYXRzID0gW2NhcnJpZXIsIGJhdHRsZXNoaXAsIGRlc3Ryb3llciwgc3VibWFyaW5lLCBwYXRyb2xCb2F0XTtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IFtcImhvcml6b250YWxcIiwgXCJ2ZXJ0aWNhbFwiXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYm9hdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJvYXQgPSBib2F0c1tpXTtcbiAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgICBpZiAoXG4gICAgICAgIGNvbXB1dGVyUGxheWVyLmdCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgYm9hdCxcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuICAgICAgICAgIG9yaWVudGF0aW9uW3JhbmRvbUluZGV4XVxuICAgICAgICApID09PSBmYWxzZVxuICAgICAgKSB7XG4gICAgICAgIGktLTtcbiAgICAgICAgY29uc29sZS5sb2coXCJGYWxzZVwiKTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKGJvYXQubGVuZ3RoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5VHVybihyb3csIGNvbCkge1xuICAgIGNvbnN0IGh1bWFuQXR0YWNrUmVzdWx0ID0gaHVtYW5QbGF5ZXIuYXR0YWNrKHJvdywgY29sLCBjb21wdXRlclBsYXllcik7XG4gICAgaWYgKGh1bWFuQXR0YWNrUmVzdWx0ID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGlmIChnYW1lT3ZlcigpKSByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBudWxsLCBcImh1bWFuV2luXCJdO1xuICAgIGNvbnN0IGNvbXB1dGVyQXR0YWNrUmVzdWx0ID0gY29tcHV0ZXJQbGF5ZXIucmFuZG9tQXR0YWNrKGh1bWFuUGxheWVyKTtcbiAgICAvLyBpZiAoZ2FtZU92ZXIoKSlcbiAgICAvLyByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgXCJjb21wdXRlcldpblwiXTtcbiAgICByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgZmFsc2VdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgaWYgKFxuICAgICAgaHVtYW5QbGF5ZXIuZ0JvYXJkLmNoZWNrQWxsU2hpcHNTdW5rIHx8XG4gICAgICBjb21wdXRlclBsYXllci5nQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmtcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKlxuICAxLiBDbGljayBvbiBzdGFydCBnYW1lLlxuICAyLiBIdW1hbiBwbGF5ZXIgZ29lcyBmaXJzdCwgY2xpY2tzIG9uIGEgY2VsbCBvbiB0aGUgZW5lbXkgYm9hcmQgdG8gYXR0YWNrLlxuICAgIHNjcmVlbkNvbnRyb2xsZXIgY2FsbHMgYSBmdW5jdGlvbiBpbiBnYW1lIG1vZHVsZSB0byBhdHRhY2suXG4gIDMuIENoZWNrcyBpZiBpdCdzIGEgaGl0LCB1cGRhdGVzIHRoZSBjb21wdXRlciBwbGF5ZXIncyBib2FyZCBVSSB0aHJvdWdoIHNjcmVlbkNvbnRyb2xsZXIuXG4gIDQuIENvbXB1dGVyIFBsYXllciBhdHRhY2tzLlxuICA1LiBVcGRhdGUgSHVtYW4gUGxheWVyIGJvYXJkIFVJLlxuICA2LiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3ZlclxuICAgIGlmIG5vdCwgbG9vcCBiYWNrIHRvIHN0ZXAgMi5cbiAgICBpZiBvdmVyLCBkaXNwbGF5IGEgbWVzc2FnZSBhbmQgc3RvcCBwbGF5ZXIgZnJvbSBjbGlja2luZyBvbiBib2FyZC5cbiAgKi9cblxuICBwbGFjZUNvbXB1dGVyU2hpcHMoKTtcblxuICByZXR1cm4ge1xuICAgIGdldCBodW1hblBsYXllcigpIHtcbiAgICAgIHJldHVybiBodW1hblBsYXllcjtcbiAgICB9LFxuICAgIGdldCBjb21wdXRlclBsYXllcigpIHtcbiAgICAgIHJldHVybiBjb21wdXRlclBsYXllcjtcbiAgICB9LFxuICAgIHBsYXlUdXJuLFxuICAgIGdhbWVPdmVyLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImNvbnN0IGdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgY29uc3Qgcm93ID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjZWxsID0geyBpc0hpdDogZmFsc2UsIHNoaXBPYmo6IG51bGwgfTtcbiAgICAgIHJvdy5wdXNoKGNlbGwpO1xuICAgIH1cbiAgICBib2FyZC5wdXNoKHJvdyk7XG4gIH1cbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBmdW5jdGlvbiBjaGVja0Nvb3JkaW5hdGVzKGxlbmd0aCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IG5ld1JvdyA9IHJvdztcbiAgICBsZXQgbmV3Q29sID0gY29sO1xuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBuZXdSb3cgKz0gbGVuZ3RoIC0gMTtcbiAgICAgIGlmIChuZXdSb3cgPCAwIHx8IG5ld1JvdyA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgIG5ld1JvdyA9IHJvdztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW25ld1Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbmV3Um93ICs9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIG5ld0NvbCArPSBsZW5ndGggLSAxO1xuICAgICAgaWYgKG5ld0NvbCA8IDAgfHwgbmV3Q29sID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgbmV3Q29sID0gY29sO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYm9hcmRbcm93XVtuZXdDb2xdLnNoaXBPYmogIT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCBvcmllbnRhdGlvbikge1xuICAgIGlmIChjaGVja0Nvb3JkaW5hdGVzKHNoaXAubGVuZ3RoLCByb3csIGNvbCwgb3JpZW50YXRpb24pID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBsZXQgbmV3Um93ID0gcm93O1xuICAgIGxldCBuZXdDb2wgPSBjb2w7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkW25ld1Jvd11bY29sXS5zaGlwT2JqID0gc2hpcDtcbiAgICAgICAgbmV3Um93ICs9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZFtyb3ddW25ld0NvbF0uc2hpcE9iaiA9IHNoaXA7XG4gICAgICAgIG5ld0NvbCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcImhlXCIpO1xuICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgY29uc29sZS5sb2coc2hpcHMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhyb3csIGNvbCkge1xuICAgIGlmIChyb3cgPiA5IHx8IHJvdyA8IDAgfHwgY29sID4gOSB8fCBjb2wgPCAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdLmlzSGl0KSByZXR1cm4gZmFsc2U7XG5cbiAgICBib2FyZFtyb3ddW2NvbF0uaXNIaXQgPSB0cnVlO1xuXG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHtcbiAgICAgIGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqLmhpdCgpO1xuICAgICAgcmV0dXJuIFwiaGl0XCI7XG4gICAgfVxuICAgIHJldHVybiBcIm1pc3NcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrQWxsU2hpcHNTdW5rKCkge1xuICAgIGlmIChzaGlwcy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5zdW5rID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0IGJvYXJkKCkge1xuICAgICAgLy8gc2hvdWxkIHByb2JhYmx5IGJlIHByaXZhdGUuXG4gICAgICByZXR1cm4gYm9hcmQ7XG4gICAgfSxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBjaGVja0FsbFNoaXBzU3VuayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVib2FyZDtcbiIsImltcG9ydCBnYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmNvbnN0IHBsYXllciA9ICgpID0+IHtcbiAgY29uc3QgZ0JvYXJkID0gZ2FtZWJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gYXR0YWNrKHJvdywgY29sLCBlbmVteSkge1xuICAgIHJldHVybiBlbmVteS5nQm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG4gIH1cblxuICAvLyBGb3IgY29tcHV0ZXIgcGxheWVycyBvbmx5XG4gIGNvbnN0IHZhbGlkRW5lbXlDZWxscyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBbXTtcbiAgICAgIGNlbGwucHVzaChpKTtcbiAgICAgIGNlbGwucHVzaChqKTtcbiAgICAgIHZhbGlkRW5lbXlDZWxscy5wdXNoKGNlbGwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbUF0dGFjayhlbmVteSkge1xuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkRW5lbXlDZWxscy5sZW5ndGgpXTtcbiAgICBjb25zdCByYW5kb21DZWxsID0gdmFsaWRFbmVteUNlbGxzW3JhbmRvbUluZGV4XTtcbiAgICB2YWxpZEVuZW15Q2VsbHMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgICByZXR1cm4gYXR0YWNrKHJhbmRvbUNlbGxbMF0sIHJhbmRvbUNlbGxbMV0sIGVuZW15KTtcbiAgfVxuICAvL1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IGdCb2FyZCgpIHtcbiAgICAgIHJldHVybiBnQm9hcmQ7XG4gICAgfSxcbiAgICBhdHRhY2ssXG4gICAgcmFuZG9tQXR0YWNrLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcGxheWVyO1xuIiwiY29uc3Qgc2hpcCA9IChsZW5ndGgpID0+IHtcbiAgbGV0IHRpbWVzSGl0ID0gMDtcbiAgbGV0IHN1bmsgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBpc1N1bmsoKSB7XG4gICAgaWYgKGxlbmd0aCA8PSB0aW1lc0hpdCkge1xuICAgICAgc3VuayA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGl0KCkge1xuICAgIHRpbWVzSGl0ICs9IDE7XG4gICAgaXNTdW5rKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldCBsZW5ndGgoKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH0sXG4gICAgZ2V0IHRpbWVzSGl0KCkge1xuICAgICAgcmV0dXJuIHRpbWVzSGl0O1xuICAgIH0sXG4gICAgZ2V0IHN1bmsoKSB7XG4gICAgICByZXR1cm4gc3VuaztcbiAgICB9LFxuICAgIGhpdCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNoaXA7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5cbmNvbnN0IHNjcmVlbkNvbnRyb2xsZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVDb250cm9sbGVyID0gZ2FtZSgpO1xuXG4gIC8vIENhY2hlIERPTVxuICBjb25zdCBlbmVteUNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbmVteVwiKTtcbiAgY29uc3QgZGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGlzcGxheVwiKTtcblxuICBmdW5jdGlvbiBlbXB0eUNlbGxIaXQoY2VsbCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG4gIH1cblxuICBmdW5jdGlvbiBvY2N1cGllZENlbGxIaXQoY2VsbCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckJvYXJkKHBsYXllcikge1xuICAgIGxldCBib2FyZE51bWJlciA9IDA7XG4gICAgaWYgKHBsYXllciA9PT0gZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIpIGJvYXJkTnVtYmVyID0gMTtcblxuICAgIGNvbnN0IGJvYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYm9hcmRcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uaXNIaXQgPT09IHRydWUgJiZcbiAgICAgICAgICBwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLnNoaXBPYmogIT0gbnVsbFxuICAgICAgICApIHtcbiAgICAgICAgICBvY2N1cGllZENlbGxIaXQoYm9hcmRzW2Ake2JvYXJkTnVtYmVyfWBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdKTtcbiAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLmlzSGl0ID09PSB0cnVlKSB7XG4gICAgICAgICAgZW1wdHlDZWxsSGl0KGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1bmJpbmRDb250cm9scygpIHtcbiAgICBlbmVteUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGF0dGFja0NlbGwpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYmluZENvbnRyb2xzKCkge1xuICAgIGVuZW15Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXR0YWNrQ2VsbCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KHBsYXllciwgcmVzdWx0KSB7XG4gICAgaWYgKHJlc3VsdCA9PT0gXCJodW1hbldpblwiKVxuICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIkFsbCB5b3VyIG9wcG9uZW50J3Mgc2hpcHMgaGF2ZSBiZWVuIHN1bmshIFlvdSB3aW4hXCI7XG4gICAgZWxzZSBpZiAocmVzdWx0ID09PSBcImNvbXB1dGVyV2luXCIpXG4gICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiQWxsIHlvdXIgc2hpcCdzIGhhdmUgYmVlbiBzdW5rISBZb3UgbG9zZSFcIjtcblxuICAgIGlmIChwbGF5ZXIgPT09IGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyKSB7XG4gICAgICBpZiAocmVzdWx0ID09PSBcIm1pc3NcIikgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdSBtaXNzZWQhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3UgaGl0IGEgc2hpcCFcIjtcbiAgICB9IGVsc2UgaWYgKHBsYXllciA9PT0gZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIpIHtcbiAgICAgIGlmIChyZXN1bHQgPT09IFwibWlzc1wiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91ciBvcHBvbmVudCBtaXNzZWQhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpXG4gICAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IGhpdCBhIHNoaXAhXCI7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYXR0YWNrQ2VsbCgpIHtcbiAgICBjb25zdCBwbGF5VHVyblJlc3VsdCA9IGdhbWVDb250cm9sbGVyLnBsYXlUdXJuKFxuICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRhdGFzZXQucm93LFxuICAgICAgdGhpcy5kYXRhc2V0LmNvbFxuICAgICk7XG4gICAgaWYgKHBsYXlUdXJuUmVzdWx0ID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIHJlbmRlckJvYXJkKGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyKTtcbiAgICB1bmJpbmRDb250cm9scygpO1xuICAgIGlmIChwbGF5VHVyblJlc3VsdFsyXSA9PT0gXCJodW1hbldpblwiKSB7XG4gICAgICB1cGRhdGVEaXNwbGF5KGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyLCBwbGF5VHVyblJlc3VsdFsyXSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzBdKTtcblxuICAgIC8vIHNldCBhIGRlbGF5IGJlZm9yZSB0aGUgY29tcHV0ZXIncyBhY3Rpb24gaXMgZGlzcGxheWVkLlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIpO1xuICAgICAgaWYgKHBsYXlUdXJuUmVzdWx0WzJdID09PSBcImNvbXB1dGVyV2luXCIpIHtcbiAgICAgICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllciwgcGxheVR1cm5SZXN1bHRbMl0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBiaW5kQ29udHJvbHMoKTtcbiAgICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzFdKTtcbiAgICB9LCAyMDAwKTtcbiAgfVxuXG4gIGJpbmRDb250cm9scygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2NyZWVuQ29udHJvbGxlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHNjcmVlbkNvbnRyb2xsZXIgZnJvbSBcIi4vc2NyZWVuQ29udHJvbGxlclwiO1xuXG5zY3JlZW5Db250cm9sbGVyKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=