class Gameboard {
    constructor(rows, columns, idHtmlTable, indexCurrentPlayer) {
        this.rows = rows;
        this.columns = columns;
        this.idHtmlTable = idHtmlTable;
        this.numberOfCell = 0;
        this.obstacles = cellsObsctacles;
        this.weapons = cellsWeapons;
        this.players = cellsPlayers;
        this.indexCurrentPlayer = indexCurrentPlayer;
        console.log("index current value in gameBoard Controller:", this.indexCurrentPlayer);

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

        //console.log("cellsIndex:", cellsIndex);
    }
    
    generateObstacles() {

        //nombre maximum de cellules
        let maxCells = this.rows * this.columns - 1;

        let obstacleIndex = -1;

        for(let i = 0; i < numberOfObstacles; i++) {            

            do {
                //nombre aléatoire * nombre maximum de cellules
                obstacleIndex = Math.round(Math.random() * maxCells);
                //console.log("obstacleIndex :", obstacleIndex);

            } while(!this.cellIsFree(obstacleIndex));

            $("td#"+obstacleIndex)
                .addClass("obstacle")
                .click( (e) => {
                    console.log("event:", e.target);
                    //console.log($(this).attr('id'));
                });

            let obstacle = new Obstacle(obstacleIndex);

            //this.update(obstacle);

            this.obstacles.push(obstacle);
        }

    } 
    
    generateWeapons() {

        let maxCells = this.rows * this.columns - 1;

        let weaponIndex = -1;

        for (let i = 0; i < numberOfWeapons; i++) {
            
            do {

                weaponIndex = Math.round(Math.random() * maxCells);

            } while(!this.cellIsFree(weaponIndex));
            
            let randomWeapon = randomNumberWeapon();
            let weapon = new Weapon(i, weaponIndex, randomWeapon);

            this.weapons.push(weapon);
            //console.log('arme: ', weapon);

            let imgWeapon = $("<img />");
            let imgWeaponUrl = `assets/imgs/weapons/${weapon.name}.png`;
            imgWeapon.attr("class", "weaponRandom");
            imgWeapon.attr("src", imgWeaponUrl);    
            imgWeapon.appendTo("td#"+weaponIndex, randomWeapon);            
        }

    }    

    addPlayers() {

        let maxCells = this.rows * this.columns - 1;

        let playerIndex = -1;

        for (let i = 0; i < numberOfPlayers; i++) {

            do { 

                playerIndex = Math.round(Math.random() * maxCells);

            } while(!this.cellIsFree(playerIndex));

            let firstWeapon = "Fork";
            let playerId = i+1;
            let playerName = "Joueur" + "_" + `${playerId}`;
            let weaponId = this.weapons.length + 1;
            let weapon = new Weapon(weaponId, playerIndex, firstWeapon);
            let playerWeaponId = weapon.id;
            let player = new Player(playerId, playerName, playerIndex, playerWeaponId);

            this.createPlayerNameForm(player, playerId, playerName);
            this.updateWeapons(weaponId, playerWeaponId);
            this.update(player, playerId, playerName, playerIndex, playerWeaponId);

            //let tablePlayers = this.players;

            indexCurrentPlayer = playerId;
            this.nextPlayer(indexCurrentPlayer);

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

    //Cette fonction permet la création du formulaire d'entrée du nom du joueur de façon dynamique, on passe en paramètre l'id du joueur ainsi que son Nom par défaut
    createPlayerNameForm(player, playerId, playerName) {

        let playerNameClassId = "playerName" + playerId;

        /* Création du form pour le joueur */
        let containerLeftOrRight = $("<div></div>");
        containerLeftOrRight.attr("class", "playerPanel"+playerId);
        containerLeftOrRight.attr("id", "playerName"+playerId);

        containerLeftOrRight.appendTo('.gameContainer');

        /* Affichage du nom du joueur dans le form */
        let playerContainerStats = $("<h3></h3>");
        playerContainerStats.attr("class", playerNameClassId);
        playerContainerStats.attr("id", playerNameClassId);

        playerContainerStats.appendTo(containerLeftOrRight);

        /* création de l'image du joueur dans le form */
        let imgPlayerInContainerStats = $("<img />");
        let imgPlayerUrlInContainerStats = "./assets/imgs/players/alien.png";
        imgPlayerInContainerStats.attr("class", "playerImg" + playerId);
        imgPlayerInContainerStats.attr("src", imgPlayerUrlInContainerStats);
        imgPlayerInContainerStats.attr("alt", "personnage " + playerName);

        playerContainerStats.append(playerName);
        imgPlayerInContainerStats.appendTo(containerLeftOrRight);

        /* création de la div qui contient l'input ou le joueur peut changer son pseudo */
        let createNameContainer = $("<div></div>");
        createNameContainer.attr("class", "createNameContainer");
        createNameContainer.attr("id", "createNameContainer" + playerId);

        /* ajout de l'input dans la div */
        let inputChangePseudo = $("<input />");
        inputChangePseudo.attr("type", "text");
        inputChangePseudo.attr("class", "createName" + playerId);
        inputChangePseudo.attr("id", "createName" + playerId);
        inputChangePseudo.attr("name", "createName" + playerId);
        inputChangePseudo.attr("placeholder", "Créer votre pseudo...");

        /* ajout du bouton de validation du formulaire */
        let buttonValidateChange = $("<button></button>");
        buttonValidateChange.attr("class", "buttonCreateName");
        buttonValidateChange.attr("id", "buttonCreateName" + playerId);
        buttonValidateChange.append("OK");

        createNameContainer.appendTo(containerLeftOrRight);
        inputChangePseudo.appendTo(createNameContainer);
        buttonValidateChange.appendTo(createNameContainer);

        /* si un player et undefined on ne créer pas de nouveau form joueur */
        if(player === undefined) {
            containerLeftOrRight.remove();
        }

    }

    updateWeapons(weaponId, playerWeaponId) {

        if (weaponId != playerWeaponId) {
            toastr["error"]("l id de l arme ramassé doit etre égale à l id de l arme que possède le joueur", "error");
        } else if (typeof weaponId != "number" && typeof playerWeaponId != "number") {
            toastr["error"]("il y'a un problème l'id est une string !", "error");
        } else {
            toastr["success"]("aucun problème", "success");
        }


    }

    // Création d'une fonction de mise a jour du nom du joueur et du formulaire
    update(player, playerId, playerName, playerIndex) {

        //ce premier bloc de code à pour but de mettre à jour et remplacer le nom du joueur par défaut lorsque l'utilisateur rentre un nom personnalisé pour le joueur
        $('#buttonCreateName' + playerId).on("click", function () {
            if ($('#createName'+ playerId).val().length === 0) { // Si le joueur 1 n'a pas rentrer son pseudo
                $('#createName'+ playerId).css('border', '1px solid red');
                $('#playerName'+ playerId).text('Entrez votre nom !').css({  //on affiche un message d'erreur
                    'color': 'red',
                    'font-weight': 'bold'
                });
            } else {

                let playerClassAndIdName = 'playerName'+ playerId;
                let newPlayerName = $('#createName'+ playerId).val();
                
                $('.playerName'+ playerId).replaceWith("<h3 class=" + playerClassAndIdName + " id=" + playerClassAndIdName + ">" + newPlayerName + "</h3>"); // Remplace player 1 par le nom du joueur
                
                //Mise à jour du nom du joueur dans l'objet
                playerName = newPlayerName;
                player.name = playerName;
                
                $('#createNameContainer'+ playerId).fadeOut("3000"); 

                $('#createName'+ playerId).val(''); // ici on remets l'input à zéro
                //Afficher player ici

                $('td#' + playerIndex + '.cell').css("background", playerBackgroundColor[playerId-1]);

            }

        });

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


    findMyCurrentPlayer(index, tablePlayers) {

        //console.log("tablePlayers", tablePlayers);
        //console.log("index", index);
    
        return tablePlayers[index];
          
    }

    nextPlayer(indexCurrentPlayer) {

        let newIndex = indexCurrentPlayer + 1;
        //console.log("nouvel index", newIndex);
        //console.log("taille tableau", this.players.length);

        if(newIndex < this.players.length) {
            newIndex = newIndex;
            console.log("index plus petit que la taille du tableau");
        } else {
            console.log("index plus grand que la taille du tableau");
            newIndex = 0;
        }

        return newIndex;  
    }

    testInit() {

        this.createTheGameBoard();
        this.generateObstacles();
        this.generateWeapons();
        this.addPlayers();
        this.createPlayerNameForm();
        this.update();
        this.moveIsPossible();
        this.moveInDirection();

        //this.updateWeapons();

        /*let getCurrentIndexPlayer = this.findMyCurrentPlayer(this.indexCurrentPlayer, this.players);
        console.log("player initial:", getCurrentIndexPlayer);
        this.indexCurrentPlayer = this.nextPlayer(this.indexCurrentPlayer);

        //this.indexCurrentPlayer = this.indexCurrentPlayer + 1; //passage au joueur suivant
        console.log("modifications index:", this.indexCurrentPlayer);
        getCurrentIndexPlayer = this.findMyCurrentPlayer(this.indexCurrentPlayer, this.players);
        console.log("player après changement:", getCurrentIndexPlayer);

    
        this.indexCurrentPlayer = this.nextPlayer(this.indexCurrentPlayer);
        getCurrentIndexPlayer = this.findMyCurrentPlayer(this.indexCurrentPlayer, this.players);
        console.log("player après changement:", getCurrentIndexPlayer);*/
    }

    moveIsPossible() { 
                
        //récupération de l'index actuel du joueur 
        let getCurrentIndexPlayer = this.findMyCurrentPlayer(this.indexCurrentPlayer, this.players);  
        getCurrentIndexPlayer = this.findMyCurrentPlayer(this.indexCurrentPlayer, this.players);

        console.log("player initial:", getCurrentIndexPlayer);

        //tableau regroupant les différentes directions possibles des joueurs
        let tableDirection = [1, this.columns, -1, this.columns * -1];

        //tableau des positions des joueurs 
        //let tablePositionPlayer = [];

        /*for (let cellPositionPlayer = 0; cellPositionPlayer < getCurrentIndexPlayer; cellPositionPlayer++) {
            tablePositionPlayer = getCurrentIndexPlayer;
        }*/
       
        for(let i = 0; i < getCurrentIndexPlayer.id; i++) {

            console.log(' in get current Index player loop');

            for(let i = 0; i < tableDirection.length; i++) {

                console.log('in tabledirection loop');

                let classStep = "moveIsPossible"+ getCurrentIndexPlayer.id;

                this.moveInDirection(getCurrentIndexPlayer.position, tableDirection, classStep);

                console.log('table direction player', tableDirection);
                console.log('index player', getCurrentIndexPlayer.position);

                console.log(classStep);

            } 

            this.indexCurrentPlayer = this.nextPlayer(this.indexCurrentPlayer);
            console.log("modifications index:", this.indexCurrentPlayer);

            getCurrentIndexPlayer = this.findMyCurrentPlayer(this.indexCurrentPlayer, this.players);
            console.log("player après changement:", getCurrentIndexPlayer);

        }



    } 


    //moveInDirection est une fonction qui vas nous permettre de pourvoir indiquer ou est ce que notre joueur peut se déplacer sur le plateau de jeu
    moveInDirection(playerIndex, step, colorStep) {

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
        // 1      true  = 10        <= (10   * 3) 
        // 2      true  = 20        <= (10   * 3)
        // 3      true  = 30        <= (10   * 3)
        // 4      false = 40        <= (10   * 3) => arrêt boucle

        // tant que les mouvements sont possibles
        // Si moveInStepIsPossible est false ne rentre pas da
        console.log('moveInStepIsPossible', moveInStepIsPossible);

        while (moveInStepIsPossible) {
            
            let gameBoardLine = playerIndex % this.columns;
            console.log('gameboard_line :', gameBoardLine);
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
            if(this.cellIsMovable(playerIndex + countStep) && mapLimitation){
                console.log('count_step', countStep);
                let resultMove = playerIndex + countStep;
                console.log('result_move', resultMove);
                console.log('player_Id', playerIndex);
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
     

} 


