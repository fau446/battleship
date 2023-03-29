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

    if (board[row][col].shipObj != null) {
      board[row][col].shipObj.hit();
    }
    board[row][col].isHit = true;
    return true;
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

  function attackCell() {
    if (
      gameController.playTurn(
        this.parentElement.dataset.row,
        this.dataset.col
      ) === false
    )
      return;
    renderBoard(gameController.computerPlayer);
    // unbinds cell clicking
    unbindControls();
    // display updates depending on hit or miss.
    setTimeout(() => {
      renderBoard(gameController.humanPlayer);
      // rebinds cell clicking
      bindControls();
      // display updates depending on hit or miss.
    }, 2000);
    // renderBoard(gameController.humanPlayer);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTmtEOztBQUVsRCw2REFBZ0IiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyZWVuQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGxheWVyIGZyb20gXCIuL21vZHVsZXMvcGxheWVyXCI7XG5cbmNvbnN0IGdhbWUgPSAoKSA9PiB7XG4gIC8vIHNldHVwIGh1bWFuIGFuZCBjb21wdXRlciBwbGF5ZXJzXG4gIGNvbnN0IGh1bWFuUGxheWVyID0gcGxheWVyKCk7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gcGxheWVyKCk7XG5cbiAgLy8gZnVuY3Rpb24gc2V0dXBHYW1lLCBhbGxvd3MgdGhlIGh1bWFuIHBsYXllciB0byBwbGFjZSBzaGlwcyBhbmQgYXV0b21hdGljYWxseSBwbGFjZXMgY29tcHV0ZXIgc2hpcHMuXG5cbiAgZnVuY3Rpb24gcGxheVR1cm4ocm93LCBjb2wpIHtcbiAgICBpZiAoaHVtYW5QbGF5ZXIuYXR0YWNrKHJvdywgY29sLCBjb21wdXRlclBsYXllcikgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgY29tcHV0ZXJQbGF5ZXIucmFuZG9tQXR0YWNrKGh1bWFuUGxheWVyKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdhbWVPdmVyKCkge1xuICAgIGlmIChodW1hblBsYXllci5nQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmspIHtcbiAgICAgIHJldHVybiBodW1hblBsYXllcjtcbiAgICB9XG4gICAgaWYgKGNvbXB1dGVyUGxheWVyLmdCb2FyZC5jaGVja0FsbFNoaXBzU3Vuaykge1xuICAgICAgcmV0dXJuIGNvbXB1dGVyUGxheWVyO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKlxuICAxLiBDbGljayBvbiBzdGFydCBnYW1lLlxuICAyLiBIdW1hbiBwbGF5ZXIgZ29lcyBmaXJzdCwgY2xpY2tzIG9uIGEgY2VsbCBvbiB0aGUgZW5lbXkgYm9hcmQgdG8gYXR0YWNrLlxuICAgIHNjcmVlbkNvbnRyb2xsZXIgY2FsbHMgYSBmdW5jdGlvbiBpbiBnYW1lIG1vZHVsZSB0byBhdHRhY2suXG4gIDMuIENoZWNrcyBpZiBpdCdzIGEgaGl0LCB1cGRhdGVzIHRoZSBjb21wdXRlciBwbGF5ZXIncyBib2FyZCBVSSB0aHJvdWdoIHNjcmVlbkNvbnRyb2xsZXIuXG4gIDQuIENvbXB1dGVyIFBsYXllciBhdHRhY2tzLlxuICA1LiBVcGRhdGUgSHVtYW4gUGxheWVyIGJvYXJkIFVJLlxuICA2LiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3ZlclxuICAgIGlmIG5vdCwgbG9vcCBiYWNrIHRvIHN0ZXAgMi5cbiAgICBpZiBvdmVyLCBkaXNwbGF5IGEgbWVzc2FnZSBhbmQgc3RvcCBwbGF5ZXIgZnJvbSBjbGlja2luZyBvbiBib2FyZC5cbiAgKi9cblxuICByZXR1cm4ge1xuICAgIGdldCBodW1hblBsYXllcigpIHtcbiAgICAgIHJldHVybiBodW1hblBsYXllcjtcbiAgICB9LFxuICAgIGdldCBjb21wdXRlclBsYXllcigpIHtcbiAgICAgIHJldHVybiBjb21wdXRlclBsYXllcjtcbiAgICB9LFxuICAgIHBsYXlUdXJuLFxuICAgIGdhbWVPdmVyLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImNvbnN0IGdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgY29uc3Qgcm93ID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjZWxsID0geyBpc0hpdDogZmFsc2UsIHNoaXBPYmo6IG51bGwgfTtcbiAgICAgIHJvdy5wdXNoKGNlbGwpO1xuICAgIH1cbiAgICBib2FyZC5wdXNoKHJvdyk7XG4gIH1cbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBmdW5jdGlvbiBjaGVja0Nvb3JkaW5hdGVzKGxlbmd0aCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IG5ld1JvdyA9IHJvdztcbiAgICBsZXQgbmV3Q29sID0gY29sO1xuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBuZXdSb3cgKz0gbGVuZ3RoIC0gMTtcbiAgICAgIGlmIChuZXdSb3cgPCAwIHx8IG5ld1JvdyA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgIG5ld1JvdyA9IHJvdztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW25ld1Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbmV3Um93ICs9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIG5ld0NvbCArPSBsZW5ndGggLSAxO1xuICAgICAgaWYgKG5ld0NvbCA8IDAgfHwgbmV3Q29sID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgbmV3Q29sID0gY29sO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYm9hcmRbcm93XVtuZXdDb2xdLnNoaXBPYmogIT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCBvcmllbnRhdGlvbikge1xuICAgIGlmIChjaGVja0Nvb3JkaW5hdGVzKHNoaXAubGVuZ3RoLCByb3csIGNvbCwgb3JpZW50YXRpb24pID09PSBmYWxzZSkgcmV0dXJuO1xuICAgIGxldCBuZXdSb3cgPSByb3c7XG4gICAgbGV0IG5ld0NvbCA9IGNvbDtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm9hcmRbbmV3Um93XVtjb2xdLnNoaXBPYmogPSBzaGlwO1xuICAgICAgICBuZXdSb3cgKz0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkW3Jvd11bbmV3Q29sXS5zaGlwT2JqID0gc2hpcDtcbiAgICAgICAgbmV3Q29sICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHJvdywgY29sKSB7XG4gICAgaWYgKHJvdyA+IDkgfHwgcm93IDwgMCB8fCBjb2wgPiA5IHx8IGNvbCA8IDApIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChib2FyZFtyb3ddW2NvbF0uaXNIaXQpIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChib2FyZFtyb3ddW2NvbF0uc2hpcE9iaiAhPSBudWxsKSB7XG4gICAgICBib2FyZFtyb3ddW2NvbF0uc2hpcE9iai5oaXQoKTtcbiAgICB9XG4gICAgYm9hcmRbcm93XVtjb2xdLmlzSGl0ID0gdHJ1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrQWxsU2hpcHNTdW5rKCkge1xuICAgIGlmIChzaGlwcy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5zdW5rID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0IGJvYXJkKCkge1xuICAgICAgLy8gc2hvdWxkIHByb2JhYmx5IGJlIHByaXZhdGUuXG4gICAgICByZXR1cm4gYm9hcmQ7XG4gICAgfSxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBjaGVja0FsbFNoaXBzU3VuayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVib2FyZDtcbiIsImltcG9ydCBnYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmNvbnN0IHBsYXllciA9ICgpID0+IHtcbiAgY29uc3QgZ0JvYXJkID0gZ2FtZWJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gYXR0YWNrKHJvdywgY29sLCBlbmVteSkge1xuICAgIC8vIGlmICh2YWxpZEF0dGFjayhyb3csIGNvbCwgZW5lbXkpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBlbmVteS5nQm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG4gIH1cblxuICAvLyBGb3IgY29tcHV0ZXIgcGxheWVycyBvbmx5XG4gIGNvbnN0IHZhbGlkRW5lbXlDZWxscyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBbXTtcbiAgICAgIGNlbGwucHVzaChpKTtcbiAgICAgIGNlbGwucHVzaChqKTtcbiAgICAgIHZhbGlkRW5lbXlDZWxscy5wdXNoKGNlbGwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbUF0dGFjayhlbmVteSkge1xuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkRW5lbXlDZWxscy5sZW5ndGgpXTtcbiAgICBjb25zdCByYW5kb21DZWxsID0gdmFsaWRFbmVteUNlbGxzW3JhbmRvbUluZGV4XTtcbiAgICB2YWxpZEVuZW15Q2VsbHMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgICByZXR1cm4gYXR0YWNrKHJhbmRvbUNlbGxbMF0sIHJhbmRvbUNlbGxbMV0sIGVuZW15KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0IGdCb2FyZCgpIHtcbiAgICAgIHJldHVybiBnQm9hcmQ7XG4gICAgfSxcbiAgICBhdHRhY2ssXG4gICAgcmFuZG9tQXR0YWNrLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcGxheWVyO1xuIiwiaW1wb3J0IGdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xuXG5jb25zdCBzY3JlZW5Db250cm9sbGVyID0gKCkgPT4ge1xuICBjb25zdCBnYW1lQ29udHJvbGxlciA9IGdhbWUoKTtcblxuICAvLyBDYWNoZSBET01cbiAgY29uc3QgZW5lbXlDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW5lbXlcIik7XG5cbiAgZnVuY3Rpb24gZW1wdHlDZWxsSGl0KGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2NjdXBpZWRDZWxsSGl0KGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJCb2FyZChwbGF5ZXIpIHtcbiAgICBsZXQgYm9hcmROdW1iZXIgPSAwO1xuICAgIGlmIChwbGF5ZXIgPT09IGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyKSBib2FyZE51bWJlciA9IDE7XG5cbiAgICBjb25zdCBib2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJvYXJkXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLmlzSGl0ID09PSB0cnVlICYmXG4gICAgICAgICAgcGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5zaGlwT2JqICE9IG51bGxcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2NjdXBpZWRDZWxsSGl0KGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH0gZWxzZSBpZiAocGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5pc0hpdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGVtcHR5Q2VsbEhpdChib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdW5iaW5kQ29udHJvbHMoKSB7XG4gICAgZW5lbXlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2tDZWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJpbmRDb250cm9scygpIHtcbiAgICBlbmVteUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGF0dGFja0NlbGwpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gYXR0YWNrQ2VsbCgpIHtcbiAgICBpZiAoXG4gICAgICBnYW1lQ29udHJvbGxlci5wbGF5VHVybihcbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmRhdGFzZXQucm93LFxuICAgICAgICB0aGlzLmRhdGFzZXQuY29sXG4gICAgICApID09PSBmYWxzZVxuICAgIClcbiAgICAgIHJldHVybjtcbiAgICByZW5kZXJCb2FyZChnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcik7XG4gICAgLy8gdW5iaW5kcyBjZWxsIGNsaWNraW5nXG4gICAgdW5iaW5kQ29udHJvbHMoKTtcbiAgICAvLyBkaXNwbGF5IHVwZGF0ZXMgZGVwZW5kaW5nIG9uIGhpdCBvciBtaXNzLlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIpO1xuICAgICAgLy8gcmViaW5kcyBjZWxsIGNsaWNraW5nXG4gICAgICBiaW5kQ29udHJvbHMoKTtcbiAgICAgIC8vIGRpc3BsYXkgdXBkYXRlcyBkZXBlbmRpbmcgb24gaGl0IG9yIG1pc3MuXG4gICAgfSwgMjAwMCk7XG4gICAgLy8gcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIpO1xuICB9XG5cbiAgYmluZENvbnRyb2xzKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzY3JlZW5Db250cm9sbGVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgc2NyZWVuQ29udHJvbGxlciBmcm9tIFwiLi9zY3JlZW5Db250cm9sbGVyXCI7XG5cbnNjcmVlbkNvbnRyb2xsZXIoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==