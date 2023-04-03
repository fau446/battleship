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


const game = () => {
  // setup human and computer players
  const humanPlayer = (0,_modules_player__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const computerPlayer = (0,_modules_player__WEBPACK_IMPORTED_MODULE_0__["default"])();

  // function setupGame, allows the human player to place ships and automatically places computer ships.

  function playTurn(row, col) {
    const humanAttackResult = humanPlayer.attack(row, col, computerPlayer);
    if (humanAttackResult === false) return false;
    // if (gameOver()) return [humanAttackResult, null, "humanWin"];
    const computerAttackResult = computerPlayer.randomAttack(humanPlayer);
    if (gameOver())
      return [humanAttackResult, computerAttackResult, "computerWin"];
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
    if (checkCoordinates(ship.length, row, col, orientation) === false) return;
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
    // false
    // "hit"
    // "miss"
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (player);


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
    if (
      playTurnResult === false
      // false
      // ["miss", "hit"] object, key value pairs.
      // "humanWin"
      // "computerWin"
    )
      return;
    renderBoard(gameController.computerPlayer);
    unbindControls();
    if (playTurnResult[2] === "humanWin") {
      updateDisplay(gameController.humanPlayer, playTurnResult[2]);
      return;
    }
    // display updates depending on hit or miss.
    // could be "computerWin" at this point
    updateDisplay(gameController.humanPlayer, playTurnResult[0]);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtEOztBQUVsRCw2REFBZ0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyZWVuQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGxheWVyIGZyb20gXCIuL21vZHVsZXMvcGxheWVyXCI7XG5cbmNvbnN0IGdhbWUgPSAoKSA9PiB7XG4gIC8vIHNldHVwIGh1bWFuIGFuZCBjb21wdXRlciBwbGF5ZXJzXG4gIGNvbnN0IGh1bWFuUGxheWVyID0gcGxheWVyKCk7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gcGxheWVyKCk7XG5cbiAgLy8gZnVuY3Rpb24gc2V0dXBHYW1lLCBhbGxvd3MgdGhlIGh1bWFuIHBsYXllciB0byBwbGFjZSBzaGlwcyBhbmQgYXV0b21hdGljYWxseSBwbGFjZXMgY29tcHV0ZXIgc2hpcHMuXG5cbiAgZnVuY3Rpb24gcGxheVR1cm4ocm93LCBjb2wpIHtcbiAgICBjb25zdCBodW1hbkF0dGFja1Jlc3VsdCA9IGh1bWFuUGxheWVyLmF0dGFjayhyb3csIGNvbCwgY29tcHV0ZXJQbGF5ZXIpO1xuICAgIGlmIChodW1hbkF0dGFja1Jlc3VsdCA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICAvLyBpZiAoZ2FtZU92ZXIoKSkgcmV0dXJuIFtodW1hbkF0dGFja1Jlc3VsdCwgbnVsbCwgXCJodW1hbldpblwiXTtcbiAgICBjb25zdCBjb21wdXRlckF0dGFja1Jlc3VsdCA9IGNvbXB1dGVyUGxheWVyLnJhbmRvbUF0dGFjayhodW1hblBsYXllcik7XG4gICAgaWYgKGdhbWVPdmVyKCkpXG4gICAgICByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgXCJjb21wdXRlcldpblwiXTtcbiAgICByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgZmFsc2VdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgaWYgKFxuICAgICAgaHVtYW5QbGF5ZXIuZ0JvYXJkLmNoZWNrQWxsU2hpcHNTdW5rIHx8XG4gICAgICBjb21wdXRlclBsYXllci5nQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmtcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKlxuICAxLiBDbGljayBvbiBzdGFydCBnYW1lLlxuICAyLiBIdW1hbiBwbGF5ZXIgZ29lcyBmaXJzdCwgY2xpY2tzIG9uIGEgY2VsbCBvbiB0aGUgZW5lbXkgYm9hcmQgdG8gYXR0YWNrLlxuICAgIHNjcmVlbkNvbnRyb2xsZXIgY2FsbHMgYSBmdW5jdGlvbiBpbiBnYW1lIG1vZHVsZSB0byBhdHRhY2suXG4gIDMuIENoZWNrcyBpZiBpdCdzIGEgaGl0LCB1cGRhdGVzIHRoZSBjb21wdXRlciBwbGF5ZXIncyBib2FyZCBVSSB0aHJvdWdoIHNjcmVlbkNvbnRyb2xsZXIuXG4gIDQuIENvbXB1dGVyIFBsYXllciBhdHRhY2tzLlxuICA1LiBVcGRhdGUgSHVtYW4gUGxheWVyIGJvYXJkIFVJLlxuICA2LiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3ZlclxuICAgIGlmIG5vdCwgbG9vcCBiYWNrIHRvIHN0ZXAgMi5cbiAgICBpZiBvdmVyLCBkaXNwbGF5IGEgbWVzc2FnZSBhbmQgc3RvcCBwbGF5ZXIgZnJvbSBjbGlja2luZyBvbiBib2FyZC5cbiAgKi9cblxuICByZXR1cm4ge1xuICAgIGdldCBodW1hblBsYXllcigpIHtcbiAgICAgIHJldHVybiBodW1hblBsYXllcjtcbiAgICB9LFxuICAgIGdldCBjb21wdXRlclBsYXllcigpIHtcbiAgICAgIHJldHVybiBjb21wdXRlclBsYXllcjtcbiAgICB9LFxuICAgIHBsYXlUdXJuLFxuICAgIGdhbWVPdmVyLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImNvbnN0IGdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgY29uc3Qgcm93ID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjZWxsID0geyBpc0hpdDogZmFsc2UsIHNoaXBPYmo6IG51bGwgfTtcbiAgICAgIHJvdy5wdXNoKGNlbGwpO1xuICAgIH1cbiAgICBib2FyZC5wdXNoKHJvdyk7XG4gIH1cbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBmdW5jdGlvbiBjaGVja0Nvb3JkaW5hdGVzKGxlbmd0aCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IG5ld1JvdyA9IHJvdztcbiAgICBsZXQgbmV3Q29sID0gY29sO1xuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBuZXdSb3cgKz0gbGVuZ3RoIC0gMTtcbiAgICAgIGlmIChuZXdSb3cgPCAwIHx8IG5ld1JvdyA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgIG5ld1JvdyA9IHJvdztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW25ld1Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbmV3Um93ICs9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIG5ld0NvbCArPSBsZW5ndGggLSAxO1xuICAgICAgaWYgKG5ld0NvbCA8IDAgfHwgbmV3Q29sID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgbmV3Q29sID0gY29sO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYm9hcmRbcm93XVtuZXdDb2xdLnNoaXBPYmogIT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCBvcmllbnRhdGlvbikge1xuICAgIGlmIChjaGVja0Nvb3JkaW5hdGVzKHNoaXAubGVuZ3RoLCByb3csIGNvbCwgb3JpZW50YXRpb24pID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIGxldCBuZXdSb3cgPSByb3c7XG4gICAgbGV0IG5ld0NvbCA9IGNvbDtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm9hcmRbbmV3Um93XVtjb2xdLnNoaXBPYmogPSBzaGlwO1xuICAgICAgICBuZXdSb3cgKz0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkW3Jvd11bbmV3Q29sXS5zaGlwT2JqID0gc2hpcDtcbiAgICAgICAgbmV3Q29sICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHJvdywgY29sKSB7XG4gICAgaWYgKHJvdyA+IDkgfHwgcm93IDwgMCB8fCBjb2wgPiA5IHx8IGNvbCA8IDApIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChib2FyZFtyb3ddW2NvbF0uaXNIaXQpIHJldHVybiBmYWxzZTtcblxuICAgIGJvYXJkW3Jvd11bY29sXS5pc0hpdCA9IHRydWU7XG5cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdLnNoaXBPYmogIT0gbnVsbCkge1xuICAgICAgYm9hcmRbcm93XVtjb2xdLnNoaXBPYmouaGl0KCk7XG4gICAgICByZXR1cm4gXCJoaXRcIjtcbiAgICB9XG4gICAgcmV0dXJuIFwibWlzc1wiO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tBbGxTaGlwc1N1bmsoKSB7XG4gICAgaWYgKHNoaXBzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNoaXBzW2ldLnN1bmsgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgYm9hcmQoKSB7XG4gICAgICAvLyBzaG91bGQgcHJvYmFibHkgYmUgcHJpdmF0ZS5cbiAgICAgIHJldHVybiBib2FyZDtcbiAgICB9LFxuICAgIHBsYWNlU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGNoZWNrQWxsU2hpcHNTdW5rLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZWJvYXJkO1xuIiwiaW1wb3J0IGdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuY29uc3QgcGxheWVyID0gKCkgPT4ge1xuICBjb25zdCBnQm9hcmQgPSBnYW1lYm9hcmQoKTtcblxuICBmdW5jdGlvbiBhdHRhY2socm93LCBjb2wsIGVuZW15KSB7XG4gICAgLy8gZmFsc2VcbiAgICAvLyBcImhpdFwiXG4gICAgLy8gXCJtaXNzXCJcbiAgICByZXR1cm4gZW5lbXkuZ0JvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuICB9XG5cbiAgLy8gRm9yIGNvbXB1dGVyIHBsYXllcnMgb25seVxuICBjb25zdCB2YWxpZEVuZW15Q2VsbHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjZWxsID0gW107XG4gICAgICBjZWxsLnB1c2goaSk7XG4gICAgICBjZWxsLnB1c2goaik7XG4gICAgICB2YWxpZEVuZW15Q2VsbHMucHVzaChjZWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21BdHRhY2soZW5lbXkpIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZEVuZW15Q2VsbHMubGVuZ3RoKV07XG4gICAgY29uc3QgcmFuZG9tQ2VsbCA9IHZhbGlkRW5lbXlDZWxsc1tyYW5kb21JbmRleF07XG4gICAgdmFsaWRFbmVteUNlbGxzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gICAgcmV0dXJuIGF0dGFjayhyYW5kb21DZWxsWzBdLCByYW5kb21DZWxsWzFdLCBlbmVteSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldCBnQm9hcmQoKSB7XG4gICAgICByZXR1cm4gZ0JvYXJkO1xuICAgIH0sXG4gICAgYXR0YWNrLFxuICAgIHJhbmRvbUF0dGFjayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXllcjtcbiIsImltcG9ydCBnYW1lIGZyb20gXCIuL2dhbWVcIjtcblxuY29uc3Qgc2NyZWVuQ29udHJvbGxlciA9ICgpID0+IHtcbiAgY29uc3QgZ2FtZUNvbnRyb2xsZXIgPSBnYW1lKCk7XG5cbiAgLy8gQ2FjaGUgRE9NXG4gIGNvbnN0IGVuZW15Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVuZW15XCIpO1xuICBjb25zdCBkaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXNwbGF5XCIpO1xuXG4gIGZ1bmN0aW9uIGVtcHR5Q2VsbEhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9jY3VwaWVkQ2VsbEhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQm9hcmQocGxheWVyKSB7XG4gICAgbGV0IGJvYXJkTnVtYmVyID0gMDtcbiAgICBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcikgYm9hcmROdW1iZXIgPSAxO1xuXG4gICAgY29uc3QgYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib2FyZFwiKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgcGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5pc0hpdCA9PT0gdHJ1ZSAmJlxuICAgICAgICAgIHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uc2hpcE9iaiAhPSBudWxsXG4gICAgICAgICkge1xuICAgICAgICAgIG9jY3VwaWVkQ2VsbEhpdChib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0pO1xuICAgICAgICB9IGVsc2UgaWYgKHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uaXNIaXQgPT09IHRydWUpIHtcbiAgICAgICAgICBlbXB0eUNlbGxIaXQoYm9hcmRzW2Ake2JvYXJkTnVtYmVyfWBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVuYmluZENvbnRyb2xzKCkge1xuICAgIGVuZW15Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXR0YWNrQ2VsbCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kQ29udHJvbHMoKSB7XG4gICAgZW5lbXlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2tDZWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkocGxheWVyLCByZXN1bHQpIHtcbiAgICBpZiAocmVzdWx0ID09PSBcImh1bWFuV2luXCIpXG4gICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiQWxsIHlvdXIgb3Bwb25lbnQncyBzaGlwcyBoYXZlIGJlZW4gc3VuayEgWW91IHdpbiFcIjtcbiAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwiY29tcHV0ZXJXaW5cIilcbiAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJBbGwgeW91ciBzaGlwJ3MgaGF2ZSBiZWVuIHN1bmshIFlvdSBsb3NlIVwiO1xuXG4gICAgaWYgKHBsYXllciA9PT0gZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIpIHtcbiAgICAgIGlmIChyZXN1bHQgPT09IFwibWlzc1wiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91IG1pc3NlZCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJoaXRcIikgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdSBoaXQgYSBzaGlwIVwiO1xuICAgIH0gZWxzZSBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcikge1xuICAgICAgaWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IG1pc3NlZCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJoaXRcIilcbiAgICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdXIgb3Bwb25lbnQgaGl0IGEgc2hpcCFcIjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhdHRhY2tDZWxsKCkge1xuICAgIGNvbnN0IHBsYXlUdXJuUmVzdWx0ID0gZ2FtZUNvbnRyb2xsZXIucGxheVR1cm4oXG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGF0YXNldC5yb3csXG4gICAgICB0aGlzLmRhdGFzZXQuY29sXG4gICAgKTtcbiAgICBpZiAoXG4gICAgICBwbGF5VHVyblJlc3VsdCA9PT0gZmFsc2VcbiAgICAgIC8vIGZhbHNlXG4gICAgICAvLyBbXCJtaXNzXCIsIFwiaGl0XCJdIG9iamVjdCwga2V5IHZhbHVlIHBhaXJzLlxuICAgICAgLy8gXCJodW1hbldpblwiXG4gICAgICAvLyBcImNvbXB1dGVyV2luXCJcbiAgICApXG4gICAgICByZXR1cm47XG4gICAgcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIpO1xuICAgIHVuYmluZENvbnRyb2xzKCk7XG4gICAgaWYgKHBsYXlUdXJuUmVzdWx0WzJdID09PSBcImh1bWFuV2luXCIpIHtcbiAgICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzJdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZGlzcGxheSB1cGRhdGVzIGRlcGVuZGluZyBvbiBoaXQgb3IgbWlzcy5cbiAgICAvLyBjb3VsZCBiZSBcImNvbXB1dGVyV2luXCIgYXQgdGhpcyBwb2ludFxuICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzBdKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIpO1xuICAgICAgaWYgKHBsYXlUdXJuUmVzdWx0WzJdID09PSBcImNvbXB1dGVyV2luXCIpIHtcbiAgICAgICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllciwgcGxheVR1cm5SZXN1bHRbMl0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBiaW5kQ29udHJvbHMoKTtcbiAgICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzFdKTtcbiAgICB9LCAyMDAwKTtcbiAgfVxuXG4gIGJpbmRDb250cm9scygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2NyZWVuQ29udHJvbGxlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHNjcmVlbkNvbnRyb2xsZXIgZnJvbSBcIi4vc2NyZWVuQ29udHJvbGxlclwiO1xuXG5zY3JlZW5Db250cm9sbGVyKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=