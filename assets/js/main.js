const gameBoard = new Gameboard(10, 10, "gameBoard", indexCurrentPlayer);

$(document).ready(function() {
    gameBoard.testInit();
});     