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

  function attackCell() {
    if (
      gameController.playTurn(
        this.parentElement.dataset.row,
        this.dataset.col
      ) === false
    )
      return;
    renderBoard(gameController.computerPlayer);
    renderBoard(gameController.humanPlayer);
  }

  enemyCells.forEach((cell) => {
    cell.addEventListener("click", attackCell);
  });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Y2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JlZW5Db250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwbGF5ZXIgZnJvbSBcIi4vbW9kdWxlcy9wbGF5ZXJcIjtcblxuY29uc3QgZ2FtZSA9ICgpID0+IHtcbiAgLy8gc2V0dXAgaHVtYW4gYW5kIGNvbXB1dGVyIHBsYXllcnNcbiAgY29uc3QgaHVtYW5QbGF5ZXIgPSBwbGF5ZXIoKTtcbiAgY29uc3QgY29tcHV0ZXJQbGF5ZXIgPSBwbGF5ZXIoKTtcblxuICAvLyBmdW5jdGlvbiBzZXR1cEdhbWUsIGFsbG93cyB0aGUgaHVtYW4gcGxheWVyIHRvIHBsYWNlIHNoaXBzIGFuZCBhdXRvbWF0aWNhbGx5IHBsYWNlcyBjb21wdXRlciBzaGlwcy5cblxuICBmdW5jdGlvbiBwbGF5VHVybihyb3csIGNvbCkge1xuICAgIGlmIChodW1hblBsYXllci5hdHRhY2socm93LCBjb2wsIGNvbXB1dGVyUGxheWVyKSA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICBjb21wdXRlclBsYXllci5yYW5kb21BdHRhY2soaHVtYW5QbGF5ZXIpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgaWYgKGh1bWFuUGxheWVyLmdCb2FyZC5jaGVja0FsbFNoaXBzU3Vuaykge1xuICAgICAgcmV0dXJuIGh1bWFuUGxheWVyO1xuICAgIH1cbiAgICBpZiAoY29tcHV0ZXJQbGF5ZXIuZ0JvYXJkLmNoZWNrQWxsU2hpcHNTdW5rKSB7XG4gICAgICByZXR1cm4gY29tcHV0ZXJQbGF5ZXI7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qXG4gIDEuIENsaWNrIG9uIHN0YXJ0IGdhbWUuXG4gIDIuIEh1bWFuIHBsYXllciBnb2VzIGZpcnN0LCBjbGlja3Mgb24gYSBjZWxsIG9uIHRoZSBlbmVteSBib2FyZCB0byBhdHRhY2suXG4gICAgc2NyZWVuQ29udHJvbGxlciBjYWxscyBhIGZ1bmN0aW9uIGluIGdhbWUgbW9kdWxlIHRvIGF0dGFjay5cbiAgMy4gQ2hlY2tzIGlmIGl0J3MgYSBoaXQsIHVwZGF0ZXMgdGhlIGNvbXB1dGVyIHBsYXllcidzIGJvYXJkIFVJIHRocm91Z2ggc2NyZWVuQ29udHJvbGxlci5cbiAgNC4gQ29tcHV0ZXIgUGxheWVyIGF0dGFja3MuXG4gIDUuIFVwZGF0ZSBIdW1hbiBQbGF5ZXIgYm9hcmQgVUkuXG4gIDYuIENoZWNrcyBpZiB0aGUgZ2FtZSBpcyBvdmVyXG4gICAgaWYgbm90LCBsb29wIGJhY2sgdG8gc3RlcCAyLlxuICAgIGlmIG92ZXIsIGRpc3BsYXkgYSBtZXNzYWdlIGFuZCBzdG9wIHBsYXllciBmcm9tIGNsaWNraW5nIG9uIGJvYXJkLlxuICAqL1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IGh1bWFuUGxheWVyKCkge1xuICAgICAgcmV0dXJuIGh1bWFuUGxheWVyO1xuICAgIH0sXG4gICAgZ2V0IGNvbXB1dGVyUGxheWVyKCkge1xuICAgICAgcmV0dXJuIGNvbXB1dGVyUGxheWVyO1xuICAgIH0sXG4gICAgcGxheVR1cm4sXG4gICAgZ2FtZU92ZXIsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xuIiwiY29uc3QgZ2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICBjb25zdCByb3cgPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSB7IGlzSGl0OiBmYWxzZSwgc2hpcE9iajogbnVsbCB9O1xuICAgICAgcm93LnB1c2goY2VsbCk7XG4gICAgfVxuICAgIGJvYXJkLnB1c2gocm93KTtcbiAgfVxuICBjb25zdCBzaGlwcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGNoZWNrQ29vcmRpbmF0ZXMobGVuZ3RoLCByb3csIGNvbCwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgbmV3Um93ID0gcm93O1xuICAgIGxldCBuZXdDb2wgPSBjb2w7XG4gICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgIG5ld1JvdyArPSBsZW5ndGggLSAxO1xuICAgICAgaWYgKG5ld1JvdyA8IDAgfHwgbmV3Um93ID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgbmV3Um93ID0gcm93O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYm9hcmRbbmV3Um93XVtjb2xdLnNoaXBPYmogIT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBuZXdSb3cgKz0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgbmV3Q29sICs9IGxlbmd0aCAtIDE7XG4gICAgICBpZiAobmV3Q29sIDwgMCB8fCBuZXdDb2wgPiA5KSByZXR1cm4gZmFsc2U7XG4gICAgICBuZXdDb2wgPSBjb2w7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChib2FyZFtyb3ddW25ld0NvbF0uc2hpcE9iaiAhPSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSB7XG4gICAgaWYgKGNoZWNrQ29vcmRpbmF0ZXMoc2hpcC5sZW5ndGgsIHJvdywgY29sLCBvcmllbnRhdGlvbikgPT09IGZhbHNlKSByZXR1cm47XG4gICAgbGV0IG5ld1JvdyA9IHJvdztcbiAgICBsZXQgbmV3Q29sID0gY29sO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZFtuZXdSb3ddW2NvbF0uc2hpcE9iaiA9IHNoaXA7XG4gICAgICAgIG5ld1JvdyArPSAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm9hcmRbcm93XVtuZXdDb2xdLnNoaXBPYmogPSBzaGlwO1xuICAgICAgICBuZXdDb2wgKz0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcHMucHVzaChzaGlwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlY2VpdmVBdHRhY2socm93LCBjb2wpIHtcbiAgICBpZiAocm93ID4gOSB8fCByb3cgPCAwIHx8IGNvbCA+IDkgfHwgY29sIDwgMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXS5pc0hpdCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHtcbiAgICAgIGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqLmhpdCgpO1xuICAgIH1cbiAgICBib2FyZFtyb3ddW2NvbF0uaXNIaXQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tBbGxTaGlwc1N1bmsoKSB7XG4gICAgaWYgKHNoaXBzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNoaXBzW2ldLnN1bmsgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgYm9hcmQoKSB7XG4gICAgICAvLyBzaG91bGQgcHJvYmFibHkgYmUgcHJpdmF0ZS5cbiAgICAgIHJldHVybiBib2FyZDtcbiAgICB9LFxuICAgIHBsYWNlU2hpcCxcbiAgICByZWNlaXZlQXR0YWNrLFxuICAgIGNoZWNrQWxsU2hpcHNTdW5rLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZWJvYXJkO1xuIiwiaW1wb3J0IGdhbWVib2FyZCBmcm9tIFwiLi9nYW1lYm9hcmRcIjtcblxuY29uc3QgcGxheWVyID0gKCkgPT4ge1xuICBjb25zdCBnQm9hcmQgPSBnYW1lYm9hcmQoKTtcblxuICBmdW5jdGlvbiBhdHRhY2socm93LCBjb2wsIGVuZW15KSB7XG4gICAgLy8gaWYgKHZhbGlkQXR0YWNrKHJvdywgY29sLCBlbmVteSkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGVuZW15LmdCb2FyZC5yZWNlaXZlQXR0YWNrKHJvdywgY29sKTtcbiAgfVxuXG4gIC8vIEZvciBjb21wdXRlciBwbGF5ZXJzIG9ubHlcbiAgY29uc3QgdmFsaWRFbmVteUNlbGxzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgY29uc3QgY2VsbCA9IFtdO1xuICAgICAgY2VsbC5wdXNoKGkpO1xuICAgICAgY2VsbC5wdXNoKGopO1xuICAgICAgdmFsaWRFbmVteUNlbGxzLnB1c2goY2VsbCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmFuZG9tQXR0YWNrKGVuZW15KSB7XG4gICAgY29uc3QgcmFuZG9tSW5kZXggPSBbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdmFsaWRFbmVteUNlbGxzLmxlbmd0aCldO1xuICAgIGNvbnN0IHJhbmRvbUNlbGwgPSB2YWxpZEVuZW15Q2VsbHNbcmFuZG9tSW5kZXhdO1xuICAgIHZhbGlkRW5lbXlDZWxscy5zcGxpY2UocmFuZG9tSW5kZXgsIDEpO1xuICAgIHJldHVybiBhdHRhY2socmFuZG9tQ2VsbFswXSwgcmFuZG9tQ2VsbFsxXSwgZW5lbXkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgZ0JvYXJkKCkge1xuICAgICAgcmV0dXJuIGdCb2FyZDtcbiAgICB9LFxuICAgIGF0dGFjayxcbiAgICByYW5kb21BdHRhY2ssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwbGF5ZXI7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5cbmNvbnN0IHNjcmVlbkNvbnRyb2xsZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVDb250cm9sbGVyID0gZ2FtZSgpO1xuXG4gIC8vIENhY2hlIERPTVxuICBjb25zdCBlbmVteUNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbmVteVwiKTtcblxuICBmdW5jdGlvbiBlbXB0eUNlbGxIaXQoY2VsbCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG4gIH1cblxuICBmdW5jdGlvbiBvY2N1cGllZENlbGxIaXQoY2VsbCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImhpdFwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbmRlckJvYXJkKHBsYXllcikge1xuICAgIGxldCBib2FyZE51bWJlciA9IDA7XG4gICAgaWYgKHBsYXllciA9PT0gZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIpIGJvYXJkTnVtYmVyID0gMTtcblxuICAgIGNvbnN0IGJvYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYm9hcmRcIik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uaXNIaXQgPT09IHRydWUgJiZcbiAgICAgICAgICBwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLnNoaXBPYmogIT0gbnVsbFxuICAgICAgICApIHtcbiAgICAgICAgICBvY2N1cGllZENlbGxIaXQoYm9hcmRzW2Ake2JvYXJkTnVtYmVyfWBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdKTtcbiAgICAgICAgfSBlbHNlIGlmIChwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLmlzSGl0ID09PSB0cnVlKSB7XG4gICAgICAgICAgZW1wdHlDZWxsSGl0KGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhdHRhY2tDZWxsKCkge1xuICAgIGlmIChcbiAgICAgIGdhbWVDb250cm9sbGVyLnBsYXlUdXJuKFxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGF0YXNldC5yb3csXG4gICAgICAgIHRoaXMuZGF0YXNldC5jb2xcbiAgICAgICkgPT09IGZhbHNlXG4gICAgKVxuICAgICAgcmV0dXJuO1xuICAgIHJlbmRlckJvYXJkKGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyKTtcbiAgICByZW5kZXJCb2FyZChnYW1lQ29udHJvbGxlci5odW1hblBsYXllcik7XG4gIH1cblxuICBlbmVteUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2tDZWxsKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzY3JlZW5Db250cm9sbGVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgc2NyZWVuQ29udHJvbGxlciBmcm9tIFwiLi9zY3JlZW5Db250cm9sbGVyXCI7XG5cbnNjcmVlbkNvbnRyb2xsZXIoKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==