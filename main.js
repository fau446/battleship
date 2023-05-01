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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBRUEsaUVBQWUsZ0JBQWdCLEVBQUM7Ozs7Ozs7VUNyS2hDO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOa0Q7O0FBRWxELDZEQUFnQiIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JlZW5Db250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwbGF5ZXIgZnJvbSBcIi4vbW9kdWxlcy9wbGF5ZXJcIjtcbmltcG9ydCBzaGlwIGZyb20gXCIuL21vZHVsZXMvc2hpcFwiO1xuXG5jb25zdCBnYW1lID0gKCkgPT4ge1xuICAvLyBzZXR1cCBodW1hbiBhbmQgY29tcHV0ZXIgcGxheWVyc1xuICBjb25zdCBodW1hblBsYXllciA9IHBsYXllcigpO1xuICBjb25zdCBjb21wdXRlclBsYXllciA9IHBsYXllcigpO1xuICBjb25zdCBjYXJyaWVyID0gc2hpcCg1LCBcIkNhcnJpZXJcIik7XG4gIGNvbnN0IGJhdHRsZXNoaXAgPSBzaGlwKDQsIFwiQmF0dGxlc2hpcFwiKTtcbiAgY29uc3QgZGVzdHJveWVyID0gc2hpcCgzLCBcIkRlc3Ryb3llclwiKTtcbiAgY29uc3Qgc3VibWFyaW5lID0gc2hpcCgzLCBcIlN1Ym1hcmluZVwiKTtcbiAgY29uc3QgcGF0cm9sQm9hdCA9IHNoaXAoMiwgXCJQYXRyb2wgQm9hdFwiKTtcbiAgY29uc3QgcGxheWVyU2hpcHMgPSBbY2FycmllciwgYmF0dGxlc2hpcCwgZGVzdHJveWVyLCBzdWJtYXJpbmUsIHBhdHJvbEJvYXRdO1xuICBsZXQgcGxhY2VtZW50T3JpZW50YXRpb24gPSBcImhvcml6b250YWxcIjtcblxuICBmdW5jdGlvbiBjaGFuZ2VQbGFjZW1lbnRPcmllbnRhdGlvbigpIHtcbiAgICBwbGFjZW1lbnRPcmllbnRhdGlvbiA9XG4gICAgICBwbGFjZW1lbnRPcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIgPyBcInZlcnRpY2FsXCIgOiBcImhvcml6b250YWxcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlU2hpcChyb3csIGNvbCkge1xuICAgIGlmIChcbiAgICAgIGh1bWFuUGxheWVyLmdCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgIHBsYXllclNoaXBzWzBdLFxuICAgICAgICByb3csXG4gICAgICAgIGNvbCxcbiAgICAgICAgcGxhY2VtZW50T3JpZW50YXRpb25cbiAgICAgICkgPT09IGZhbHNlXG4gICAgKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgcGxheWVyU2hpcHMuc2hpZnQoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBsYWNlQ29tcHV0ZXJTaGlwcygpIHtcbiAgICBjb25zdCBjb21wdXRlckNhcnJpZXIgPSBzaGlwKDUsIFwiQ2FycmllclwiKTtcbiAgICBjb25zdCBjb21wdXRlckJhdHRsZXNoaXAgPSBzaGlwKDQsIFwiQmF0dGxlc2hpcFwiKTtcbiAgICBjb25zdCBjb21wdXRlckRlc3Ryb3llciA9IHNoaXAoMywgXCJEZXN0cm95ZXJcIik7XG4gICAgY29uc3QgY29tcHV0ZXJTdWJtYXJpbmUgPSBzaGlwKDMsIFwiU3VibWFyaW5lXCIpO1xuICAgIGNvbnN0IGNvbXB1dGVyUGF0cm9sQm9hdCA9IHNoaXAoMiwgXCJQYXRyb2wgQm9hdFwiKTtcbiAgICBjb25zdCBjb21wdXRlckJvYXRzID0gW1xuICAgICAgY29tcHV0ZXJDYXJyaWVyLFxuICAgICAgY29tcHV0ZXJCYXR0bGVzaGlwLFxuICAgICAgY29tcHV0ZXJEZXN0cm95ZXIsXG4gICAgICBjb21wdXRlclN1Ym1hcmluZSxcbiAgICAgIGNvbXB1dGVyUGF0cm9sQm9hdCxcbiAgICBdO1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gW1wiaG9yaXpvbnRhbFwiLCBcInZlcnRpY2FsXCJdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21wdXRlckJvYXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBib2F0ID0gY29tcHV0ZXJCb2F0c1tpXTtcbiAgICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMik7XG4gICAgICBpZiAoXG4gICAgICAgIGNvbXB1dGVyUGxheWVyLmdCb2FyZC5wbGFjZVNoaXAoXG4gICAgICAgICAgYm9hdCxcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gICAgICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApLFxuICAgICAgICAgIG9yaWVudGF0aW9uW3JhbmRvbUluZGV4XVxuICAgICAgICApID09PSBmYWxzZVxuICAgICAgKVxuICAgICAgICBpLS07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGxheVR1cm4ocm93LCBjb2wpIHtcbiAgICBjb25zdCBodW1hbkF0dGFja1Jlc3VsdCA9IGh1bWFuUGxheWVyLmF0dGFjayhyb3csIGNvbCwgY29tcHV0ZXJQbGF5ZXIpO1xuICAgIGlmIChodW1hbkF0dGFja1Jlc3VsdCA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoZ2FtZU92ZXIoKSkgcmV0dXJuIFtodW1hbkF0dGFja1Jlc3VsdCwgbnVsbCwgXCJodW1hbldpblwiXTtcbiAgICBjb25zdCBjb21wdXRlckF0dGFja1Jlc3VsdCA9IGNvbXB1dGVyUGxheWVyLnJhbmRvbUF0dGFjayhodW1hblBsYXllcik7XG4gICAgaWYgKGdhbWVPdmVyKCkpXG4gICAgICByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgXCJjb21wdXRlcldpblwiXTtcbiAgICByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBjb21wdXRlckF0dGFja1Jlc3VsdCwgZmFsc2VdO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgaWYgKFxuICAgICAgaHVtYW5QbGF5ZXIuZ0JvYXJkLmNoZWNrQWxsU2hpcHNTdW5rKCkgfHxcbiAgICAgIGNvbXB1dGVyUGxheWVyLmdCb2FyZC5jaGVja0FsbFNoaXBzU3VuaygpXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcGxhY2VDb21wdXRlclNoaXBzKCk7XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgaHVtYW5QbGF5ZXIoKSB7XG4gICAgICByZXR1cm4gaHVtYW5QbGF5ZXI7XG4gICAgfSxcbiAgICBnZXQgY29tcHV0ZXJQbGF5ZXIoKSB7XG4gICAgICByZXR1cm4gY29tcHV0ZXJQbGF5ZXI7XG4gICAgfSxcbiAgICBnZXQgcGxheWVyU2hpcHMoKSB7XG4gICAgICByZXR1cm4gcGxheWVyU2hpcHM7XG4gICAgfSxcbiAgICBjaGFuZ2VQbGFjZW1lbnRPcmllbnRhdGlvbixcbiAgICBwbGF5VHVybixcbiAgICBnYW1lT3ZlcixcbiAgICBwbGFjZVNoaXAsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xuIiwiY29uc3QgZ2FtZWJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICBjb25zdCByb3cgPSBbXTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSB7IGlzSGl0OiBmYWxzZSwgc2hpcE9iajogbnVsbCB9O1xuICAgICAgcm93LnB1c2goY2VsbCk7XG4gICAgfVxuICAgIGJvYXJkLnB1c2gocm93KTtcbiAgfVxuICBjb25zdCBzaGlwcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGNoZWNrQ29vcmRpbmF0ZXMobGVuZ3RoLCByb3csIGNvbCwgb3JpZW50YXRpb24pIHtcbiAgICBsZXQgbmV3Um93ID0gcm93O1xuICAgIGxldCBuZXdDb2wgPSBjb2w7XG4gICAgaWYgKG9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIpIHtcbiAgICAgIG5ld1JvdyArPSBsZW5ndGggLSAxO1xuICAgICAgaWYgKG5ld1JvdyA8IDAgfHwgbmV3Um93ID4gOSkgcmV0dXJuIGZhbHNlO1xuICAgICAgbmV3Um93ID0gcm93O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoYm9hcmRbbmV3Um93XVtjb2xdLnNoaXBPYmogIT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBuZXdSb3cgKz0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgbmV3Q29sICs9IGxlbmd0aCAtIDE7XG4gICAgICBpZiAobmV3Q29sIDwgMCB8fCBuZXdDb2wgPiA5KSByZXR1cm4gZmFsc2U7XG4gICAgICBuZXdDb2wgPSBjb2w7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChib2FyZFtyb3ddW25ld0NvbF0uc2hpcE9iaiAhPSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIG5ld0NvbCArPSAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKHNoaXAsIHJvdywgY29sLCBvcmllbnRhdGlvbikge1xuICAgIGlmIChjaGVja0Nvb3JkaW5hdGVzKHNoaXAubGVuZ3RoLCByb3csIGNvbCwgb3JpZW50YXRpb24pID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBsZXQgbmV3Um93ID0gcm93O1xuICAgIGxldCBuZXdDb2wgPSBjb2w7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkW25ld1Jvd11bY29sXS5zaGlwT2JqID0gc2hpcDtcbiAgICAgICAgbmV3Um93ICs9IDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJob3Jpem9udGFsXCIpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5sZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZFtyb3ddW25ld0NvbF0uc2hpcE9iaiA9IHNoaXA7XG4gICAgICAgIG5ld0NvbCArPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVjZWl2ZUF0dGFjayhyb3csIGNvbCkge1xuICAgIGlmIChyb3cgPiA5IHx8IHJvdyA8IDAgfHwgY29sID4gOSB8fCBjb2wgPCAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdLmlzSGl0KSByZXR1cm4gZmFsc2U7XG5cbiAgICBib2FyZFtyb3ddW2NvbF0uaXNIaXQgPSB0cnVlO1xuXG4gICAgaWYgKGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqICE9IG51bGwpIHtcbiAgICAgIGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqLmhpdCgpO1xuICAgICAgaWYgKGJvYXJkW3Jvd11bY29sXS5zaGlwT2JqLnN1bmspIHJldHVybiBcInNpbmtcIjtcbiAgICAgIHJldHVybiBcImhpdFwiO1xuICAgIH1cbiAgICByZXR1cm4gXCJtaXNzXCI7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVja0FsbFNoaXBzU3VuaygpIHtcbiAgICBpZiAoc2hpcHMubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc2hpcHNbaV0uc3VuayA9PT0gZmFsc2UpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGdldCBib2FyZCgpIHtcbiAgICAgIC8vIHNob3VsZCBwcm9iYWJseSBiZSBwcml2YXRlLlxuICAgICAgcmV0dXJuIGJvYXJkO1xuICAgIH0sXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlY2VpdmVBdHRhY2ssXG4gICAgY2hlY2tBbGxTaGlwc1N1bmssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lYm9hcmQ7XG4iLCJpbXBvcnQgZ2FtZWJvYXJkIGZyb20gXCIuL2dhbWVib2FyZFwiO1xuXG5jb25zdCBwbGF5ZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGdCb2FyZCA9IGdhbWVib2FyZCgpO1xuXG4gIGZ1bmN0aW9uIGF0dGFjayhyb3csIGNvbCwgZW5lbXkpIHtcbiAgICByZXR1cm4gZW5lbXkuZ0JvYXJkLnJlY2VpdmVBdHRhY2socm93LCBjb2wpO1xuICB9XG5cbiAgLy8gRm9yIGNvbXB1dGVyIHBsYXllcnMgb25seVxuICBjb25zdCB2YWxpZEVuZW15Q2VsbHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaisrKSB7XG4gICAgICBjb25zdCBjZWxsID0gW107XG4gICAgICBjZWxsLnB1c2goaSk7XG4gICAgICBjZWxsLnB1c2goaik7XG4gICAgICB2YWxpZEVuZW15Q2VsbHMucHVzaChjZWxsKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByYW5kb21BdHRhY2soZW5lbXkpIHtcbiAgICBjb25zdCByYW5kb21JbmRleCA9IFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB2YWxpZEVuZW15Q2VsbHMubGVuZ3RoKV07XG4gICAgY29uc3QgcmFuZG9tQ2VsbCA9IHZhbGlkRW5lbXlDZWxsc1tyYW5kb21JbmRleF07XG4gICAgdmFsaWRFbmVteUNlbGxzLnNwbGljZShyYW5kb21JbmRleCwgMSk7XG4gICAgcmV0dXJuIGF0dGFjayhyYW5kb21DZWxsWzBdLCByYW5kb21DZWxsWzFdLCBlbmVteSk7XG4gIH1cbiAgLy9cblxuICByZXR1cm4ge1xuICAgIGdldCBnQm9hcmQoKSB7XG4gICAgICByZXR1cm4gZ0JvYXJkO1xuICAgIH0sXG4gICAgYXR0YWNrLFxuICAgIHJhbmRvbUF0dGFjayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHBsYXllcjtcbiIsImNvbnN0IHNoaXAgPSAobGVuZ3RoLCBzaGlwTmFtZSA9IG51bGwpID0+IHtcbiAgbGV0IHRpbWVzSGl0ID0gMDtcbiAgbGV0IHN1bmsgPSBmYWxzZTtcbiAgY29uc3QgbmFtZSA9IHNoaXBOYW1lO1xuXG4gIGZ1bmN0aW9uIGlzU3VuaygpIHtcbiAgICBpZiAobGVuZ3RoIDw9IHRpbWVzSGl0KSB7XG4gICAgICBzdW5rID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBoaXQoKSB7XG4gICAgdGltZXNIaXQgKz0gMTtcbiAgICBpc1N1bmsoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfSxcbiAgICBnZXQgdGltZXNIaXQoKSB7XG4gICAgICByZXR1cm4gdGltZXNIaXQ7XG4gICAgfSxcbiAgICBnZXQgc3VuaygpIHtcbiAgICAgIHJldHVybiBzdW5rO1xuICAgIH0sXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9LFxuICAgIGhpdCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNoaXA7XG4iLCJpbXBvcnQgZ2FtZSBmcm9tIFwiLi9nYW1lXCI7XG5cbmNvbnN0IHNjcmVlbkNvbnRyb2xsZXIgPSAoKSA9PiB7XG4gIGNvbnN0IGdhbWVDb250cm9sbGVyID0gZ2FtZSgpO1xuXG4gIC8qXG4gIGNvbnN0IHRoaW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50aGluZ1wiKTtcbiAgY29uc3QgdG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b2dnbGVcIik7XG4gIHRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIHRoaW5nLmNsYXNzTGlzdC50b2dnbGUoXCJ0ZXN0XCIpO1xuICB9KTsgKi9cblxuICAvLyBDYWNoZSBET01cbiAgY29uc3QgYm9hcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ib2FyZFwiKTtcbiAgY29uc3QgZnJpZW5kbHlDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZnJpZW5kbHlcIik7XG4gIGNvbnN0IGVuZW15Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVuZW15XCIpO1xuICBjb25zdCBkaXNwbGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5kaXNwbGF5XCIpO1xuICBjb25zdCByb3RhdGVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJvdGF0ZVwiKTtcbiAgcm90YXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaGFuZ2VQbGFjZW1lbnRPcmllbnRhdGlvbik7XG5cbiAgZnVuY3Rpb24gY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24oKSB7XG4gICAgZ2FtZUNvbnRyb2xsZXIuY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtcHR5Q2VsbEhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9jY3VwaWVkQ2VsbEhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxheWVyU2hpcENlbGwoY2VsbCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInBsYXllci1zaGlwXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQm9hcmQocGxheWVyKSB7XG4gICAgbGV0IGJvYXJkTnVtYmVyID0gMDtcbiAgICBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcikgYm9hcmROdW1iZXIgPSAxO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgLy8gaWYgYm9hcmROdW1iZXIgPT09IDAsIHNldCBwbGF5ZXIgc2hpcHMgdG8gYmx1ZVxuICAgICAgICBpZiAoYm9hcmROdW1iZXIgPT09IDAgJiYgcGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5zaGlwT2JqICE9IG51bGwpIHtcbiAgICAgICAgICBwbGF5ZXJTaGlwQ2VsbChib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uaXNIaXQgPT09IHRydWUgJiZcbiAgICAgICAgICBwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLnNoaXBPYmogIT0gbnVsbFxuICAgICAgICApIHtcbiAgICAgICAgICBvY2N1cGllZENlbGxIaXQoYm9hcmRzW2Ake2JvYXJkTnVtYmVyfWBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdKTtcbiAgICAgICAgICBib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0uY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgICAgICAgIFwicGxheWVyLXNoaXBcIlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAocGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5pc0hpdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGVtcHR5Q2VsbEhpdChib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYmluZFBsYWNlU2hpcENvbnRyb2xzKCkge1xuICAgIGZyaWVuZGx5Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxhY2VQbGF5ZXJTaGlwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuYmluZFBsYWNlU2hpcENvbnRyb2xzKCkge1xuICAgIGZyaWVuZGx5Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxhY2VQbGF5ZXJTaGlwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuYmluZENvbnRyb2xzKCkge1xuICAgIGVuZW15Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYXR0YWNrQ2VsbCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBiaW5kQ29udHJvbHMoKSB7XG4gICAgZW5lbXlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2tDZWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGFkZCBhIG1lc3NhZ2Ugd2hlbiBhIHNoaXAgaXMgc3Vua1xuICBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KHBsYXllciwgcmVzdWx0KSB7XG4gICAgaWYgKHJlc3VsdCA9PT0gXCJodW1hbldpblwiKVxuICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIkFsbCB5b3VyIG9wcG9uZW50J3Mgc2hpcHMgaGF2ZSBiZWVuIHN1bmshIFlvdSB3aW4hXCI7XG4gICAgZWxzZSBpZiAocmVzdWx0ID09PSBcImNvbXB1dGVyV2luXCIpXG4gICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiQWxsIHlvdXIgc2hpcCdzIGhhdmUgYmVlbiBzdW5rISBZb3UgbG9zZSFcIjtcblxuICAgIGlmIChwbGF5ZXIgPT09IGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyKSB7XG4gICAgICBpZiAocmVzdWx0ID09PSBcIm1pc3NcIikgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdSBtaXNzZWQhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwiaGl0XCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3UgaGl0IGEgc2hpcCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJzaW5rXCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3Ugc3VuayBhIHNoaXAhXCI7XG4gICAgfSBlbHNlIGlmIChwbGF5ZXIgPT09IGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyKSB7XG4gICAgICBpZiAocmVzdWx0ID09PSBcIm1pc3NcIikgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdXIgb3Bwb25lbnQgbWlzc2VkIVwiO1xuICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSBcImhpdFwiKVxuICAgICAgICBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91ciBvcHBvbmVudCBoaXQgYSBzaGlwIVwiO1xuICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSBcInNpbmtcIilcbiAgICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdXIgb3Bwb25lbnQgc3VuayBhIHNoaXAhXCI7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYXR0YWNrQ2VsbCgpIHtcbiAgICBjb25zdCBwbGF5VHVyblJlc3VsdCA9IGdhbWVDb250cm9sbGVyLnBsYXlUdXJuKFxuICAgICAgTnVtYmVyKHRoaXMucGFyZW50RWxlbWVudC5kYXRhc2V0LnJvdyksXG4gICAgICBOdW1iZXIodGhpcy5kYXRhc2V0LmNvbClcbiAgICApO1xuICAgIGlmIChwbGF5VHVyblJlc3VsdCA9PT0gZmFsc2UpIHJldHVybjtcbiAgICByZW5kZXJCb2FyZChnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcik7XG4gICAgdW5iaW5kQ29udHJvbHMoKTtcbiAgICBpZiAocGxheVR1cm5SZXN1bHRbMl0gPT09IFwiaHVtYW5XaW5cIikge1xuICAgICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5odW1hblBsYXllciwgcGxheVR1cm5SZXN1bHRbMl0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1cGRhdGVEaXNwbGF5KGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyLCBwbGF5VHVyblJlc3VsdFswXSk7XG5cbiAgICAvLyBzZXQgYSBkZWxheSBiZWZvcmUgdGhlIGNvbXB1dGVyJ3MgYWN0aW9uIGlzIGRpc3BsYXllZC5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJlbmRlckJvYXJkKGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyKTtcbiAgICAgIGlmIChwbGF5VHVyblJlc3VsdFsyXSA9PT0gXCJjb21wdXRlcldpblwiKSB7XG4gICAgICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzJdKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYmluZENvbnRyb2xzKCk7XG4gICAgICB1cGRhdGVEaXNwbGF5KGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyLCBwbGF5VHVyblJlc3VsdFsxXSk7XG4gICAgfSwgMTAwMCk7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVBsYXllclNoaXAoKSB7XG4gICAgY29uc3QgeyByb3cgfSA9IHRoaXMucGFyZW50RWxlbWVudC5kYXRhc2V0O1xuICAgIGNvbnN0IHsgY29sIH0gPSB0aGlzLmRhdGFzZXQ7XG5cbiAgICAvLyBlbmVteSBib2FyZCBoaWRkZW4gYnkgZGVmYXVsdC4gUm90YXRlIHNob3duIGJ5IGRlZmF1bHQuXG4gICAgLy8gSWYgZmFsc2UsIHVwZGF0ZSBkaXNwbGF5XG4gICAgLy8gZ2FtZWJvYXJkIGNoZWNrQ29vcmRpbmF0ZXMgZnVuY3Rpb24gaXMgZmxhd2VkLlxuICAgIGlmIChnYW1lQ29udHJvbGxlci5wbGFjZVNoaXAoTnVtYmVyKHJvdyksIE51bWJlcihjb2wpKSA9PT0gZmFsc2UpIHtcbiAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJJbnZhbGlkIHBsYWNlbWVudCwgcGxlYXNlIHRyeSBhZ2FpbiFcIjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZW5kZXJCb2FyZChnYW1lQ29udHJvbGxlci5odW1hblBsYXllcik7XG5cbiAgICBjb25zdCBzaGlwc0FycmF5ID0gZ2FtZUNvbnRyb2xsZXIucGxheWVyU2hpcHM7XG5cbiAgICAvLyBJZiB0cnVlLCB1cGRhdGUgZGlzcGxheVxuICAgIGlmIChzaGlwc0FycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgdW5iaW5kUGxhY2VTaGlwQ29udHJvbHMoKTtcbiAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJDbGljayBvbiBhbiBlbmVteSB0aWxlIHRvIGF0dGFjayFcIjtcbiAgICAgIHJvdGF0ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiaGlkZVwiKTtcbiAgICAgIGJvYXJkc1sxXS5jbGFzc0xpc3QudG9nZ2xlKFwiaGlkZVwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkaXNwbGF5LmlubmVyVGV4dCA9IGBDbGljayBvbiBhIHRpbGUgdG8gcGxhY2UgeW91ciAke3NoaXBzQXJyYXlbMF0ubmFtZX0uYDtcbiAgfVxuXG4gIGJpbmRDb250cm9scygpO1xuICBiaW5kUGxhY2VTaGlwQ29udHJvbHMoKTtcbiAgZGlzcGxheS5pbm5lclRleHQgPSBgQ2xpY2sgb24gYSB0aWxlIHRvIHBsYWNlIHlvdXIgJHtnYW1lQ29udHJvbGxlci5wbGF5ZXJTaGlwc1swXS5uYW1lfS5gO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2NyZWVuQ29udHJvbGxlcjtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHNjcmVlbkNvbnRyb2xsZXIgZnJvbSBcIi4vc2NyZWVuQ29udHJvbGxlclwiO1xuXG5zY3JlZW5Db250cm9sbGVyKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=