class Gameboard {
    constructor(rows, columns, idHtmlTable) {
        this.rows = rows;
        this.columns = columns;
        this.idHtmlTable = idHtmlTable;
        this.numberOfCell = 0;
        this.obstacles = cellsObsctacles;
        this.weapons = cellsWeapons;
        this.players = cellsPlayers;
        this.indexCurrentPlayer = indexCurrentPlayer;
    }

    createTheGameBoard() {

        let gameboard = document.getElementById(this.idHtmlTable);

        for (let i = 0; i < this.rows; i++) {
            let tr = document.createElement("tr");
            tr.setAttribute("class", "row");
            gameboard.appendChild(tr);

            for(let i = 0; i < this.columns; i++) {
                let td = document.createElement("td");
                td.setAttribute("id", this.numberOfCell);
                td.setAttribute("class", "cell");
                tr.appendChild(td);
                this.numberOfCell++;
                cellsIndex.push(this.numberOfCell-1);
            }
        }  

        console.log("cellsIndex:", cellsIndex);
    }
    
    generateObstacles() {

        //nombre maximum de cellules
        let maxCells = rowGameBoard * columnGameBoard - 1;

        let obstacleIndex = -1;

        for(let i = 0; i < numberOfObstacles; i++) {            

            do {
                //nombre aléatoire * nombre maximum de cellules
                obstacleIndex = Math.round(Math.random() * maxCells);
                console.log("obstacleIndex :", obstacleIndex);

            } while(!this.cellIsFree(obstacleIndex));

            $("td#"+obstacleIndex).addClass("obstacle");
            let obstacle = new Obstacle(obstacleIndex);
            this.obstacles.push(obstacle);
        }

        console.log("obstacles :", this.obstacles);

    } 
    
    generateWeapons() {

        let maxCells = rowGameBoard * columnGameBoard - 1;

        let weaponIndex = -1;

        for (let i = 0; i < numberOfWeapons; i++) {
            
            do {

                weaponIndex = Math.round(Math.random() * maxCells);

            } while(!this.cellIsFree(weaponIndex));
            
            let randomWeapon = randomNumberWeapon();
            let weapon = new Weapon(i, weaponIndex, randomWeapon);
            this.weapons.push(weapon);
            console.log('arme: ', weapon);

            let imgWeapon = $("<img />");
            let imgWeaponUrl = `assets/imgs/weapons/${weapon.name}.png`;
            imgWeapon.attr("class", "weaponRandom");
            imgWeapon.attr("src", imgWeaponUrl);    
            imgWeapon.appendTo("td#"+weaponIndex, randomWeapon);            
        }

    }    

    addPlayers() {

        let maxCells = rowGameBoard * columnGameBoard - 1;

        let playerIndex = -1;

        for (let i = 0; i < numberOfPlayers; i++) {

            do { 

                playerIndex = Math.round(Math.random() * maxCells);

            } while(!this.cellIsFree(playerIndex));

            let firstWeapon = "Fork";
            let weapon = new Weapon(this.weapons.length + 1, playerIndex, firstWeapon);
            let player = new Player(i, playerIndex, weapon.id);

            this.players.push(player);
            this.weapons.push(weapon);

            let imgWeapon = $("<img />");
            let imgWeaponUrl = `assets/imgs/weapons/${firstWeapon}.png`;

            imgWeapon.attr("class", "weaponStartThePlayer");
            imgWeapon.attr("src", imgWeaponUrl);    
            imgWeapon.appendTo("td#"+playerIndex, 0);     

            let imgPlayer = $("<img />");
            let imgPlayerUrl = "assets/imgs/players/alien.png";

            imgPlayer.attr("class", "playerWithStartWeapon");
            imgPlayer.attr("src", imgPlayerUrl);  
            imgPlayer.appendTo("td#"+playerIndex, 0);

        }
    }

    //le paramètre index : 
    cellIsFree(index) {

        let isfree = true;

        isfree = this.obstacles.filter(ob => ob.position === index).length > 0 ? false : isfree;

        isfree = this.weapons.filter(wp => wp.position === index).length > 0 ? false : isfree;

        isfree = this.players.filter(pl => pl.position === index).length > 0 ? false : isfree;

        return isfree;

    }   

    //cellIsMovable est une fonction qui permet de déterminer si les positions entre le joueur et les obstacles
    cellIsMovable(index) {

        let isMovable = true;

        isMovable = this.obstacles.filter(ob => ob.position === index).length > 0 ? false : isMovable;

        isMovable = this.players.filter(pl => pl.position === index).length > 0 ? false : isMovable;

        return isMovable;


    }


    //moveInDirection est une fonction qui vas nous permettre de pourvoir indiquer ou est ce que notre joueur peut se déplacer sur le plateau de jeu
    moveInDirection(playerPosition, step) {

        // Itération -10 à -30
        // i = -10         
        // i = -20
        // i = -30     // stop

        // i est égale à une step qui est en réalité une case du tableau
        //countStep est égale à une itération d'une step
        let countStep = step;

        //cette variable permet de tester/vérifier les cases sur lesquelles le joueur peut se déplacer 
        let moveInStepIsPossible;

        // Premier test
        if(step < 0){
            moveInStepIsPossible = countStep >= (step * numberMove);
        } else {
            moveInStepIsPossible = countStep <= (step * numberMove);
        }

        // step = 10
        // ité  moveInStepIsPossible = countStep <= (step * numberMove);
        // 1      true  = 10        <= (10   * 3) 
        // 2      true  = 20        <= (10   * 3)
        // 3      true  = 30        <= (10   * 3)
        // 4      false = 40        <= (10   * 3) => arrêt boucle

        // tant que les mouvements sont possibles
        while (moveInStepIsPossible) {
            
            let gameBoardLine = playerPosition % this.columns;
            let mapLimitation;

            // Vérification des limites de la map à droite et à gauche du joueur
            if(step == 1) {
                mapLimitation = (gameBoardLine + countStep) < this.columns;
            } else if(step == -1) {
                mapLimitation = (gameBoardLine + countStep) > -1;
            } else {
                mapLimitation = true;
            }

            //Ajout de couleur dans les steps ou le joueur peut se déplacer
            if(this.cellIsMovable(playerPosition + countStep) && mapLimitation){
                let resultMove = playerPosition + countStep;
                $("td#"+resultMove).addClass(colorStep);
            } else {
                break;
            }

            //incrémentation du compteur de cases ou le player peut bouger
            countStep = countStep + step;

            // Dernier test dans la boucle
            if(step < 0){
                moveInStepIsPossible = countStep >= (step * numberMove);
            } else {
                moveInStepIsPossible = countStep <= (step * numberMove);
            }

        }

    }



    //Si les déplacements sont autorisés et si je clique sur une case dispo est de couleur 
    // Remove le skin du player et ajoute le skin dans la case cliquer
    //si cette case contient une arme prends l'arme et dépose celle qui est déjà rattachée au joueurs
    //Attention le joueur ne peut pas disposer de 2 armes à la fois 

    moveIsPossible() {        
        // vérification à droite à gauche, au-dessus et en-dessous de l'index du joueur 
        // division pair ou impair  +1 ou -1
        // vérification si obstcales ou pas 
    
        //let positionPlayer1 = cellsPlayers[0].position;
        //let positionPlayer2 = cellsPlayers[1].position;

        //let opponentPlayer = this.players[this.id == 0 ? 1 : 0].position;
        //console.log("opponentPlayer :", opponentPlayer);

        //console.log("Joueur 1", positionPlayer1);
        //console.log("Joueur 2:", positionPlayer2);

 
        //Mouvements Joueur 1
        //définition des paramètres pour le joueur 1
        //this.moveInDirection(positionPlayer1, 1, "moveIsPossiblePlayer1"); //mouvements à droite
        //this.moveInDirection(positionPlayer1, this.columns, "moveIsPossiblePlayer1"); //mouvement en bas
        //this.moveInDirection(positionPlayer1, -1, "moveIsPossiblePlayer1"); //mouvements à gauche
        //this.moveInDirection(positionPlayer1, this.columns * -1, "moveIsPossiblePlayer1"); //mouvements en haut


        //Mouvements Joueur 2
        //définition des paramètres pour le joueur 2
        //this.moveInDirection(positionPlayer2, 1, "moveIsPossiblePlayer2"); //mouvements à droite
        //this.moveInDirection(positionPlayer2, this.columns, "moveIsPossiblePlayer2"); //mouvements en bas
        //this.moveInDirection(positionPlayer2, -1, "moveIsPossiblePlayer2"); //mouvements à gauche
        //this.moveInDirection(positionPlayer2, this.columns * -1, "moveIsPossiblePlayer2"); //mouvements en haut

        //fonction nextplayer => qui doit calculer et renvoyer le nouvel index du current player
        // map.js => gameboard.js
        //tout revoir de A à Z faire une petite doc pour bien comprendre comment fonctionne le code depuis le début
        
        //récupération de l'index actuel du joueur 
        let currentPlayer = cellsPlayers[indexCurrentPlayer];

        console.log("current player:", currentPlayer.position);

        //tableau des positions des joueurs 
        let tablePositionPlayer = []; 

        //tableau regroupant les différentes directions possibles des joueurs
        let tableDirection = [1, this.columns, -1, this.columns * -1];

        //console.log("tablePositionPlayer", tablePositionPlayer);
        //console.log("tableDirection", tableDirection);
        //console.log("cellPlayers", cellsPlayers);

        for (cellPositionPlayer = 0; cellPositionPlayer < playerPosition; cellPositionPlayer++) {
            tablePositionPlayer = playerPosition;
        }

        console.log(tablePositionPlayer);

        //let currentPlayer = 1;

        for(let i = 0; i < tablePositionPlayer; i++) {

            for(let i = 0; i < tableDirection; i++) {

                this.moveInDirection(playerPosition, tableDirection, "moveIsPossible" /*+ currentPlayer*/);

            }

           // currentPlayer + 1;

        }


        // V2


        // Déclaration pos tab joueur

        // array('baba', 'artoul');
        // 1ere itération player = baba
        // 2eme itération player = artoul

        
        //foreach(cellsPlayers as player) {
        //    taPosPlayer[] = player.position;
        //}
        // Fin déclaration tab player

        // Début de définition des position possible

        // Boucle player

        //foreach(tabPosPlay as posPlayer) {

           // foreach(tabDirection as direc) {

            //    this.moveInDirection(posPlayer, direc, "moveIsPossiblePlayer"+ currentPlayer); //mouvements en haut

            //}

            //currentPlayer + 1;

        //}


    }

    
    enterThePlayerName() {

        $('#buttonCreateName1').on("click", function () {
            if ($('#createName1').val().length === 0) { // Si le joueur 1 n'a pas rentrer son pseudo
                $('#createName1').css('border', '1px solid red');
                $('#playerName1').text('Entrez votre nom !').css({  //on affiche un message d'erreur
                    'color': 'red',
                    'font-weight': 'bold'
                });
            } else {
                $('#playerName1').replaceWith("<h3 class='playerName1' id='playerName1'>" + $('#createName1').val() + "</h3>"); // Remplace player 1 par le nom du joueur
                $('#createNameContainer1').fadeOut("3000"); // on efface les inputs
                $('#createName1').val(''); // ici on remets l'input à zéro
                //Afficher player ici
            }
        });

        $('#buttonCreateName2').on("click", function () {
            if (($('#createName2').val().length === 0) || ($('#playerName1').text() === $('#createName2').val())) { // Si le joueur 2 n'a pas rentrer son pseudo ou si c'est le meme que le joueur 1
                $('#createName2').css('border', '1px solid red');
                $('#playerName2').text('Entrez votre nom !').css({ // on affiche un message d'erreur 
                    'color': 'red',
                    'font-weight': 'bold'
                });
            } else {
                $('#playerName2').replaceWith("<h3 class='playerName2' id='playerName2'>" + $('#createName2').val() + "</h3>");
                $('#createNameContainer2').fadeOut("3000");
                $('#createName2').val('');

                // Système de pile ou face pour déterminer quel joueur commence
                // le joueur qui perd est grisé et l'autre peut commencer à jouer
                //$('#rules').html('Qui commence ? <button class="startGamePile" id="startGamePile">Pile</button> ou <button class="startGameFace" id="startGameFace">Face</button>');
            }
        });
    }
    

} 


