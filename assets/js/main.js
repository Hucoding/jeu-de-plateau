//objects
const gameBoard = new Gameboard(10, 10);
const weapons = new Weapon();
const players = new Player();

$(document).ready(function() {
    gameBoard.createTheGameBoard();
    gameBoard.generateObstacles();
    gameBoard.generateWeapons();
    gameBoard.addPlayers();
    //gameBoard.checkOddOrEvenNumber();
    //gameBoard.cellIsFree();
    gameBoard.moveIsPossible();
    gameBoard.enterThePlayerName();
});     