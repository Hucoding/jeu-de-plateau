//Nombre de colonnes et de lignes
let columnGameBoard = 10;
let rowGameBoard =  10;

//index initial du premier joueur
let indexCurrentPlayer = 0;

//Nombre d'obstacles
let numberOfObstacles = 10;

//Nombre d'armes
let numberOfWeapons = 4;

//Nombre de joueur Max
let numberOfPlayers = 2;

//vie du joueur
let maxLife = 100;

let numberMove = 3;

//Nom du skin utilisé par le joueur
let playerSkin = "alien-fork";

let numberOfGameBox = rowGameBoard * columnGameBoard;

function randomNumberWeapon() {
    return Math.floor(Math.random() * Math.floor(numberOfWeapons));
}

let cellsIndex = [];
let cellsWeapons = [];
let cellsObsctacles = [];
let cellsPlayers = [];

