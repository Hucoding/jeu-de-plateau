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
                });

            let obstacle = new Obstacle(obstacleIndex);

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
            let playerId = i+1;
            let playerName = "Joueur" + "_" + `${playerId}`;
            let weaponId = this.weapons.length;

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

        this.players[0]["weaponOnHands"].forEach(function(basicWeapon){ 
            delete basicWeapon.position; 
        });

        this.players[1]["weaponOnHands"].forEach(function(basicWeapon){ 
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


                       let currentPlayerWeaponName = player.weaponOnHands[0].name;


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
            newIndex = index + 1;
        }
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

                }

                //methode filter pour get les armes
                this.updateWeapon(this.weapons, currentPlayer);

            } while (currentPlayer.position != target);

            this.miseEnSurbrillance(
                this.players[this.nextPlayer(currentPlayer.id)]
            );

        });
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
                //console.log('create properties', currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["position"]);
                
                //larme à deposer par terre correspond à larme courante détenu par le joueur
                //console.log('arme a deposer par terre', currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]);

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
                //currentPlayer.idWeapon = weapon.id;

                currentPlayer.weaponOnHands.splice(currentPlayer.weaponOnHands.length-1);

                currentPlayer.weaponOnHands.push(newWeaponOnHands);

                //ICI ajouter le code du nouveau skin de larme associé au joueur
                //Si idWeapon est similaire à lid de la nouvelle arme alors on affiche le skin de la nouvelle arme
                //if(currentPlayer.idWeapon == currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["id"]) {
                    // ajout du skin de la nouvelle arme au joueur
                    $("td#" + currentPlayer.position + " > img.playerWithStartWeapon").addClass(
                        "playWith" + currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["name"]
                    );
                //}

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

        console.log('entrée tour a tour current player ' + currentPlayer);

        if (action === true) {
            let nextPlayer;
            let setPlayerNoPlaying;

            if (currentPlayer.id == 1) {
                nextPlayer = this.nextPlayer(currentPlayer.id);

                setPlayerNoPlaying = this.setInfo(
                    this.players,
                    "id",
                    currentPlayer.id,
                    nextPlayer = currentPlayer.id+1
                );

                console.log('currentPlayer.id+1', currentPlayer.id+1);

            } else {
                nextPlayer = this.nextPlayer(currentPlayer.id);

                setPlayerNoPlaying = this.setInfo(
                    this.players,
                    "id",
                    currentPlayer.id,
                    nextPlayer = currentPlayer.id-1
                );
                
                console.log('currentPlayer.id-1' + currentPlayer.id-1);

            } 

            if (nextPlayer != currentPlayer.id) {
                this.fightDisplayEvent(currentPlayer,  Number(setPlayerNoPlaying));
            }

        }

    }

    fightDisplayEvent(currentPlayer, notCurrentPlayer) {

        // current player  = joueur qui est en train de jouer
        // notCurrentPlayer = joueur en attente de pouvoir effectuer une action d'attaque ou de défense 

        let next = this.nextPlayer(currentPlayer.id);
        let notCurrentPlayerName = this.players[Number(next)]["name"];
        let notCurrentPlayerLife = this.players[Number(next)]["life"];
        
        // suppression plateau de jeu
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

        if(typeof $('#fightTemplate'+notCurrentPlayer) != 'undefined') {
            $('#fightTemplate'+notCurrentPlayer).remove();
        }
        
        this.attackOrDefendAction(currentPlayer, notCurrentPlayerLife);
    }

    attackOrDefendAction(currentPlayer, notCurrentPlayerLife) {
            
        let next = this.nextPlayer(currentPlayer.id);
        
        let getDamage = currentPlayer.weaponOnHands[0].damage;

        let winner = this.printWinnerPlayer(currentPlayer, this.players[Number(next)].name, notCurrentPlayerLife);

        let FinishGameTemplate = `
        <div class="fight" id="fightTemplate${currentPlayer.id}">
            <h3 class="fightingMessage${currentPlayer.id}" id="fightingMessage${currentPlayer.id}">
                ${currentPlayer.name} lose the game !  <i class="fas fa-times-circle looseIcon"></i>
            </h3>
            <h3 class="fightingMessage${currentPlayer.id}" id="fightingMessage${currentPlayer.id}">
                ${winner} win the game ! <i class="fas fa-trophy winIcon"></i>
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
            
             let newLife = this.setInfo(
                this.players,
                "life",
                this.players[Number(next)]["id"],
                notCurrentPlayerLife - getDamage
            );

            notCurrentPlayerLife = newLife;
            newLife = notCurrentPlayerLife;

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
                if(typeof $(`#fightTemplate${currentPlayer.id}`) != 'undefined' || 
                   typeof $(`#fightTemplate${this.players[Number(next)].id}`) != 'undefined') {
                    $('.fight').remove();
                }
                $(FinishGameTemplate).appendTo(".gameBoardContainer");
            }
            
            console.log('AVANT tour a tour current player ' + currentPlayer);
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
                if(typeof $(`#fightTemplate${currentPlayer.id}`) != 'undefined' || 
                   typeof $(`#fightTemplate${this.players[Number(next)].id}`) != 'undefined') {
                    $('.fight').remove();
                }
                $(FinishGameTemplate).appendTo(".gameBoardContainer");
            }

            this.tourATourFight(currentPlayer, actionDefend);

        });
    }

    printWinnerPlayer(currentPlayer, notCurrentPlayer, notCurrentPlayerLife) {

        //on affiche le nom du gagnant en fonction des points de vie des joueur
        if(currentPlayer.life < notCurrentPlayerLife ) {
            return notCurrentPlayer;
        } else if (notCurrentPlayerLife < currentPlayer.life) {
            return currentPlayer.name;
        }

    } 

    fightAction(target, notCurrentPlayer) {

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

        console.log('players ', this.players);

        this.miseEnSurbrillance(currentPlayer);
        this.incrementationDeplacementJoueur(currentPlayer, target);
    }
}
