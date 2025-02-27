// const Gameboard = {
//   gameboard: ["", "", "", "", "", "", "", "", ""],
//   winCondition: ["1 2 3"],

//   return Array.from({ length: numberOfCells }).map(() => ({
//     marker: "",
//     filled: false,
//     filledBy: "",

// };
// [
// 1   [1   ,2   ,3]
// 2   [1   ,2   ,3]
// 3   [1   ,2   ,3]
// ]
// [
// 1   [x   ,x   ,o]
// 2   [1   ,x   ,o]
// 3   [1   ,o   ,o]
// ]
// [
//    1   ,2   ,3
//    4   ,5   ,6
//    7   ,8   ,9
// ]
// wind condition in case of 2d array 1 2 3
// for let say i = 1 and j = 1 j would check 1 2 3

const cell = () => {
  let value = null;

  function getCellValue() {
    return value;
  }

  function markCell(marker) {
    value = marker;
  }
  function cellEmpty() {
    return value === null;
  }
  return {
    getCellValue,
    markCell,
    cellEmpty,
  };
};

const Gameboard = (function (cell) {
  let ROWS = 3;
  let gameboard = [];

  function getGameboard() {
    return gameboard;
  }
  function printGameboard() {
    return gameboard.map((elArr) => elArr.map((el) => el.getCellValue()));
  }
  function prepareGameboard() {
    gameboard = Array.from({ length: ROWS }).map(() =>
      Array.from({ length: ROWS }, (_) => cell())
    );
  }
  function resetGameboard() {
    gameboard.splice(0);
    prepareGameboard();
  }
  function markGameboardCell(row, col, marker) {
    if (!gameboard[row][col].cellEmpty()) {
      return false;
    }
    gameboard[row][col].markCell(marker);
    return true;
  }

  function changeGameboardDimension(dimension) {
    ROWS = dimension;
    prepareGameboard();
  }

  prepareGameboard();
  return {
    getGameboard,
    resetGameboard,
    markGameboardCell,
    printGameboard,
    changeGameboardDimension,
  };
})(cell);

const createPlayer = function (name, marker, role) {
  return {
    name,
    marker,
    role,
    get getName() {
      return this.name;
    },
    set setName(newName) {
      this.name = newName;
    },
    get getMarker() {
      return this.marker;
    },
    set setMarker(marker) {
      this.marker = marker;
    },
    get getRole() {
      return this.role;
    },
  };
};

const GameController = (function (gameboard, createPlayer) {
  const players = [
    createPlayer("Player 1", "X", "player-1"),
    createPlayer("Player 2", "O", "player-2"),
  ];
  let activePlayer = players[0];
  let gameStart = false;
  let round = 1;
  function getActivePlayer() {
    return activePlayer;
  }
  function switchActivePlayer() {
    activePlayer =
      activePlayer.getName === players[0].getName ? players.at(-1) : players[0];
  }
  function changePlayerName(name, isPlayer1 = true) {
    if (gameStart) return;
    players[isPlayer1 ? 0 : 1].setName = name;
  }
  function changePlayerMarker(marker, isPlayer1 = true) {
    if (gameStart) return;
    players[isPlayer1 ? 0 : 1].setMarker = marker;
  }

  function playRound(row, col) {
    const validMove = gameboard.markGameboardCell(
      row,
      col,
      activePlayer.getMarker
    );
    if (gameboard.length + 2 >= round && winCondition()) {
      return;
    }
    if (!validMove) {
      return "invalid move";
    }

    // if (winCondition) {
    //   return `#{activePlayer.getName Won}`;
    // }
    switchActivePlayer();
  }
  function winCondition() {
    const boardSize = gameboard.length;
    //   checking for row

    //   checking for rows
    for (let row = 0; row < boardSize; row++) {
      if (
        board[row].every(
          (cell) => cell.getCellValue() === activePlayer.getMarker
        )
      ) {
        return true;
      }
    }

    //   checking for columns
    for (let col = 0; col < boardSize; col++) {
      if (
        board.every(
          (cell) => cell[col].getCellValue() === activePlayer.getMarker
        )
      ) {
        return true;
      }
    }

    //   checking for diagonal
    const middle = Math.floor(boardSize / 2);
    if (board[middle][middle] === activePlayer.getMarker) {
      let isDiagonalWin = true;
      let isAntiDiagonalWin = true;
      for (let i = 0; i < board.length; j++) {
        //   boardCol.push(board[j][i]);
        if (board[i][i] !== activePlayer.getMarker) {
          isDiagonalWin = false;
        }
        if (board[i][boardSize - 1 - i] !== activePlayer.getMarker) {
          isAntiDiagonalWin = false;
        }
      }

      if (isAntiDiagonalWin || isDiagonalWin) return true;
    }

    return false;
  }

  return {
    changePlayerMarker,
    changePlayerName,
    playRound,
    changeGameboardDimension: gameboard.changeGameboardDimension,
    players,
    getActivePlayer,
  };
})(Gameboard, createPlayer);

const ViewController = function () {
  const templateClone = document
    .querySelector("[data-template]")
    .content.cloneNode(true);
  const formTemplateEl = templateClone.querySelector("[data-form]");
  const dialogEl = document.querySelector("[data-dialog]");
  const boardEL = document.querySelector("[data-board]");
  const BOARD_DIMENSION = 3;

  const gameHeaderEl = document.querySelector("[data-game-header]");
  const playerOneInfoEl = document.querySelector("[data-player-info='1']");
  const playerTwoInfoEl = document.querySelector("[data-player-info='2']");
  const messageBox = document.querySelector(".message");
  function resetDOMBoard() {
    boardEL.replaceChildren();
    let row = 0;
    let col = 0;
    const cells = Array.from(
      { length: BOARD_DIMENSION * BOARD_DIMENSION },
      (el, index) => {
        const cell = document.createElement("div");
        cell.classList.add("grid-item");
        cell.setAttribute("data-cell", `${row}${col}`);
        if (BOARD_DIMENSION - 1 === col) {
          ++row;
          col = 0;
        } else {
          ++col;
        }
        return cell;
      }
    );

    boardEL.append(...cells);
  }

  function init() {
    formTemplateEl.addEventListener("submit", (e) => {
      e.preventDefault();
      let p1Name = e.target.querySelector("[data-p1-name]").value;
      let p2Name = e.target.querySelector("[data-p2-name]").value;
      let p1Marker = e.target.querySelector("[data-p1-marker]").value;
      let p2Marker = e.target.querySelector("[data-p2-marker]").value;
      if (p1Name.trim() === "") {
        p1Name = "Player 1";
      }
      if (p2Name.trim() === "") {
        p2Name = "Player 2";
      }
      if (p1Name.trim() === p2Name.trim()) {
        p2Name = "Player 2";
      }
      if (p1Marker.trim() === "") {
        p1Marker = "X";
      }
      if (p2Marker.trim() === "") {
        p2Marker = "O";
      }
      if (p1Marker.trim() === p2Marker.trim()) {
        p1Marker = "O";
      }

      GameController.changePlayerName(p1Name);
      GameController.changePlayerName(p2Name, false);
      GameController.changePlayerMarker(p1Marker);
      GameController.changePlayerMarker(p2Marker, false);
      dialogEl.close();
      dialogEl.replaceChildren();

      GameController.changeGameboardDimension(BOARD_DIMENSION);
      resetDOMBoard();
    });
    dialogEl.append(formTemplateEl);
    dialogEl.showModal();

    const activePlayer = GameController.getActivePlayer();
    messageBox.textContent = activePlayer.getName + " Turn.";
    boardHoverEventHandler();
  }

  function boardHoverEventHandler() {
    boardEL.addEventListener("mouseover", (e) => {
      const activePlayer = GameController.getActivePlayer();
      const targetEl = e.target.closest(".grid-item");
      if (!targetEl) {
        return;
      }
      if (targetEl.classList.contains("filled")) {
        return;
      }
      targetEl.classList.add(
        `${activePlayer.role === "player-1" ? "item--hover-p1" : "item--hover"}`
      );

      targetEl.textContent = activePlayer.getMarker;
    });
    boardEL.addEventListener("mouseout", (e) => {
      const activePlayer = GameController.getActivePlayer();
      const targetEl = e.target.closest(".grid-item");
      if (!targetEl) {
        return;
      }
      if (targetEl.classList.contains("filled")) {
        return;
      }
      targetEl.classList.remove(
        `${activePlayer.role === "player-1" ? "item--hover-p1" : "item--hover"}`
      );
      targetEl.textContent = "";
    });

    boardEL.addEventListener("click", (e) => {
      const targetEl = e.target.closest(".grid-item");
      if (!targetEl) {
        return;
      }
      if (targetEl.classList.contains("filled")) {
        return;
      }
      console.log(targetEl);
      const data = targetEl.dataset.cell.split("");
      console.log(data);
      const validMove = GameController.playRound(data[0], data[1]);

      if (validMove === "invalid move") {
        return;
      }
      if (typeof validMove === String) {
        console.log(validMove);
      }
      const activePlayer = GameController.getActivePlayer();
      messageBox.textContent = activePlayer.getName + " Turn.";
      playerOneInfoEl.classList.remove("player__info-container--accent");
      playerTwoInfoEl.classList.remove("player__info-container--accent");
      if (activePlayer.role === "player-1") {
        playerOneInfoEl.classList.add("player__info-container--accent");
      } else {
        playerTwoInfoEl.classList.add("player__info-container--accent");
      }

      targetEl.classList.remove("item--hover-p1", "item--hover");
      targetEl.textContent = activePlayer.getMarker;
      targetEl.classList.add("filled", `grid-item--${activePlayer.getRole}`);
    });
  }
  return { init };
};
// function handle

document.addEventListener("DOMContentLoaded", (e) => {
  const templateClone = document
    .querySelector("[data-template]")
    .content.cloneNode(true);

  const viewController = ViewController();
  viewController.init();
});
