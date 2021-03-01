const gameBoard = new Gameboard(10, 10, "gameBoard", indexCurrentPlayer);

//démo d'un objet joueur
const player = new  Player(3, "test", 20, 4, "");

$(document).ready(function() {
    gameBoard.testInit();
    let namePlayer = player.getName();
    console.log('namePlayer' + namePlayer);
    player.setName("toto");
    namePlayer = player.getName();
    console.log('namePlayer' + namePlayer);
});     