//------ MAP DU JEU ------//

//Génération de la map du jeu
function createTheGameBoard() {

    context.fillStyle = "#BF7930";
    context.fillRect(0, 0, gameBoardMaxWidth, gameBoardMaxHeight);

    let column = 0;
    let row = 0;

    for(let i = 0; i < numberOfGameBox; i++) {

        //définition d'une couleur de contour pour les cases 
        context.strokeStyle = "#996126";

        //création d'une case
        context.strokeRect(sizeOfGameBox * column, sizeOfGameBox * row, sizeOfGameBox, sizeOfGameBox);

        //Chaque cases de la map est un objet qui comprends les paramètres suivants :
        allGameBox[i] = {
            GameBoxnumber: i,
            id: "empty",
            columnPosition: sizeOfGameBox * column + 1, //position -> X
            rowPosition: sizeOfGameBox * row + 1 //position -> Y
        };

        column++;

        if(column === numberOfGameBoxWidth) {
            column = 0;
            row++;
        }
    }
}

createTheGameBoard();

//Génération d'un nombre aléatoire entre 0 et 99
function randomNumber() {
    return Math.floor(Math.random() * (numberOfGameBox - 1));
}

for(let i = 0; i < numberOfObstacles; i++) {
    
    let numberOfRandomGameBox = randomNumber();

    if(allGameBox[numberOfRandomGameBox].id !== "empty") {
        i--;
    } else {
        allGameBox[numberOfRandomGameBox].id = "obstacle";
    } 

}

for(let i = 0; i < numberOfGameBox; i++) {

    (function(i) {  

        if(allGameBox[i].id === "obstacle") {

            let obstacle = new Image();
            obstacle.src = "assets/imgs/obstacle.svg";

            obstacle.addEventListener('load', 
                () => {
                    context.drawImage(obstacle, allGameBox[i].columnPosition, allGameBox[i].rowPosition);
            }, false);

        }

    })(i);

}