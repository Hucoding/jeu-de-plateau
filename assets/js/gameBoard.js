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
        this.globalMoves = [];
    }

    createTheGameBoard() {
        let gameboard = document.getElementById(this.idHtmlTable);

        for (let i = 0; i < this.rows; i++) {
            let tr = document.createElement("tr");
            tr.setAttribute("class", "row");
            gameboard.appendChild(tr);

            for (let i = 0; i < this.columns; i++) {
                let td = document.createElement("td");
                td.setAttribute("id", this.numberOfCell);
                td.setAttribute("class", "cell");
                tr.appendChild(td);
                this.numberOfCell++;
                cellsIndex.push(this.numberOfCell - 1);
            }
        }
    }

    generateObstacles() {
        //nombre maximum de cellules
        let maxCells = this.rows * this.columns - 1;

        let obstacleIndex = -1;

        for (let i = 0; i < numberOfObstacles; i++) {
            do {
                //nombre aléatoire * nombre maximum de cellules
                obstacleIndex = Math.round(Math.random() * maxCells);
            } while (!this.cellIsFree(obstacleIndex));


            $("td#" + obstacleIndex)
                .addClass("obstacle")
                .click((e) => {
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
            } while (!this.cellIsFree(weaponIndex));

            let randomWeapon = randomNumberWeapon();
            let weapon = new Weapon(i, weaponIndex, randomWeapon);

            this.weapons.push(weapon);

            $("td#" + weaponIndex).addClass(`${weapon.name}`);
        }
    }

    addPlayers() {

        let maxCells = this.rows * this.columns - 1;

        let playerIndex = -1;

        for (let i = 0; i < numberOfPlayers; i++) {
            do {
                playerIndex = Math.round(Math.random() * maxCells);
            } while (!this.cellIsFree(playerIndex));

            let firstWeapon = "Fork";
            let firstWeaponDamage = 5;
            let playerId = i + 1;
            let playerName = "Joueur" + "_" + `${playerId}`;
            let weaponId = this.weapons.length;

            //let playerWeaponOnHands;
            //let playerWeaponId = 0;

            let player = new Player(
                playerId,
                playerName,
                playerIndex,
                weaponId,
                this.playerWeaponOnHands = new Weapon(
                    weaponId,
                    playerIndex,
                    firstWeaponDamage,
                    firstWeapon
                ),
            );

            this.createPlayerNameForm(player, playerId, playerName);

            this.players.push(player);
           // this.weapons.push(weapon);

            this.players.map((el) => {
                if (playerIndex === el.position + 1) {
                    location.reload();
                } else if (playerIndex === el.position - 1) {
                    location.reload();
                } else if (playerIndex === el.position + 10) {
                    location.reload();
                } else if (playerIndex === el.position - 10) {
                    location.reload();
                }
            });

            console.log('players add', this.players);

            let imgPlayer = $("<img />");
            let imgPlayerUrl = "assets/imgs/players/alien.png";

            imgPlayer.attr("class", "playerWithStartWeapon");
            imgPlayer.attr("src", imgPlayerUrl);
            imgPlayer.appendTo("td#" + playerIndex, 0);

            $("td#" + playerIndex + " > img.playerWithStartWeapon").addClass(
                "playWith" +  firstWeapon
            );

            this.update(player, playerId, playerName);
        }

        console.log('player object index', this.players);

        // choper l'id du joueur de façon dynamique
        this.players[0]["weaponOnHands"].forEach(function(basicWeapon){ 
            // delete basicWeapon.id; 
            delete basicWeapon.position; 
        });

        this.players[1]["weaponOnHands"].forEach(function(basicWeapon){ 
           // delete basicWeapon.id; 
            delete basicWeapon.position; 
        }); 

    }

    //Cette fonction permet la création du formulaire d'entrée du nom du joueur de façon dynamique, on passe en paramètre l'id du joueur ainsi que son Nom par défaut
    createPlayerNameForm(player, playerId, playerName) {
        let playerNameClassId = "playerName" + playerId;

        /* Création du form pour le joueur */
        let containerLeftOrRight = $("<div></div>");
        containerLeftOrRight.attr("class", "playerPanel" + playerId);
        containerLeftOrRight.attr("id", "playerName" + playerId);

        containerLeftOrRight.appendTo(".gameContainer");

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
        if (player === undefined) {
            containerLeftOrRight.remove();
        }
    }

    // Création d'une fonction de mise a jour du nom du joueur et du formulaire
    update(player, playerId, playerName) {
        let self = this;
        //ce premier bloc de code à pour but de mettre à jour et remplacer le nom du joueur par défaut lorsque l'utilisateur rentre un nom personnalisé pour le joueur
        $("#buttonCreateName" + playerId).click(
            function () {
                
                if ($("#createName" + playerId).val().length === 0) {
                    // Si le joueur 1 n'a pas rentrer son pseudo
                    $("#createName" + playerId).css("border", "1px solid red");
                    $("#playerName" + playerId)
                        .text("Entrez votre nom !")
                        .css({
                            //on affiche un message d'erreur
                            color: "red",
                            "font-weight": "bold",
                        });
                    } else {

                        let playerClassAndIdName = "playerName" + playerId;
                        let newPlayerName = $("#createName" + playerId).val();
                        
                        $(".playerName" + playerId).replaceWith(
                            `<h3 class="${playerClassAndIdName}" id="${playerClassAndIdName}">" ${newPlayerName} "</h3>`
                        ); // Remplace player 1 par le nom du joueur
                            
                        //Mise à jour du nom du joueur dans l'objet
                        playerName = newPlayerName;
                        player.name = playerName;


                        let currentPlayerWeaponName = self.getInfo(self.weapons, "name", player.idWeapon);

                    if (player.name === playerName) {
                        let mytemplate = `
                        <div class="playerNameChanged${player.id}" id="playerNameChanged${player.id}">
                            pseudo : ${player.name}
                        </div>
                        <div class="playerWeaponInfo" id="playerWeaponInfo${player.id}">
                            Weapon : ${currentPlayerWeaponName}
                        </div>
                        <div class="playerLifeInfo${player.id}" id="playerPanelLifeInfo${player.id}">
                            Life : ${player.life}
                        </div>
                        <progress class="lifeBarPlayer${player.id}" id="lifeBarPanelPlayer${player.id}" value="${player.life}" max="100">${player.life} %</progress>
                        `;
                        $(mytemplate).appendTo(".playerPanel" + player.id);
                    }

                    $("#createNameContainer" + playerId).fadeOut("3000");

                    $("#createName" + playerId).val(""); // ici on remets l'input à zéro
                    //Afficher player ici
                }
            }
        );
    }

    //le paramètre index :
    cellIsFree(index) {
        let isfree = true;

        isfree =
            this.obstacles.filter((ob) => ob.position === index).length > 0
                ? false
                : isfree;

        isfree =
            this.weapons.filter((wp) => wp.position === index).length > 0
                ? false
                : isfree;

        isfree =
            this.players.filter((pl) => pl.position === index).length > 0
                ? false
                : isfree;

        return isfree;
    }

    //cellIsMovable est une fonction qui permet de déterminer si les positions entre le joueur et les obstacles
    cellIsMovable(index) {
        let isMovable = true;

        isMovable =
            this.obstacles.filter((ob) => ob.position === index).length > 0
                ? false
                : isMovable;

        isMovable =
            this.players.filter((pl) => pl.position === index).length > 0
                ? false
                : isMovable;

        return isMovable;
    }

    findMyCurrentPlayer(index, tablePlayers) {
        return tablePlayers[index];
    }

    nextPlayer(indexCurrentPlayer) {
        let newIndex = 0;
        let allPlayers = this.players;
        let index = indexCurrentPlayer - 1;
        if (typeof allPlayers[index + 1] !== "undefined") {
            //l'index n'existe pas
            newIndex = index + 1;
        }
        //let newPlayer = allPlayers[newIndex];

        return newIndex;
    }

    miseEnSurbrillance(currentPlayer) {
        let rightDirection;
        let leftDirection;
        let topDirection;
        let bottomDirection;

        //ajout des cases de déplacement de droite quand cela est possible
        for (let step = 1; step < numberMove; step++) {
            rightDirection = currentPlayer.position + step;

            let currentRow = Number.parseInt(
                currentPlayer.position / this.rows
            );
            let limitMap = Number.parseInt(rightDirection / this.rows);

            if (currentRow != limitMap) {
                break;
            } else {
                if (this.cellIsMovable(rightDirection)) {
                    this.globalMoves.push(rightDirection);
                    $("td#" + rightDirection).addClass(
                        "moveIsPossible" + currentPlayer.id
                    );
                } else {
                    break;
                }
            }
        }

        //ajout des cases de déplacement de gauche quand cela est possible
        for (let step = 1; step < numberMove; step++) {
            leftDirection = currentPlayer.position - step;

            let currentRow = Number.parseInt(
                currentPlayer.position / this.rows
            );
            let limitMap = Number.parseInt(leftDirection / this.rows);

            if (currentRow != limitMap) {
                break;
            } else {
                if (this.cellIsMovable(leftDirection)) {
                    this.globalMoves.push(leftDirection);
                    $("td#" + leftDirection).addClass(
                        "moveIsPossible" + currentPlayer.id
                    );
                } else {
                    break;
                }
            }
        }

        //ajout des cases de déplacement du haut quand cela est possible
        for (let step = 1; step < numberMove; step++) {
            topDirection = currentPlayer.position - this.columns * step;

            let limitMap = Number.parseInt(topDirection / this.rows);

            if (limitMap < 0) {
                break;
            } else {
                if (this.cellIsMovable(topDirection)) {
                    this.globalMoves.push(topDirection);
                    $("td#" + topDirection).addClass(
                        "moveIsPossible" + currentPlayer.id
                    );
                } else {
                    break;
                }
            }
        }

        //ajout des cases de déplacement du bas quand cela est possible
        for (let step = 1; step < numberMove; step++) {
            bottomDirection = currentPlayer.position + this.columns * step;

            let limitMap = Number.parseInt(bottomDirection / this.rows);

            if (limitMap >= this.rows) {
                break;
            } else {
                if (this.cellIsMovable(bottomDirection)) {
                    this.globalMoves.push(bottomDirection);
                    $("td#" + bottomDirection).addClass(
                        "moveIsPossible" + currentPlayer.id
                    );
                } else {
                    break;
                }
            }
        }

        $(".moveIsPossible" + currentPlayer.id).click((e) => {
            target = Number(e.target.id);

            do {
                $(
                    "td#" + currentPlayer.position + " .playerWithStartWeapon"
                ).remove();
                $(
                    "td#" + currentPlayer.position + " .weaponStartThePlayer"
                ).remove();

                currentPlayer.position =
                    currentPlayer.position +
                    this.incrementationDeplacementJoueur(currentPlayer, target);

                if (currentPlayer.position === target) {
                    let imgPlayer = $("<img />");
                    let imgPlayerUrl = "assets/imgs/players/alien.png";

                    imgPlayer.attr("class", "playerWithStartWeapon");
                    imgPlayer.attr("src", imgPlayerUrl);
                    imgPlayer.appendTo("td#" + currentPlayer.position, 0);

                    $("td#" + currentPlayer.position + "> img.playerWithStartWeapon").addClass("playWith" + currentPlayer.weaponOnHands.name);

                    this.globalMoves.map((index) => {
                        $("td#" + index).removeClass( "moveIsPossible" + currentPlayer.id);
                        $("td#" + index).unbind("click");
                    });

                    //combat
                    this.fightAction(target, currentPlayer.position);

                    //console.log('moves', this.globalMoves);

                }

                //methode filter pour get les armes
                this.updateWeapon(this.weapons, currentPlayer);

            } while (currentPlayer.position != target);

            this.miseEnSurbrillance(
                this.players[this.nextPlayer(currentPlayer.id)]
            );

        });
    }

    getInfo(tableObject, attrObject, idObject) {
        let theElement = tableObject.filter((ob) => ob.id === idObject);

        if (
            tableObject === "undefined" ||
            attrObject === "undefined" ||
            idObject === "undefined"
        ) {
            return null;
        } else {
            return theElement[0][attrObject];
        }
    }

    setInfo(tableObject, attrObject, idObject, newValue) {
        let theElement = tableObject.filter((ob) => ob.id === idObject);

        if (
            tableObject === "undefined" ||
            attrObject === "undefined" ||
            idObject === "undefined" ||
            newValue === "undefined"
        ) {
            return null;
        } else {
            return (theElement[0][attrObject] = newValue);
        }
    }

    toutATour(currentPlayer, target) {
        if (currentPlayer.position === target) {
            let nextPlayer = 0;

            if (currentPlayer.id == 1) {
                nextPlayer = 1;
            } else {
                nextPlayer = 0;
            }

            if (nextPlayer != currentPlayer.id) {
                this.miseEnSurbrillance(this.players[nextPlayer]); 
            }
        }

    }

    incrementationDeplacementJoueur(currentPlayer, target) {
        let incrementation = null;

        if (target < currentPlayer.position) {
            //Vers la gauche, ou le haut
            if (target <= currentPlayer.position - this.rows) {
                incrementation = -this.rows;
            } else {
                incrementation = -1;
            }
        } else {
            //Vers la droite, ou le bas
            if (target >= currentPlayer.position + this.rows) {
                incrementation = +this.rows;
            } else {
                incrementation = +1;
            }
        }

        return incrementation;
    }

    updateWeapon(tableWeapons, currentPlayer) {
        let self = this;

        let oldIdWeapon = currentPlayer.idWeapon;

        tableWeapons.filter(function (weapon) {

            // si la position de larme est égale à la position du joueur et que l'id de lancienne arme est différent de larme trouvée par terre
            if(weapon.position === currentPlayer.position && oldIdWeapon != weapon.id) {

                //enregistrer la position actuelle du joueur, ajouter cette position à larme et pushé la propriété "position" à larme
                currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["position"] = currentPlayer.position;
                console.log('create properties', currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["position"]);
                
                //larme à deposer par terre correspond à larme courante détenu par le joueur
                console.log('arme a deposer par terre', currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]);

                //on place temporairement lancienne arme dans le tableau des armes
                self.weapons.push(currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]);

                //ici ajouter le code pour afficher le skin de larme au sol
                //Si la position est égale à l'index de la case alors on ajoute le skin
                let id = parseInt($("#" + weapon.position).attr("id"));
                if(id == currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["position"]) {

                    // suppression du skin de la nouvelle arme sur la case
                    $("td#" + id).removeClass(
                        weapon.name
                    );
                    
                    // ajout du skin de la nouvelle arme au joueur
                    $("td#" + id).addClass(
                        currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["name"]
                    ); 

                }

                //nouvelle arme à pushé au joueur
                let newWeaponOnHands = weapon;

                //mise à jour de l'id de l'arme qui est égale à idWeapon (idWeapon id de larme associé au joueur)
                currentPlayer.idWeapon = weapon.id;

                currentPlayer.weaponOnHands.splice(currentPlayer.weaponOnHands.length-1);

                currentPlayer.weaponOnHands.push(newWeaponOnHands);

                //ICI ajouter le code du nouveau skin de larme associé au joueur
                //Si idWeapon est similaire à lid de la nouvelle arme alors on affiche le skin de la nouvelle arme
                if(currentPlayer.idWeapon == currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["id"]) {

                    // ajout du skin de la nouvelle arme au joueur
                    $("td#" + currentPlayer.position + " > img.playerWithStartWeapon").addClass(
                        "playWith" + currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["name"]
                    );


                }

                //ici on supprime la position de la nouvelle arme du joueur car nous en avons pas besoin nous avons la position du joueur (larme suis le joueur)
                currentPlayer.weaponOnHands.forEach(function(newWeapon){ 
                    delete newWeapon.position; 
                });

            } 

        });

        $("td#" + currentPlayer.position + " > img.playerWithStartWeapon").removeClass(
            "playWithundefined"
        );

        $("td#" + currentPlayer.position + " > img.playerWithStartWeapon").addClass(
            "playWith" + currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["name"]
        );

    }

    tourATourFight(currentPlayer, action) {
        if (action === true) {
            let nextPlayer;
            let setPlayerNoPlaying;

            if (currentPlayer.id == 1) {
                nextPlayer = this.nextPlayer(currentPlayer.id);
                console.log('nextPlayer', nextPlayer);
                setPlayerNoPlaying = this.setInfo(
                    this.players,
                    "id",
                    currentPlayer.id,
                    nextPlayer = currentPlayer.id+1
                );
                console.log('setPlayerNoPlaying', setPlayerNoPlaying);
            } else {
                nextPlayer = this.nextPlayer(currentPlayer.id);
                console.log('nextPlayer', nextPlayer);
                setPlayerNoPlaying = this.setInfo(
                    this.players,
                    "id",
                    currentPlayer.id,
                    nextPlayer = currentPlayer.id-1
                );
                console.log('setPlayerNoPlaying', setPlayerNoPlaying);
            } 

            if (nextPlayer != currentPlayer.id) {
                this.fightDisplayEvent(currentPlayer,  this.players[setPlayerNoPlaying]);
            }
        }
    }

    fightDisplayEvent(currentPlayer, notCurrentPlayer) {

        console.log("not current player FIGHT DISPLAY", notCurrentPlayer);

        // current player  = joueur qui est en train de jouer
        // notCurrentPlayer = joueur en attente de pouvoir effectuer une action d'attaque ou de défense 

        let notCurrentPlayerName;
        let notCurrentPlayerLife;
        let notCurrentPlayerWeapon;
        let notCurrentPlayerWeaponDamage;

        let next = this.nextPlayer(currentPlayer.id);

        console.log('currentplayer id', currentPlayer.id);

        console.log('next variable', next);
        console.log('next id player', this.players[next]["id"]);
        console.log('next name player', this.players[next]["name"]);

        notCurrentPlayerName = this.getInfo(
            this.players,
            "name",
            this.players[next]["id"]
        );

        console.log('notCurrentPlayerName', notCurrentPlayerName);

        notCurrentPlayerLife = this.getInfo(
            this.players,
            "life",
            this.players[next]["id"]
        );

        console.log('notCurrentPlayerLife', notCurrentPlayerLife);


        notCurrentPlayerWeapon = this.getInfo(
            this.weapons,
            "name",
            this.players[next]["idWeapon"]
        );

        console.log('notCurrentPlayerWeapon', notCurrentPlayerWeapon);


        notCurrentPlayerWeaponDamage = this.getInfo(
            this.weapons,
            "damage",
            this.players[next]["idWeapon"]
        );

        console.log('notCurrentPlayerWeaponDamage', notCurrentPlayerWeaponDamage);

        $("#gameBoard").remove();


        let fightTemplate = `
            <div class="fight" id="fightTemplate${currentPlayer.id}">
                <h3 class="fightingMessage${currentPlayer.id}" id="fightingMessage${currentPlayer.id}">
                    FIGHT !
                </h3>
                <div class="infoWeaponPlayer${currentPlayer.id}" id="infoWeaponPlayer${currentPlayer.id}">
                    Weapon : ${currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["name"]}
                </div>
                <div class="infoWeaponDamagePlayer${currentPlayer.id}" id="infoWeaponDamagePlayer${currentPlayer.id}">
                    Damage : ${currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["damage"]}
                </div>
                <div class="playerLifeInfo${currentPlayer.id}" id="playerLifeInfo${currentPlayer.id}">
                    Life : ${notCurrentPlayerLife}
                </div>
                <progress class="lifeBarPlayer${currentPlayer.id}" id="lifeBarPlayer${currentPlayer.id}" value="${notCurrentPlayerLife}" max="100">
                    ${notCurrentPlayerLife} %
                </progress>
                <p class="attackMessage${currentPlayer.id}">
                   Le joueur ${notCurrentPlayerName} attaque le joueur ${currentPlayer.name} que voulez vous faire ?
                </p>
                <button class="defendBtn${currentPlayer.id}" id="defendBtn${currentPlayer.id}">
                    <i class="fas fa-shield-alt"></i> Defend
                </button>
                <button class="attackBtn${currentPlayer.id}" id="attackBtn${currentPlayer.id}">
                    <i class="fas fa-bomb"></i> Attack
                </button>
            </div>
        `;

        $(fightTemplate).appendTo(".gameBoardContainer");

        $(function () {
            $("#lifeBarPlayer" + currentPlayer.id).progressbar({
                value: notCurrentPlayerLife,
            });
        });
        
        this.attackOrDefendAction(currentPlayer, notCurrentPlayerLife);
    }

    attackOrDefendAction(currentPlayer, notCurrentPlayerLife) {
        //dernière étape :
        // il faut faire le tour à tour pour que chaque joueur effectue une action de défense ou d'attaque
        // voir du coté de next player
            
        let next = this.nextPlayer(currentPlayer.id);

        let weapon = this.getInfo(
            this.players, 
            "weaponOnHands", 
            this.players[next]["id"]
        );
        
        let getDamage = weapon[0]["damage"];

       // console.log('START FUNCTION notCurrentPlayerLife', notCurrentPlayerLife);

        //let winner = this.printWinnerPlayer(currentPlayer, next, notCurrentPlayerLife); ${winner}
       // console.log('winner ', winner);

        let FinishGameTemplate = `
        <div class="fight">
            <h3 class="fightingMessage${currentPlayer.id}" id="fightingMessage${currentPlayer.id}">
                ${currentPlayer.name} lose the game !  <i class="fas fa-times-circle looseIcon"></i>
            </h3>
            <h3 class="fightingMessage${currentPlayer.id}" id="fightingMessage${currentPlayer.id}">
                 win the game !   <i class="fas fa-trophy winIcon"></i>
            </h3>
            <button class="replayGame${currentPlayer.id}" onclick="location.reload()"; id="replayGame${currentPlayer.id}">
                <i class="fas fa-redo"></i> Replay the game
            </button>
            <button class="stopGame${currentPlayer.id}" id="stopGame${currentPlayer.id}">
                <i class="far fa-hand-paper"></i> Stop the game
            </button>
        </div>
        `;
        
        //si le joueur attaque alors inflige les dégat selon l'arme qu'il possède,
        $("#attackBtn" + currentPlayer.id).click((e) => {
            let actionAttack = true;
            
            // console.log('not current player life', notCurrentPlayerLife);

             let newLife = this.setInfo(
                this.players,
                "life",
                this.players[next]["id"],
                notCurrentPlayerLife - getDamage
            );

            console.log('newlife ' +  newlife);

            notCurrentPlayerLife = newLife;
            newLife = notCurrentPlayerLife;
            
           // console.log('tableau joueur', this.players);
            
            //console.log('not_current_player_life', notCurrentPlayerLife);
            //console.log('new_life', newLife);

            $('#playerLifeInfo'+currentPlayer.id).html(
                "Life : "+ newLife
            );
            $('#playerPanelLifeInfo'+currentPlayer.id).html(
                "Life : "+ newLife
            );
            $("#lifeBarPlayer"+currentPlayer.id).val(
                newLife
            );
            $("#lifeBarPanelPlayer"+currentPlayer.id).val(
                newLife
            );

            if(newLife <= 50) {
                $('#lifeBarPlayer'+currentPlayer.id).addClass("redMidLife");
            }

            if(notCurrentPlayerLife <= 0) {
                $(`#fightTemplate${currentPlayer.id}`).remove();
                $(FinishGameTemplate).appendTo(".gameBoardContainer");
            }

            this.tourATourFight(currentPlayer, actionAttack);
        });

        // si le joueur se défend alors inflige 50% des dégats
        $("#defendBtn" + currentPlayer.id).click((e) => {
            let actionDefend = true;           
            
            let newLife = this.setInfo(
                this.players,
                "life",
                this.players[next]["id"],
                notCurrentPlayerLife - getDamage / 2
            );

            notCurrentPlayerLife = newLife;
            newLife = notCurrentPlayerLife;

            $('#playerLifeInfo'+currentPlayer.id).html(
                "Life : "+newLife
            );
            $('#playerPanelLifeInfo'+currentPlayer.id).html(
                "Life : "+newLife
            );
            $("#lifeBarPlayer"+currentPlayer.id).val(
                newLife
            );
            $("#lifeBarPanelPlayer"+currentPlayer.id).val(
                newLife
            );
        
            if(newLife <= 50) {
                $('#lifeBarPlayer'+currentPlayer.id).addClass("redMidLife");
            }

            if(notCurrentPlayerLife <= 0) {
                $(`#fightTemplate${currentPlayer.id}`).remove();
                $(FinishGameTemplate).appendTo(".gameBoardContainer");
            }

            this.tourATourFight(currentPlayer, actionDefend);
        });

    }

    /* printWinnerPlayer(currentPlayer, notCurrentPlayer, notCurrentPlayerLife) {

        console.log('currentPlayer', currentPlayer);
        console.log('notCurrentPlayer', notCurrentPlayer);
        //console.log('notCurrentPlayerLife', notCurrentPlayerLife);

        if(notCurrentPlayerLife > currentPlayer.life) {
            console.log('notCurrentPlayer', notCurrentPlayer);
            return notCurrentPlayer;
        } else if (notCurrentPlayerLife < currentPlayer.life) {
            console.log('currentPlayer.name', currentPlayer.name);
            return currentPlayer.name;
        }
    } */

    fightAction(target, notCurrentPlayer) {
        //get position all player and make position condition
        this.players.map((el) => {
            if (target === el.position+1) {
                for( let step = 1; step < 2; step++) {
                    let rightDirection;

                    rightDirection = el.position + step;

                    let currentRow = Number.parseInt(el.position / this.rows);
                    let limitMap = Number.parseInt(rightDirection / this.rows);

                    if (currentRow != limitMap) {
                        break;
                    } else {
                        this.fightDisplayEvent(el, notCurrentPlayer);
                    }
                }

            } else if (target === el.position-1) {
                for( let step = 1; step < 2; step++) {
                    let leftDirection;

                    leftDirection  = el.position - step;

                    let currentRow = Number.parseInt(el.position / this.rows);
                    let limitMap = Number.parseInt(leftDirection / this.rows);

                    if (currentRow != limitMap) {
                        break;
                    } else {
                        this.fightDisplayEvent(el, notCurrentPlayer);
                    }
                } 

            } else if (target === el.position+10) {
                this.fightDisplayEvent(el, notCurrentPlayer);
            } else if (target === el.position-10) {
                this.fightDisplayEvent(el, notCurrentPlayer);
            } 
        });

        console.log(' END table players', this.players);
    }

    testInit() {
        this.createTheGameBoard();
        this.generateObstacles();
        this.generateWeapons();
        this.addPlayers();
        this.createPlayerNameForm();
        this.update();

        let currentPlayer = this.findMyCurrentPlayer(
            this.indexCurrentPlayer,
            this.players
        );

        console.log('table players', this.players);
        console.log('table weapons', this.weapons);

        this.miseEnSurbrillance(currentPlayer);
        this.incrementationDeplacementJoueur(currentPlayer, target);
    }
}
