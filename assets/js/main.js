//objects
const gameBoard = new Gameboard(10, 10, "gameBoard", indexCurrentPlayer);
// const obstacles = new Obstacle();
// const weapons = new Weapon();
// const players = new Player();

$(document).ready(function() {
    /*
    gameBoard.createTheGameBoard();
    gameBoard.generateObstacles();
    gameBoard.generateWeapons();
    gameBoard.addPlayers();
    gameBoard.createPlayerNameForm();
    gameBoard.updateWeapons();
    gameBoard.update();
    gameBoard.findMyCurrentPlayer();
    gameBoard.nextPlayer();
    */
    gameBoard.testInit();
    //gameBoard.moveIsPossible();
    //gameBoard.moveInDirection();
});     