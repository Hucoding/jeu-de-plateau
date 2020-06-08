//------ VARIABLES GLOBALES ------//

//canvas
let gameBoard = document.getElementById("gameBoard");
//contexte => 2D
let context = gameBoard.getContext("2d");

//Dimensions du canvas
gameBoard.width = 600;
gameBoard.height = 600;

//initialisation dimensions de la map
let gameBoardMaxWidth = gameBoard.width;
let gameBoardMaxHeight = gameBoard.height;

//Dimensions des cases de la map
let sizeOfGameBox = 60;

//nombre de cases sur une largeur
let numberOfGameBoxWidth = gameBoardMaxWidth / sizeOfGameBox;

//nombre de cases sur une hauteur
let numberOfGameBoxHeight = gameBoardMaxHeight / sizeOfGameBox;

//nombre de cases sur la largeur multiplié par nombres de cases sur la hauteur = nombre total de cases sur la map
let numberOfGameBox = numberOfGameBoxWidth * numberOfGameBoxHeight;

//Cases de la map
let allGameBox = [];

//nombres d'obstacles à générer sur la map
let numberOfObstacles = 10;

//armes sur la map
let weaponsInventory = [];