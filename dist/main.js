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
    }, 500); // change back to 2000
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssUUFBUTtBQUNiOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWUsZ0JBQWdCLEVBQUM7Ozs7Ozs7VUNqR2hDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0Q7O0FBRWxELDZEQUFnQiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JlZW5Db250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwbGF5ZXIgZnJvbSBcIi4vbW9kdWxlcy9wbGF5ZXJcIjtcbmltcG9ydCBzaGlwIGZyb20gXCIuL21vZHVsZXMvc2hpcFwiO1xuXG5jb25zdCBnYW1lID0gKCkgPT4ge1xuICAvLyBzZXR1cCBodW1hbiBhbmQgY29tcHV0ZXIgcGxheWVyc1xuICBjb25zdCBodW1hblBsYXllciA9IHBsYXllcigpO1xuICBjb25zdCBjb21wdXRlclBsYXllciA9IHBsYXllcigpO1xuXG4gIC8vIGZ1bmN0aW9uIHNldHVwR2FtZSwgYWxsb3dzIHRoZSBodW1hbiBwbGF5ZXIgdG8gcGxhY2Ugc2hpcHMgYW5kIGF1dG9tYXRpY2FsbHkgcGxhY2VzIGNvbXB1dGVyIHNoaXBzLlxuXG4gIGZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJTaGlwcygpIHtcbiAgICBjb25zdCBjYXJyaWVyID0gc2hpcCg1KTtcbiAgICBjb25zdCBiYXR0bGVzaGlwID0gc2hpcCg0KTtcbiAgICBjb25zdCBkZXN0cm95ZXIgPSBzaGlwKDMpO1xuICAgIGNvbnN0IHN1Ym1hcmluZSA9IHNoaXAoMyk7XG4gICAgY29uc3QgcGF0cm9sQm9hdCA9IHNoaXAoMik7XG4gICAgY29uc3QgYm9hdHMgPSBbY2FycmllciwgYmF0dGxlc2hpcCwgZGVzdHJveWVyLCBzdWJtYXJpbmUsIHBhdHJvbEJvYXRdO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gW1wiaG9yaXpvbnRhbFwiLCBcInZlcnRpY2FsXCJdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib2F0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYm9hdCA9IGJvYXRzW2ldO1xuICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcHV0ZXJQbGF5ZXIuZ0JvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICBib2F0LFxuICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gICAgICAgICAgb3JpZW50YXRpb25bcmFuZG9tSW5kZXhdXG4gICAgICAgICkgPT09IGZhbHNlXG4gICAgICApXG4gICAgICAgIGktLTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5VHVybihyb3csIGNvbCkge1xuICAgIGNvbnN0IGh1bWFuQXR0YWNrUmVzdWx0ID0gaHVtYW5QbGF5ZXIuYXR0YWNrKHJvdywgY29sLCBjb21wdXRlclBsYXllcik7XG4gICAgaWYgKGh1bWFuQXR0YWNrUmVzdWx0ID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGlmIChnYW1lT3ZlcigpKSByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBudWxsLCBcImh1bWFuV2luXCJdO1xuICAgIGNvbnN0IGNvbXB1dGVyQXR0YWNrUmVzdWx0ID0gY29tcHV0ZXJQbGF5ZXIucmFuZG9tQXR0YWNrKGh1bWFuUGxheWVyKTtcbiAgICAvLyBpZiAoZ2FtZU92ZXIoKSlcbiAgICAvLyByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgXCJjb21wdXRlcldpblwiXTtcbiAgICByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgZmFsc2VdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgaWYgKFxuICAgICAgaHVtYW5QbGF5ZXIuZ0JvYXJkLmNoZWNrQWxsU2hpcHNTdW5rIHx8XG4gICAgICBjb21wdXRlclBsYXllci5nQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmtcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKlxuICAxLiBDbGljayBvbiBzdGFydCBnYW1lLlxuICAyLiBIdW1hbiBwbGF5ZXIgZ29lcyBmaXJzdCwgY2xpY2tzIG9uIGEgY2VsbCBvbiB0aGUgZW5lbXkgYm9hcmQgdG8gYXR0YWNrLlxuICAgIHNjcmVlbkNvbnRyb2xsZXIgY2FsbHMgYSBmdW5jdGlvbiBpbiBnYW1lIG1vZHVsZSB0byBhdHRhY2suXG4gIDMuIENoZWNrcyBpZiBpdCdzIGEgaGl0LCB1cGRhdGVzIHRoZSBjb21wdXRlciBwbGF5ZXIncyBib2FyZCBVSSB0aHJvdWdoIHNjcmVlbkNvbnRyb2xsZXIuXG4gIDQuIENvbXB1dGVyIFBsYXllciBhdHRhY2tzLlxuICA1LiBVcGRhdGUgSHVtYW4gUGxheWVyIGJvYXJkIFVJLlxuICA2LiBDaGVja3MgaWYgdGhlIGdhbWUgaXMgb3ZlclxuICAgIGlmIG5vdCwgbG9vcCBiYWNrIHRvIHN0ZXAgMi5cbiAgICBpZiBvdmVyLCBkaXNwbGF5IGEgbWVzc2FnZSBhbmQgc3RvcCBwbGF5ZXIgZnJvbSBjbGlja2luZyBvbiBib2FyZC5cbiAgKi9cblxuICBwbGFjZUNvbXB1dGVyU2hpcHMoKTtcblxuICByZXR1cm4ge1xuICAgIGdldCBodW1hblBsYXllcigpIHtcbiAgICAgIHJldHVybiBodW1hblBsYXllcjtcbiAgICB9LFxuICAgIGdldCBjb21wdXRlclBsYXllcigpIHtcbiAgICAgIHJldHVybiBjb21wdXRlclBsYXllcjtcbiAgICB9LFxuICAgIHBsYXlUdXJuLFxuICAgIGdhbWVPdmVyLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImNvbnN0IGdhbWVib2FyZCA9ICgpID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgY29uc3Qgcm93ID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjZWxsID0geyBpc0hpdDogZmFsc2UsIHNoaXBPYmo6IG51bGwgfTtcbiAgICAgIHJvdy5wdXNoKGNlbGwpO1xuICAgIH1cbiAgICBib2FyZC5wdXNoKHJvdyk7XG4gIH1cbiAgY29uc3Qgc2hpcHMgPSBbXTtcblxuICBmdW5jdGlvbiBjaGVja0Nvb3JkaW5hdGVzKGxlbmd0aCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSB7XG4gICAgbGV0IG5ld1JvdyA9IHJvdztcbiAgICBsZXQgbmV3Q29sID0gY29sO1xuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBuZXdSb3cgKz0gbGVuZ3RoIC0gMTtcbiAgICAgIGlmIChuZXdSb3cgPCAwIHx8IG5ld1JvdyA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgIG5ld1JvdyA9IHJvdztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW25ld1Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbmV3Um93ICs9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIG5ld0NvbCArPSBsZW5ndGggLSAxO1xuICAgICAgaWYgKG5ld0NvbCA8IDAgfHwgbmV3Q29sID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgbmV3Q29sID0gY29sO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYm9hcmRbcm93XVtuZXdDb2xdLnNoaXBPYmogIT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCBvcmllbnRhdGlvbikge1xuICAgIGlmIChjaGVja0Nvb3JkaW5hdGVzKHNoaXAubGVuZ3RoLCByb3csIGNvbCwgb3JpZW50YXRpb24pID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBsZXQgbmV3Um93ID0gcm93O1xuICAgIGxldCBuZXdDb2wgPSBjb2w7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkW25ld1Jvd11bY29sXS5zaGlwT2JqID0gc2hpcDtcbiAgICAgICAgbmV3Um93ICs9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZFtyb3ddW25ld0NvbF0uc2hpcE9iaiA9IHNoaXA7XG4gICAgICAgIG5ld0NvbCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhyb3csIGNvbCkge1xuICAgIGlmIChyb3cgPiA5IHx8IHJvdyA8IDAgfHwgY29sID4gOSB8fCBjb2wgPCAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdLmlzSGl0KSByZXR1cm4gZmFsc2U7XG5cbiAgICBib2FyZFtyb3ddW2NvbF0uaXNIaXQgPSB0cnVlO1xuXG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHtcbiAgICAgIGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqLmhpdCgpO1xuICAgICAgaWYgKGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqLnN1bmspIHJldHVybiBcInNpbmtcIjtcbiAgICAgIHJldHVybiBcImhpdFwiO1xuICAgIH1cbiAgICByZXR1cm4gXCJtaXNzXCI7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0FsbFNoaXBzU3VuaygpIHtcbiAgICBpZiAoc2hpcHMubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2hpcHNbaV0uc3VuayA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldCBib2FyZCgpIHtcbiAgICAgIC8vIHNob3VsZCBwcm9iYWJseSBiZSBwcml2YXRlLlxuICAgICAgcmV0dXJuIGJvYXJkO1xuICAgIH0sXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgY2hlY2tBbGxTaGlwc1N1bmssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lYm9hcmQ7XG4iLCJpbXBvcnQgZ2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5jb25zdCBwbGF5ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGdCb2FyZCA9IGdhbWVib2FyZCgpO1xuXG4gIGZ1bmN0aW9uIGF0dGFjayhyb3csIGNvbCwgZW5lbXkpIHtcbiAgICByZXR1cm4gZW5lbXkuZ0JvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuICB9XG5cbiAgLy8gRm9yIGNvbXB1dGVyIHBsYXllcnMgb25seVxuICBjb25zdCB2YWxpZEVuZW15Q2VsbHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjZWxsID0gW107XG4gICAgICBjZWxsLnB1c2goaSk7XG4gICAgICBjZWxsLnB1c2goaik7XG4gICAgICB2YWxpZEVuZW15Q2VsbHMucHVzaChjZWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21BdHRhY2soZW5lbXkpIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZEVuZW15Q2VsbHMubGVuZ3RoKV07XG4gICAgY29uc3QgcmFuZG9tQ2VsbCA9IHZhbGlkRW5lbXlDZWxsc1tyYW5kb21JbmRleF07XG4gICAgdmFsaWRFbmVteUNlbGxzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gICAgcmV0dXJuIGF0dGFjayhyYW5kb21DZWxsWzBdLCByYW5kb21DZWxsWzFdLCBlbmVteSk7XG4gIH1cbiAgLy9cblxuICByZXR1cm4ge1xuICAgIGdldCBnQm9hcmQoKSB7XG4gICAgICByZXR1cm4gZ0JvYXJkO1xuICAgIH0sXG4gICAgYXR0YWNrLFxuICAgIHJhbmRvbUF0dGFjayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXllcjtcbiIsImNvbnN0IHNoaXAgPSAobGVuZ3RoKSA9PiB7XG4gIGxldCB0aW1lc0hpdCA9IDA7XG4gIGxldCBzdW5rID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gaXNTdW5rKCkge1xuICAgIGlmIChsZW5ndGggPD0gdGltZXNIaXQpIHtcbiAgICAgIHN1bmsgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhpdCgpIHtcbiAgICB0aW1lc0hpdCArPSAxO1xuICAgIGlzU3VuaygpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9LFxuICAgIGdldCB0aW1lc0hpdCgpIHtcbiAgICAgIHJldHVybiB0aW1lc0hpdDtcbiAgICB9LFxuICAgIGdldCBzdW5rKCkge1xuICAgICAgcmV0dXJuIHN1bms7XG4gICAgfSxcbiAgICBoaXQsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzaGlwO1xuIiwiaW1wb3J0IGdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xuXG5jb25zdCBzY3JlZW5Db250cm9sbGVyID0gKCkgPT4ge1xuICBjb25zdCBnYW1lQ29udHJvbGxlciA9IGdhbWUoKTtcblxuICAvLyBDYWNoZSBET01cbiAgY29uc3QgZW5lbXlDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW5lbXlcIik7XG4gIGNvbnN0IGRpc3BsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRpc3BsYXlcIik7XG5cbiAgZnVuY3Rpb24gZW1wdHlDZWxsSGl0KGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2NjdXBpZWRDZWxsSGl0KGNlbGwpIHtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJoaXRcIik7XG4gIH1cblxuICBmdW5jdGlvbiByZW5kZXJCb2FyZChwbGF5ZXIpIHtcbiAgICBsZXQgYm9hcmROdW1iZXIgPSAwO1xuICAgIGlmIChwbGF5ZXIgPT09IGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyKSBib2FyZE51bWJlciA9IDE7XG5cbiAgICBjb25zdCBib2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJvYXJkXCIpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLmlzSGl0ID09PSB0cnVlICYmXG4gICAgICAgICAgcGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5zaGlwT2JqICE9IG51bGxcbiAgICAgICAgKSB7XG4gICAgICAgICAgb2NjdXBpZWRDZWxsSGl0KGJvYXJkc1tgJHtib2FyZE51bWJlcn1gXS5jaGlsZHJlbltpXS5jaGlsZHJlbltqXSk7XG4gICAgICAgIH0gZWxzZSBpZiAocGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5pc0hpdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGVtcHR5Q2VsbEhpdChib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdW5iaW5kQ29udHJvbHMoKSB7XG4gICAgZW5lbXlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2tDZWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJpbmRDb250cm9scygpIHtcbiAgICBlbmVteUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGF0dGFja0NlbGwpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gYWRkIGEgbWVzc2FnZSB3aGVuIGEgc2hpcCBpcyBzdW5rXG4gIGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkocGxheWVyLCByZXN1bHQpIHtcbiAgICBpZiAocmVzdWx0ID09PSBcImh1bWFuV2luXCIpXG4gICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiQWxsIHlvdXIgb3Bwb25lbnQncyBzaGlwcyBoYXZlIGJlZW4gc3VuayEgWW91IHdpbiFcIjtcbiAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwiY29tcHV0ZXJXaW5cIilcbiAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJBbGwgeW91ciBzaGlwJ3MgaGF2ZSBiZWVuIHN1bmshIFlvdSBsb3NlIVwiO1xuXG4gICAgaWYgKHBsYXllciA9PT0gZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIpIHtcbiAgICAgIGlmIChyZXN1bHQgPT09IFwibWlzc1wiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91IG1pc3NlZCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJoaXRcIikgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdSBoaXQgYSBzaGlwIVwiO1xuICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSBcInNpbmtcIikgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdSBzdW5rIGEgc2hpcCFcIjtcbiAgICB9IGVsc2UgaWYgKHBsYXllciA9PT0gZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIpIHtcbiAgICAgIGlmIChyZXN1bHQgPT09IFwibWlzc1wiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91ciBvcHBvbmVudCBtaXNzZWQhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpXG4gICAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IGhpdCBhIHNoaXAhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwic2lua1wiKVxuICAgICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91ciBvcHBvbmVudCBzdW5rIGEgc2hpcCFcIjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhdHRhY2tDZWxsKCkge1xuICAgIGNvbnN0IHBsYXlUdXJuUmVzdWx0ID0gZ2FtZUNvbnRyb2xsZXIucGxheVR1cm4oXG4gICAgICB0aGlzLnBhcmVudEVsZW1lbnQuZGF0YXNldC5yb3csXG4gICAgICB0aGlzLmRhdGFzZXQuY29sXG4gICAgKTtcbiAgICBpZiAocGxheVR1cm5SZXN1bHQgPT09IGZhbHNlKSByZXR1cm47XG4gICAgcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIpO1xuICAgIHVuYmluZENvbnRyb2xzKCk7XG4gICAgaWYgKHBsYXlUdXJuUmVzdWx0WzJdID09PSBcImh1bWFuV2luXCIpIHtcbiAgICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzJdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5odW1hblBsYXllciwgcGxheVR1cm5SZXN1bHRbMF0pO1xuXG4gICAgLy8gc2V0IGEgZGVsYXkgYmVmb3JlIHRoZSBjb21wdXRlcidzIGFjdGlvbiBpcyBkaXNwbGF5ZWQuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZW5kZXJCb2FyZChnYW1lQ29udHJvbGxlci5odW1hblBsYXllcik7XG4gICAgICBpZiAocGxheVR1cm5SZXN1bHRbMl0gPT09IFwiY29tcHV0ZXJXaW5cIikge1xuICAgICAgICB1cGRhdGVEaXNwbGF5KGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyLCBwbGF5VHVyblJlc3VsdFsyXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGJpbmRDb250cm9scygpO1xuICAgICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllciwgcGxheVR1cm5SZXN1bHRbMV0pO1xuICAgIH0sIDUwMCk7IC8vIGNoYW5nZSBiYWNrIHRvIDIwMDBcbiAgfVxuXG4gIGJpbmRDb250cm9scygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2NyZWVuQ29udHJvbGxlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHNjcmVlbkNvbnRyb2xsZXIgZnJvbSBcIi4vc2NyZWVuQ29udHJvbGxlclwiO1xuXG5zY3JlZW5Db250cm9sbGVyKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=