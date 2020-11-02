//index initial du premier joueur
let indexCurrentPlayer = 1;

//Nombre d'obstacles
let numberOfObstacles = 10;

//Nombre d'armes
let numberOfWeapons = 4;

//Nombre de joueur Max
let numberOfPlayers = 2;

//vie du joueur
let maxLife = 100;

let numberMove = 4;

//Nom du skin utilisé par le joueur
let playerSkin = "alien-fork";

//Couleur de fond des joueurs
let playerBackgroundColor = ["royalblue", "#ff3333"]; //blue , red
 
function randomNumberWeapon() {
    return Math.floor(Math.random() * Math.floor(numberOfWeapons));
}


let cellsIndex = [];
let cellsWeapons = [];
let cellsObsctacles = [];
let cellsPlayers = [];

