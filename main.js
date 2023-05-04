(()=>{"use strict";const e=()=>{const e=(()=>{const e=[];for(let t=0;t<10;t++){const t=[];for(let e=0;e<10;e++){const e={isHit:!1,shipObj:null};t.push(e)}e.push(t)}const t=[];function n(t,n,r,i){let o=n,a=r;if("vertical"===i){if(o+=t-1,o<0||o>9)return!1;o=n;for(let n=0;n<t;n++){if(null!=e[o][r].shipObj)return!1;o+=1}}else if("horizontal"===i){if(a+=t-1,a<0||a>9)return!1;a=r;for(let r=0;r<t;r++){if(null!=e[n][a].shipObj)return!1;a+=1}}return!0}return{get board(){return e},checkCoordinates:n,placeShip:function(r,i,o,a){if(!1===n(r.length,i,o,a))return!1;let l=i,s=o;if("vertical"===a)for(let t=0;t<r.length;t++)e[l][o].shipObj=r,l+=1;else if("horizontal"===a)for(let t=0;t<r.length;t++)e[i][s].shipObj=r,s+=1;return t.push(r),!0},receiveAttack:function(t,n){return!(t>9||t<0||n>9||n<0)&&!e[t][n].isHit&&(e[t][n].isHit=!0,null!=e[t][n].shipObj?(e[t][n].shipObj.hit(),e[t][n].shipObj.sunk?"sink":"hit"):"miss")},checkAllShipsSunk:function(){if(0===t.length)return!1;for(let e=0;e<t.length;e++)if(!1===t[e].sunk)return!1;return!0}}})();function t(e,t,n){return n.gBoard.receiveAttack(e,t)}const n=[];for(let e=0;e<10;e++)for(let t=0;t<10;t++){const r=[];r.push(e),r.push(t),n.push(r)}return{get gBoard(){return e},attack:t,randomAttack:function(e){const r=[Math.floor(Math.random()*n.length)],i=n[r];return n.splice(r,1),t(i[0],i[1],e)}}},t=(e,t=null)=>{let n=0,r=!1;const i=t;return{get length(){return e},get timesHit(){return n},get sunk(){return r},get name(){return i},hit:function(){n+=1,e<=n&&(r=!0)}}};(()=>{const n=(()=>{const n=e(),r=e(),i=[t(5,"Carrier"),t(4,"Battleship"),t(3,"Destroyer"),t(3,"Submarine"),t(2,"Patrol Boat")];let o="horizontal";function a(){return!(!n.gBoard.checkAllShipsSunk()&&!r.gBoard.checkAllShipsSunk())}return function(){const e=[t(5,"Carrier"),t(4,"Battleship"),t(3,"Destroyer"),t(3,"Submarine"),t(2,"Patrol Boat")],n=["horizontal","vertical"];for(let t=0;t<e.length;t++){const i=e[t],o=Math.floor(2*Math.random());!1===r.gBoard.placeShip(i,Math.floor(10*Math.random()),Math.floor(10*Math.random()),n[o])&&t--}}(),{get humanPlayer(){return n},get computerPlayer(){return r},get playerShips(){return i},get placementOrientation(){return o},changePlacementOrientation:function(){o="horizontal"===o?"vertical":"horizontal"},playTurn:function(e,t){const i=n.attack(e,t,r);if(!1===i)return!1;if(a())return[i,null,"humanWin"];const o=r.randomAttack(n);return a()?[i,o,"computerWin"]:[i,o,!1]},gameOver:a,placeShip:function(e,t){return!1!==n.gBoard.placeShip(i[0],e,t,o)&&(i.shift(),!0)}}})(),r=document.querySelectorAll(".board"),i=document.querySelectorAll(".friendly"),o=document.querySelectorAll(".enemy"),a=document.querySelector(".display"),l=document.querySelector(".rotate");function s(){let e=Number(this.parentElement.dataset.row),t=Number(this.dataset.col);const i=n.playerShips[0].length,o=n.placementOrientation;if(!1!==n.humanPlayer.gBoard.checkCoordinates(i,e,t,o))if("horizontal"===o)for(let n=0;n<i;n++)r[0].children[e].children[t].classList.add("hover"),t++;else if("vertical"===o)for(let n=0;n<i;n++)r[0].children[e].children[t].classList.add("hover"),e++}function c(){let e=Number(this.parentElement.dataset.row),t=Number(this.dataset.col);const i=n.playerShips[0].length,o=n.placementOrientation;if(!1!==n.humanPlayer.gBoard.checkCoordinates(i,e,t,o))if("horizontal"===o)for(let n=0;n<i;n++)r[0].children[e].children[t].classList.remove("hover"),t++;else if("vertical"===o)for(let n=0;n<i;n++)r[0].children[e].children[t].classList.remove("hover"),e++}function u(e){e.classList.add("miss")}function h(e){let t=0;e===n.computerPlayer&&(t=1);for(let n=0;n<10;n++)for(let i=0;i<10;i++)0===t&&null!=e.gBoard.board[n][i].shipObj&&r[`${t}`].children[n].children[i].classList.add("player-ship"),!0===e.gBoard.board[n][i].isHit&&null!=e.gBoard.board[n][i].shipObj?(r[`${t}`].children[n].children[i].classList.add("hit"),r[`${t}`].children[n].children[i].classList.remove("player-ship")):!0===e.gBoard.board[n][i].isHit&&u(r[`${t}`].children[n].children[i])}function d(){o.forEach((e=>{e.addEventListener("click",m)}))}function p(e,t){"humanWin"===t?a.innerText="All your opponent's ships have been sunk! You win!":"computerWin"===t&&(a.innerText="All your ship's have been sunk! You lose!"),e===n.humanPlayer?"miss"===t?a.innerText="You missed!":"hit"===t?a.innerText="You hit a ship!":"sink"===t&&(a.innerText="You sunk a ship!"):e===n.computerPlayer&&("miss"===t?a.innerText="Your opponent missed!":"hit"===t?a.innerText="Your opponent hit a ship!":"sink"===t&&(a.innerText="Your opponent sunk a ship!"))}function m(){const e=n.playTurn(Number(this.parentElement.dataset.row),Number(this.dataset.col));!1!==e&&(h(n.computerPlayer),o.forEach((e=>{e.removeEventListener("click",m)})),"humanWin"!==e[2]?(p(n.humanPlayer,e[0]),setTimeout((()=>{h(n.humanPlayer),"computerWin"!==e[2]?(d(),p(n.computerPlayer,e[1])):p(n.computerPlayer,e[2])}),1e3)):p(n.humanPlayer,e[2]))}function f(){const{row:e}=this.parentElement.dataset,{col:t}=this.dataset;if(!1===n.placeShip(Number(e),Number(t)))return void(a.innerText="Invalid placement, please try again!");h(n.humanPlayer);const o=n.playerShips;if(0===o.length)return i.forEach((e=>{e.removeEventListener("click",f),e.removeEventListener("mouseover",s),e.removeEventListener("mouseout",c)})),a.innerText="Click on an enemy tile to attack!",l.classList.add("hide"),void r[1].classList.toggle("hide");a.innerText=`Click on a tile to place your ${o[0].name}.`}l.addEventListener("click",(function(){n.changePlacementOrientation()})),i.forEach((e=>{e.addEventListener("mouseover",s)})),i.forEach((e=>{e.addEventListener("mouseout",c)})),d(),i.forEach((e=>{e.addEventListener("click",f)})),a.innerText=`Click on a tile to place your ${n.playerShips[0].name}.`})()})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UXdCLFVBQVksb0NBQ3BCdEIsRUFBYVEsVUFBVUMsSUFBSSxhQUMzQmhCLEVBQU8sR0FBR2UsVUFBVW9CLE9BQU8sUUFJN0I5QixFQUFRd0IsVUFBWSxpQ0FBaUNLLEVBQVcsR0FBR2pELE9BQ3JFLENBM01Bc0IsRUFBYWtCLGlCQUFpQixTQW1FOUIsV0FDRXZDLEVBQWVTLDRCQUNqQixJQW5FQVEsRUFBY3FCLFNBQVNwRSxJQUNyQkEsRUFBS3FFLGlCQUFpQixZQUFhakIsRUFBbUIsSUFFeERMLEVBQWNxQixTQUFTcEUsSUFDckJBLEVBQUtxRSxpQkFBaUIsV0FBWVIsRUFBa0IsSUF1TXRETSxJQS9GRXBCLEVBQWNxQixTQUFTcEUsSUFDckJBLEVBQUtxRSxpQkFBaUIsUUFBU1EsRUFBZ0IsSUFnR25ENUIsRUFBUXdCLFVBQVksaUNBQWlDM0MsRUFBZUcsWUFBWSxHQUFHSixPQUFPLEVFeE41RixFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyZWVuQ29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnYW1lYm9hcmQgPSAoKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTA7IGkrKykge1xuICAgIGNvbnN0IHJvdyA9IFtdO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTA7IGorKykge1xuICAgICAgY29uc3QgY2VsbCA9IHsgaXNIaXQ6IGZhbHNlLCBzaGlwT2JqOiBudWxsIH07XG4gICAgICByb3cucHVzaChjZWxsKTtcbiAgICB9XG4gICAgYm9hcmQucHVzaChyb3cpO1xuICB9XG4gIGNvbnN0IHNoaXBzID0gW107XG5cbiAgZnVuY3Rpb24gY2hlY2tDb29yZGluYXRlcyhsZW5ndGgsIHJvdywgY29sLCBvcmllbnRhdGlvbikge1xuICAgIGxldCBuZXdSb3cgPSByb3c7XG4gICAgbGV0IG5ld0NvbCA9IGNvbDtcbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwidmVydGljYWxcIikge1xuICAgICAgbmV3Um93ICs9IGxlbmd0aCAtIDE7XG4gICAgICBpZiAobmV3Um93IDwgMCB8fCBuZXdSb3cgPiA5KSByZXR1cm4gZmFsc2U7XG4gICAgICBuZXdSb3cgPSByb3c7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChib2FyZFtuZXdSb3ddW2NvbF0uc2hpcE9iaiAhPSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIG5ld1JvdyArPSAxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBuZXdDb2wgKz0gbGVuZ3RoIC0gMTtcbiAgICAgIGlmIChuZXdDb2wgPCAwIHx8IG5ld0NvbCA+IDkpIHJldHVybiBmYWxzZTtcbiAgICAgIG5ld0NvbCA9IGNvbDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGJvYXJkW3Jvd11bbmV3Q29sXS5zaGlwT2JqICE9IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgbmV3Q29sICs9IDE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBwbGFjZVNoaXAoc2hpcCwgcm93LCBjb2wsIG9yaWVudGF0aW9uKSB7XG4gICAgaWYgKGNoZWNrQ29vcmRpbmF0ZXMoc2hpcC5sZW5ndGgsIHJvdywgY29sLCBvcmllbnRhdGlvbikgPT09IGZhbHNlKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGxldCBuZXdSb3cgPSByb3c7XG4gICAgbGV0IG5ld0NvbCA9IGNvbDtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYm9hcmRbbmV3Um93XVtjb2xdLnNoaXBPYmogPSBzaGlwO1xuICAgICAgICBuZXdSb3cgKz0gMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGJvYXJkW3Jvd11bbmV3Q29sXS5zaGlwT2JqID0gc2hpcDtcbiAgICAgICAgbmV3Q29sICs9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiByZWNlaXZlQXR0YWNrKHJvdywgY29sKSB7XG4gICAgaWYgKHJvdyA+IDkgfHwgcm93IDwgMCB8fCBjb2wgPiA5IHx8IGNvbCA8IDApIHJldHVybiBmYWxzZTtcblxuICAgIGlmIChib2FyZFtyb3ddW2NvbF0uaXNIaXQpIHJldHVybiBmYWxzZTtcblxuICAgIGJvYXJkW3Jvd11bY29sXS5pc0hpdCA9IHRydWU7XG5cbiAgICBpZiAoYm9hcmRbcm93XVtjb2xdLnNoaXBPYmogIT0gbnVsbCkge1xuICAgICAgYm9hcmRbcm93XVtjb2xdLnNoaXBPYmouaGl0KCk7XG4gICAgICBpZiAoYm9hcmRbcm93XVtjb2xdLnNoaXBPYmouc3VuaykgcmV0dXJuIFwic2lua1wiO1xuICAgICAgcmV0dXJuIFwiaGl0XCI7XG4gICAgfVxuICAgIHJldHVybiBcIm1pc3NcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrQWxsU2hpcHNTdW5rKCkge1xuICAgIGlmIChzaGlwcy5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChzaGlwc1tpXS5zdW5rID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0IGJvYXJkKCkge1xuICAgICAgcmV0dXJuIGJvYXJkO1xuICAgIH0sXG4gICAgY2hlY2tDb29yZGluYXRlcyxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjZWl2ZUF0dGFjayxcbiAgICBjaGVja0FsbFNoaXBzU3VuayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWVib2FyZDtcbiIsImltcG9ydCBnYW1lYm9hcmQgZnJvbSBcIi4vZ2FtZWJvYXJkXCI7XG5cbmNvbnN0IHBsYXllciA9ICgpID0+IHtcbiAgY29uc3QgZ0JvYXJkID0gZ2FtZWJvYXJkKCk7XG5cbiAgZnVuY3Rpb24gYXR0YWNrKHJvdywgY29sLCBlbmVteSkge1xuICAgIHJldHVybiBlbmVteS5nQm9hcmQucmVjZWl2ZUF0dGFjayhyb3csIGNvbCk7XG4gIH1cblxuICAvLyBGb3IgY29tcHV0ZXIgcGxheWVycyBvbmx5XG4gIGNvbnN0IHZhbGlkRW5lbXlDZWxscyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBbXTtcbiAgICAgIGNlbGwucHVzaChpKTtcbiAgICAgIGNlbGwucHVzaChqKTtcbiAgICAgIHZhbGlkRW5lbXlDZWxscy5wdXNoKGNlbGwpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJhbmRvbUF0dGFjayhlbmVteSkge1xuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHZhbGlkRW5lbXlDZWxscy5sZW5ndGgpXTtcbiAgICBjb25zdCByYW5kb21DZWxsID0gdmFsaWRFbmVteUNlbGxzW3JhbmRvbUluZGV4XTtcbiAgICB2YWxpZEVuZW15Q2VsbHMuc3BsaWNlKHJhbmRvbUluZGV4LCAxKTtcbiAgICByZXR1cm4gYXR0YWNrKHJhbmRvbUNlbGxbMF0sIHJhbmRvbUNlbGxbMV0sIGVuZW15KTtcbiAgfVxuICAvL1xuXG4gIHJldHVybiB7XG4gICAgZ2V0IGdCb2FyZCgpIHtcbiAgICAgIHJldHVybiBnQm9hcmQ7XG4gICAgfSxcbiAgICBhdHRhY2ssXG4gICAgcmFuZG9tQXR0YWNrLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcGxheWVyO1xuIiwiY29uc3Qgc2hpcCA9IChsZW5ndGgsIHNoaXBOYW1lID0gbnVsbCkgPT4ge1xuICBsZXQgdGltZXNIaXQgPSAwO1xuICBsZXQgc3VuayA9IGZhbHNlO1xuICBjb25zdCBuYW1lID0gc2hpcE5hbWU7XG5cbiAgZnVuY3Rpb24gaXNTdW5rKCkge1xuICAgIGlmIChsZW5ndGggPD0gdGltZXNIaXQpIHtcbiAgICAgIHN1bmsgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhpdCgpIHtcbiAgICB0aW1lc0hpdCArPSAxO1xuICAgIGlzU3VuaygpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQgbGVuZ3RoKCkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9LFxuICAgIGdldCB0aW1lc0hpdCgpIHtcbiAgICAgIHJldHVybiB0aW1lc0hpdDtcbiAgICB9LFxuICAgIGdldCBzdW5rKCkge1xuICAgICAgcmV0dXJuIHN1bms7XG4gICAgfSxcbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH0sXG4gICAgaGl0LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgc2hpcDtcbiIsImltcG9ydCBnYW1lIGZyb20gXCIuL2dhbWVcIjtcblxuY29uc3Qgc2NyZWVuQ29udHJvbGxlciA9ICgpID0+IHtcbiAgY29uc3QgZ2FtZUNvbnRyb2xsZXIgPSBnYW1lKCk7XG5cbiAgLy8gQ2FjaGUgRE9NXG4gIGNvbnN0IGJvYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYm9hcmRcIik7XG4gIGNvbnN0IGZyaWVuZGx5Q2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmZyaWVuZGx5XCIpO1xuICBjb25zdCBlbmVteUNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbmVteVwiKTtcbiAgY29uc3QgZGlzcGxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGlzcGxheVwiKTtcbiAgY29uc3Qgcm90YXRlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yb3RhdGVcIik7XG4gIHJvdGF0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24pO1xuXG4gIGZyaWVuZGx5Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBtb3VzZW92ZXJHaG9zdFNoaXApO1xuICB9KTtcbiAgZnJpZW5kbHlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgbW91c2VvdXRHaG9zdFNoaXApO1xuICB9KTtcblxuICBmdW5jdGlvbiBtb3VzZW92ZXJHaG9zdFNoaXAoKSB7XG4gICAgbGV0IHJvdyA9IE51bWJlcih0aGlzLnBhcmVudEVsZW1lbnQuZGF0YXNldC5yb3cpO1xuICAgIGxldCBjb2wgPSBOdW1iZXIodGhpcy5kYXRhc2V0LmNvbCk7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IGdhbWVDb250cm9sbGVyLnBsYXllclNoaXBzWzBdLmxlbmd0aDtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGdhbWVDb250cm9sbGVyLnBsYWNlbWVudE9yaWVudGF0aW9uO1xuXG4gICAgaWYgKFxuICAgICAgZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIuZ0JvYXJkLmNoZWNrQ29vcmRpbmF0ZXMoXG4gICAgICAgIHNoaXBMZW5ndGgsXG4gICAgICAgIHJvdyxcbiAgICAgICAgY29sLFxuICAgICAgICBvcmllbnRhdGlvblxuICAgICAgKSA9PT0gZmFsc2VcbiAgICApXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZHNbMF0uY2hpbGRyZW5bcm93XS5jaGlsZHJlbltjb2xdLmNsYXNzTGlzdC5hZGQoXCJob3ZlclwiKTtcbiAgICAgICAgY29sKys7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZHNbMF0uY2hpbGRyZW5bcm93XS5jaGlsZHJlbltjb2xdLmNsYXNzTGlzdC5hZGQoXCJob3ZlclwiKTtcbiAgICAgICAgcm93Kys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbW91c2VvdXRHaG9zdFNoaXAoKSB7XG4gICAgbGV0IHJvdyA9IE51bWJlcih0aGlzLnBhcmVudEVsZW1lbnQuZGF0YXNldC5yb3cpO1xuICAgIGxldCBjb2wgPSBOdW1iZXIodGhpcy5kYXRhc2V0LmNvbCk7XG4gICAgY29uc3Qgc2hpcExlbmd0aCA9IGdhbWVDb250cm9sbGVyLnBsYXllclNoaXBzWzBdLmxlbmd0aDtcbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGdhbWVDb250cm9sbGVyLnBsYWNlbWVudE9yaWVudGF0aW9uO1xuXG4gICAgaWYgKFxuICAgICAgZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIuZ0JvYXJkLmNoZWNrQ29vcmRpbmF0ZXMoXG4gICAgICAgIHNoaXBMZW5ndGgsXG4gICAgICAgIHJvdyxcbiAgICAgICAgY29sLFxuICAgICAgICBvcmllbnRhdGlvblxuICAgICAgKSA9PT0gZmFsc2VcbiAgICApXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZHNbMF0uY2hpbGRyZW5bcm93XS5jaGlsZHJlbltjb2xdLmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlclwiKTtcbiAgICAgICAgY29sKys7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkrKykge1xuICAgICAgICBib2FyZHNbMF0uY2hpbGRyZW5bcm93XS5jaGlsZHJlbltjb2xdLmNsYXNzTGlzdC5yZW1vdmUoXCJob3ZlclwiKTtcbiAgICAgICAgcm93Kys7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24oKSB7XG4gICAgZ2FtZUNvbnRyb2xsZXIuY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24oKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVtcHR5Q2VsbEhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc1wiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9jY3VwaWVkQ2VsbEhpdChjZWxsKSB7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxheWVyU2hpcENlbGwoY2VsbCkge1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInBsYXllci1zaGlwXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVuZGVyQm9hcmQocGxheWVyKSB7XG4gICAgbGV0IGJvYXJkTnVtYmVyID0gMDtcbiAgICBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcikgYm9hcmROdW1iZXIgPSAxO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEwOyBqKyspIHtcbiAgICAgICAgLy8gaWYgYm9hcmROdW1iZXIgPT09IDAsIHNldCBwbGF5ZXIgc2hpcHMgdG8gYmx1ZVxuICAgICAgICBpZiAoYm9hcmROdW1iZXIgPT09IDAgJiYgcGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5zaGlwT2JqICE9IG51bGwpIHtcbiAgICAgICAgICBwbGF5ZXJTaGlwQ2VsbChib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHBsYXllci5nQm9hcmQuYm9hcmRbaV1bal0uaXNIaXQgPT09IHRydWUgJiZcbiAgICAgICAgICBwbGF5ZXIuZ0JvYXJkLmJvYXJkW2ldW2pdLnNoaXBPYmogIT0gbnVsbFxuICAgICAgICApIHtcbiAgICAgICAgICBvY2N1cGllZENlbGxIaXQoYm9hcmRzW2Ake2JvYXJkTnVtYmVyfWBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuW2pdKTtcbiAgICAgICAgICBib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0uY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgICAgICAgIFwicGxheWVyLXNoaXBcIlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAocGxheWVyLmdCb2FyZC5ib2FyZFtpXVtqXS5pc0hpdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGVtcHR5Q2VsbEhpdChib2FyZHNbYCR7Ym9hcmROdW1iZXJ9YF0uY2hpbGRyZW5baV0uY2hpbGRyZW5bal0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYmluZFBsYWNlU2hpcENvbnRyb2xzKCkge1xuICAgIGZyaWVuZGx5Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxhY2VQbGF5ZXJTaGlwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuYmluZFBsYWNlU2hpcENvbnRyb2xzKCkge1xuICAgIGZyaWVuZGx5Q2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcGxhY2VQbGF5ZXJTaGlwKTtcbiAgICAgIGNlbGwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3ZlclwiLCBtb3VzZW92ZXJHaG9zdFNoaXApO1xuICAgICAgY2VsbC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2VvdXRcIiwgbW91c2VvdXRHaG9zdFNoaXApO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5iaW5kQ29udHJvbHMoKSB7XG4gICAgZW5lbXlDZWxscy5mb3JFYWNoKChjZWxsKSA9PiB7XG4gICAgICBjZWxsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhdHRhY2tDZWxsKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJpbmRDb250cm9scygpIHtcbiAgICBlbmVteUNlbGxzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGF0dGFja0NlbGwpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlRGlzcGxheShwbGF5ZXIsIHJlc3VsdCkge1xuICAgIGlmIChyZXN1bHQgPT09IFwiaHVtYW5XaW5cIilcbiAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJBbGwgeW91ciBvcHBvbmVudCdzIHNoaXBzIGhhdmUgYmVlbiBzdW5rISBZb3Ugd2luIVwiO1xuICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJjb21wdXRlcldpblwiKVxuICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIkFsbCB5b3VyIHNoaXAncyBoYXZlIGJlZW4gc3VuayEgWW91IGxvc2UhXCI7XG5cbiAgICBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5odW1hblBsYXllcikge1xuICAgICAgaWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3UgbWlzc2VkIVwiO1xuICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSBcImhpdFwiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91IGhpdCBhIHNoaXAhXCI7XG4gICAgICBlbHNlIGlmIChyZXN1bHQgPT09IFwic2lua1wiKSBkaXNwbGF5LmlubmVyVGV4dCA9IFwiWW91IHN1bmsgYSBzaGlwIVwiO1xuICAgIH0gZWxzZSBpZiAocGxheWVyID09PSBnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllcikge1xuICAgICAgaWYgKHJlc3VsdCA9PT0gXCJtaXNzXCIpIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IG1pc3NlZCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJoaXRcIilcbiAgICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIllvdXIgb3Bwb25lbnQgaGl0IGEgc2hpcCFcIjtcbiAgICAgIGVsc2UgaWYgKHJlc3VsdCA9PT0gXCJzaW5rXCIpXG4gICAgICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gXCJZb3VyIG9wcG9uZW50IHN1bmsgYSBzaGlwIVwiO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGF0dGFja0NlbGwoKSB7XG4gICAgY29uc3QgcGxheVR1cm5SZXN1bHQgPSBnYW1lQ29udHJvbGxlci5wbGF5VHVybihcbiAgICAgIE51bWJlcih0aGlzLnBhcmVudEVsZW1lbnQuZGF0YXNldC5yb3cpLFxuICAgICAgTnVtYmVyKHRoaXMuZGF0YXNldC5jb2wpXG4gICAgKTtcbiAgICBpZiAocGxheVR1cm5SZXN1bHQgPT09IGZhbHNlKSByZXR1cm47XG4gICAgcmVuZGVyQm9hcmQoZ2FtZUNvbnRyb2xsZXIuY29tcHV0ZXJQbGF5ZXIpO1xuICAgIHVuYmluZENvbnRyb2xzKCk7XG4gICAgaWYgKHBsYXlUdXJuUmVzdWx0WzJdID09PSBcImh1bWFuV2luXCIpIHtcbiAgICAgIHVwZGF0ZURpc3BsYXkoZ2FtZUNvbnRyb2xsZXIuaHVtYW5QbGF5ZXIsIHBsYXlUdXJuUmVzdWx0WzJdKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5odW1hblBsYXllciwgcGxheVR1cm5SZXN1bHRbMF0pO1xuXG4gICAgLy8gc2V0IGEgZGVsYXkgYmVmb3JlIHRoZSBjb21wdXRlcidzIGFjdGlvbiBpcyBkaXNwbGF5ZWQuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICByZW5kZXJCb2FyZChnYW1lQ29udHJvbGxlci5odW1hblBsYXllcik7XG4gICAgICBpZiAocGxheVR1cm5SZXN1bHRbMl0gPT09IFwiY29tcHV0ZXJXaW5cIikge1xuICAgICAgICB1cGRhdGVEaXNwbGF5KGdhbWVDb250cm9sbGVyLmNvbXB1dGVyUGxheWVyLCBwbGF5VHVyblJlc3VsdFsyXSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGJpbmRDb250cm9scygpO1xuICAgICAgdXBkYXRlRGlzcGxheShnYW1lQ29udHJvbGxlci5jb21wdXRlclBsYXllciwgcGxheVR1cm5SZXN1bHRbMV0pO1xuICAgIH0sIDEwMDApO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VQbGF5ZXJTaGlwKCkge1xuICAgIGNvbnN0IHsgcm93IH0gPSB0aGlzLnBhcmVudEVsZW1lbnQuZGF0YXNldDtcbiAgICBjb25zdCB7IGNvbCB9ID0gdGhpcy5kYXRhc2V0O1xuXG4gICAgaWYgKGdhbWVDb250cm9sbGVyLnBsYWNlU2hpcChOdW1iZXIocm93KSwgTnVtYmVyKGNvbCkpID09PSBmYWxzZSkge1xuICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIkludmFsaWQgcGxhY2VtZW50LCBwbGVhc2UgdHJ5IGFnYWluIVwiO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJlbmRlckJvYXJkKGdhbWVDb250cm9sbGVyLmh1bWFuUGxheWVyKTtcblxuICAgIGNvbnN0IHNoaXBzQXJyYXkgPSBnYW1lQ29udHJvbGxlci5wbGF5ZXJTaGlwcztcblxuICAgIC8vIElmIHRydWUsIHVwZGF0ZSBkaXNwbGF5XG4gICAgaWYgKHNoaXBzQXJyYXkubGVuZ3RoID09PSAwKSB7XG4gICAgICB1bmJpbmRQbGFjZVNoaXBDb250cm9scygpO1xuICAgICAgZGlzcGxheS5pbm5lclRleHQgPSBcIkNsaWNrIG9uIGFuIGVuZW15IHRpbGUgdG8gYXR0YWNrIVwiO1xuICAgICAgcm90YXRlQnV0dG9uLmNsYXNzTGlzdC5hZGQoXCJoaWRlXCIpO1xuICAgICAgYm9hcmRzWzFdLmNsYXNzTGlzdC50b2dnbGUoXCJoaWRlXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRpc3BsYXkuaW5uZXJUZXh0ID0gYENsaWNrIG9uIGEgdGlsZSB0byBwbGFjZSB5b3VyICR7c2hpcHNBcnJheVswXS5uYW1lfS5gO1xuICB9XG5cbiAgYmluZENvbnRyb2xzKCk7XG4gIGJpbmRQbGFjZVNoaXBDb250cm9scygpO1xuICBkaXNwbGF5LmlubmVyVGV4dCA9IGBDbGljayBvbiBhIHRpbGUgdG8gcGxhY2UgeW91ciAke2dhbWVDb250cm9sbGVyLnBsYXllclNoaXBzWzBdLm5hbWV9LmA7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzY3JlZW5Db250cm9sbGVyO1xuIiwiaW1wb3J0IHBsYXllciBmcm9tIFwiLi9tb2R1bGVzL3BsYXllclwiO1xuaW1wb3J0IHNoaXAgZnJvbSBcIi4vbW9kdWxlcy9zaGlwXCI7XG5cbmNvbnN0IGdhbWUgPSAoKSA9PiB7XG4gIC8vIHNldHVwIGh1bWFuIGFuZCBjb21wdXRlciBwbGF5ZXJzXG4gIGNvbnN0IGh1bWFuUGxheWVyID0gcGxheWVyKCk7XG4gIGNvbnN0IGNvbXB1dGVyUGxheWVyID0gcGxheWVyKCk7XG4gIGNvbnN0IGNhcnJpZXIgPSBzaGlwKDUsIFwiQ2FycmllclwiKTtcbiAgY29uc3QgYmF0dGxlc2hpcCA9IHNoaXAoNCwgXCJCYXR0bGVzaGlwXCIpO1xuICBjb25zdCBkZXN0cm95ZXIgPSBzaGlwKDMsIFwiRGVzdHJveWVyXCIpO1xuICBjb25zdCBzdWJtYXJpbmUgPSBzaGlwKDMsIFwiU3VibWFyaW5lXCIpO1xuICBjb25zdCBwYXRyb2xCb2F0ID0gc2hpcCgyLCBcIlBhdHJvbCBCb2F0XCIpO1xuICBjb25zdCBwbGF5ZXJTaGlwcyA9IFtjYXJyaWVyLCBiYXR0bGVzaGlwLCBkZXN0cm95ZXIsIHN1Ym1hcmluZSwgcGF0cm9sQm9hdF07XG4gIGxldCBwbGFjZW1lbnRPcmllbnRhdGlvbiA9IFwiaG9yaXpvbnRhbFwiO1xuXG4gIGZ1bmN0aW9uIGNoYW5nZVBsYWNlbWVudE9yaWVudGF0aW9uKCkge1xuICAgIHBsYWNlbWVudE9yaWVudGF0aW9uID1cbiAgICAgIHBsYWNlbWVudE9yaWVudGF0aW9uID09PSBcImhvcml6b250YWxcIiA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VTaGlwKHJvdywgY29sKSB7XG4gICAgaWYgKFxuICAgICAgaHVtYW5QbGF5ZXIuZ0JvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgcGxheWVyU2hpcHNbMF0sXG4gICAgICAgIHJvdyxcbiAgICAgICAgY29sLFxuICAgICAgICBwbGFjZW1lbnRPcmllbnRhdGlvblxuICAgICAgKSA9PT0gZmFsc2VcbiAgICApXG4gICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICBwbGF5ZXJTaGlwcy5zaGlmdCgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gcGxhY2VDb21wdXRlclNoaXBzKCkge1xuICAgIGNvbnN0IGNvbXB1dGVyQ2FycmllciA9IHNoaXAoNSwgXCJDYXJyaWVyXCIpO1xuICAgIGNvbnN0IGNvbXB1dGVyQmF0dGxlc2hpcCA9IHNoaXAoNCwgXCJCYXR0bGVzaGlwXCIpO1xuICAgIGNvbnN0IGNvbXB1dGVyRGVzdHJveWVyID0gc2hpcCgzLCBcIkRlc3Ryb3llclwiKTtcbiAgICBjb25zdCBjb21wdXRlclN1Ym1hcmluZSA9IHNoaXAoMywgXCJTdWJtYXJpbmVcIik7XG4gICAgY29uc3QgY29tcHV0ZXJQYXRyb2xCb2F0ID0gc2hpcCgyLCBcIlBhdHJvbCBCb2F0XCIpO1xuICAgIGNvbnN0IGNvbXB1dGVyQm9hdHMgPSBbXG4gICAgICBjb21wdXRlckNhcnJpZXIsXG4gICAgICBjb21wdXRlckJhdHRsZXNoaXAsXG4gICAgICBjb21wdXRlckRlc3Ryb3llcixcbiAgICAgIGNvbXB1dGVyU3VibWFyaW5lLFxuICAgICAgY29tcHV0ZXJQYXRyb2xCb2F0LFxuICAgIF07XG4gICAgY29uc3Qgb3JpZW50YXRpb24gPSBbXCJob3Jpem9udGFsXCIsIFwidmVydGljYWxcIl07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXB1dGVyQm9hdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGJvYXQgPSBjb21wdXRlckJvYXRzW2ldO1xuICAgICAgY29uc3QgcmFuZG9tSW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcHV0ZXJQbGF5ZXIuZ0JvYXJkLnBsYWNlU2hpcChcbiAgICAgICAgICBib2F0LFxuICAgICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSxcbiAgICAgICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCksXG4gICAgICAgICAgb3JpZW50YXRpb25bcmFuZG9tSW5kZXhdXG4gICAgICAgICkgPT09IGZhbHNlXG4gICAgICApXG4gICAgICAgIGktLTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5VHVybihyb3csIGNvbCkge1xuICAgIGNvbnN0IGh1bWFuQXR0YWNrUmVzdWx0ID0gaHVtYW5QbGF5ZXIuYXR0YWNrKHJvdywgY29sLCBjb21wdXRlclBsYXllcik7XG4gICAgaWYgKGh1bWFuQXR0YWNrUmVzdWx0ID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChnYW1lT3ZlcigpKSByZXR1cm4gW2h1bWFuQXR0YWNrUmVzdWx0LCBudWxsLCBcImh1bWFuV2luXCJdO1xuICAgIGNvbnN0IGNvbXB1dGVyQXR0YWNrUmVzdWx0ID0gY29tcHV0ZXJQbGF5ZXIucmFuZG9tQXR0YWNrKGh1bWFuUGxheWVyKTtcbiAgICBpZiAoZ2FtZU92ZXIoKSlcbiAgICAgIHJldHVybiBbaHVtYW5BdHRhY2tSZXN1bHQsIGNvbXB1dGVyQXR0YWNrUmVzdWx0LCBcImNvbXB1dGVyV2luXCJdO1xuICAgIHJldHVybiBbaHVtYW5BdHRhY2tSZXN1bHQsIGNvbXB1dGVyQXR0YWNrUmVzdWx0LCBmYWxzZV07XG4gIH1cblxuICBmdW5jdGlvbiBnYW1lT3ZlcigpIHtcbiAgICBpZiAoXG4gICAgICBodW1hblBsYXllci5nQm9hcmQuY2hlY2tBbGxTaGlwc1N1bmsoKSB8fFxuICAgICAgY29tcHV0ZXJQbGF5ZXIuZ0JvYXJkLmNoZWNrQWxsU2hpcHNTdW5rKClcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwbGFjZUNvbXB1dGVyU2hpcHMoKTtcblxuICByZXR1cm4ge1xuICAgIGdldCBodW1hblBsYXllcigpIHtcbiAgICAgIHJldHVybiBodW1hblBsYXllcjtcbiAgICB9LFxuICAgIGdldCBjb21wdXRlclBsYXllcigpIHtcbiAgICAgIHJldHVybiBjb21wdXRlclBsYXllcjtcbiAgICB9LFxuICAgIGdldCBwbGF5ZXJTaGlwcygpIHtcbiAgICAgIHJldHVybiBwbGF5ZXJTaGlwcztcbiAgICB9LFxuICAgIGdldCBwbGFjZW1lbnRPcmllbnRhdGlvbigpIHtcbiAgICAgIHJldHVybiBwbGFjZW1lbnRPcmllbnRhdGlvbjtcbiAgICB9LFxuICAgIGNoYW5nZVBsYWNlbWVudE9yaWVudGF0aW9uLFxuICAgIHBsYXlUdXJuLFxuICAgIGdhbWVPdmVyLFxuICAgIHBsYWNlU2hpcCxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWU7XG4iLCJpbXBvcnQgc2NyZWVuQ29udHJvbGxlciBmcm9tIFwiLi9zY3JlZW5Db250cm9sbGVyXCI7XG5cbnNjcmVlbkNvbnRyb2xsZXIoKTtcbiJdLCJuYW1lcyI6WyJnQm9hcmQiLCJib2FyZCIsImkiLCJyb3ciLCJqIiwiY2VsbCIsImlzSGl0Iiwic2hpcE9iaiIsInB1c2giLCJzaGlwcyIsImNoZWNrQ29vcmRpbmF0ZXMiLCJsZW5ndGgiLCJjb2wiLCJvcmllbnRhdGlvbiIsIm5ld1JvdyIsIm5ld0NvbCIsInBsYWNlU2hpcCIsInNoaXAiLCJyZWNlaXZlQXR0YWNrIiwiaGl0Iiwic3VuayIsImNoZWNrQWxsU2hpcHNTdW5rIiwiYXR0YWNrIiwiZW5lbXkiLCJ2YWxpZEVuZW15Q2VsbHMiLCJyYW5kb21BdHRhY2siLCJyYW5kb21JbmRleCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInJhbmRvbUNlbGwiLCJzcGxpY2UiLCJzaGlwTmFtZSIsInRpbWVzSGl0IiwibmFtZSIsImdhbWVDb250cm9sbGVyIiwiaHVtYW5QbGF5ZXIiLCJjb21wdXRlclBsYXllciIsInBsYXllclNoaXBzIiwicGxhY2VtZW50T3JpZW50YXRpb24iLCJnYW1lT3ZlciIsImNvbXB1dGVyQm9hdHMiLCJib2F0IiwicGxhY2VDb21wdXRlclNoaXBzIiwiY2hhbmdlUGxhY2VtZW50T3JpZW50YXRpb24iLCJwbGF5VHVybiIsImh1bWFuQXR0YWNrUmVzdWx0IiwiY29tcHV0ZXJBdHRhY2tSZXN1bHQiLCJzaGlmdCIsImJvYXJkcyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZyaWVuZGx5Q2VsbHMiLCJlbmVteUNlbGxzIiwiZGlzcGxheSIsInF1ZXJ5U2VsZWN0b3IiLCJyb3RhdGVCdXR0b24iLCJtb3VzZW92ZXJHaG9zdFNoaXAiLCJOdW1iZXIiLCJ0aGlzIiwicGFyZW50RWxlbWVudCIsImRhdGFzZXQiLCJzaGlwTGVuZ3RoIiwiY2hpbGRyZW4iLCJjbGFzc0xpc3QiLCJhZGQiLCJtb3VzZW91dEdob3N0U2hpcCIsInJlbW92ZSIsImVtcHR5Q2VsbEhpdCIsInJlbmRlckJvYXJkIiwicGxheWVyIiwiYm9hcmROdW1iZXIiLCJiaW5kQ29udHJvbHMiLCJmb3JFYWNoIiwiYWRkRXZlbnRMaXN0ZW5lciIsImF0dGFja0NlbGwiLCJ1cGRhdGVEaXNwbGF5IiwicmVzdWx0IiwiaW5uZXJUZXh0IiwicGxheVR1cm5SZXN1bHQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic2V0VGltZW91dCIsInBsYWNlUGxheWVyU2hpcCIsInNoaXBzQXJyYXkiLCJ0b2dnbGUiXSwic291cmNlUm9vdCI6IiJ9