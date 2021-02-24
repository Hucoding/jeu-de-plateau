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
            }
        }
    }

    generateObstacles() {
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

    createPlayerNameForm(player, playerId, playerName) {
        let playerNameClassId = "playerName" + playerId;

        let containerLeftOrRight = $("<div></div>");
        containerLeftOrRight.attr("class", "playerPanel" + playerId);
        containerLeftOrRight.attr("id", "playerName" + playerId);

        containerLeftOrRight.appendTo(".gameContainer");

        let playerContainerStats = $("<h3></h3>");
        playerContainerStats.attr("class", playerNameClassId);
        playerContainerStats.attr("id", playerNameClassId);

        playerContainerStats.appendTo(containerLeftOrRight);

        let imgPlayerInContainerStats = $("<img />");
        let imgPlayerUrlInContainerStats = "./assets/imgs/players/alien.png";
        imgPlayerInContainerStats.attr("class", "playerImg" + playerId);
        imgPlayerInContainerStats.attr("src", imgPlayerUrlInContainerStats);
        imgPlayerInContainerStats.attr("alt", "personnage " + playerName);

        playerContainerStats.append(playerName);
        imgPlayerInContainerStats.appendTo(containerLeftOrRight);

        let createNameContainer = $("<div></div>");
        createNameContainer.attr("class", "createNameContainer");
        createNameContainer.attr("id", "createNameContainer" + playerId);

        let inputChangePseudo = $("<input />");
        inputChangePseudo.attr("type", "text");
        inputChangePseudo.attr("class", "createName" + playerId);
        inputChangePseudo.attr("id", "createName" + playerId);
        inputChangePseudo.attr("name", "createName" + playerId);
        inputChangePseudo.attr("placeholder", "Créer votre pseudo...");

        let buttonValidateChange = $("<button></button>");
        buttonValidateChange.attr("class", "buttonCreateName");
        buttonValidateChange.attr("id", "buttonCreateName" + playerId);
        buttonValidateChange.append("OK");

        createNameContainer.appendTo(containerLeftOrRight);
        inputChangePseudo.appendTo(createNameContainer);
        buttonValidateChange.appendTo(createNameContainer);
        
        
        if (player === undefined) {
            containerLeftOrRight.remove();
        }
    }

    update(player, playerId, playerName) {

        $("#buttonCreateName" + playerId).click(
            function () {
                
                if ($("#createName" + playerId).val().length === 0) {

                    $("#createName" + playerId).css("border", "1px solid red");
                    
                    $("#playerName" + playerId)
                    .text("Entrez votre nom !")
                    .css({
                        color: "red",
                        "font-weight": "bold",
                    });

                } else {

                    let playerClassAndIdName = "playerName" + playerId;
                    let newPlayerName = $("#createName" + playerId).val();
                    
                    $(".playerName" + playerId).replaceWith(
                        `<h3 class="${playerClassAndIdName}" id="${playerClassAndIdName}">" ${newPlayerName} "</h3>`
                    );
                        
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

                    $("#createName" + playerId).val(""); 

                }
            }
        );
    }

    cellIsFree(index) {

        let isfree = true;

        isfree = this.obstacles.filter((ob) => ob.position === index).length > 0 ? false : isfree;
        isfree = this.weapons.filter((wp) => wp.position === index).length > 0 ? false : isfree;
        isfree = this.players.filter((pl) => pl.position === index).length > 0 ? false : isfree;

        return isfree;

    }

    cellIsMovable(index) {
        let isMovable = true;

        isMovable = this.obstacles.filter((ob) => ob.position === index).length > 0 ? false : isMovable;
        isMovable = this.players.filter((pl) => pl.position === index).length > 0 ? false : isMovable;

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

        //ajout des cases de déplacement de droite 
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

        //ajout des cases de déplacement de gauche 
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

        //ajout des cases de déplacement du haut 
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

        //ajout des cases de déplacement du bas
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

                $("td#" + currentPlayer.position + " .playerWithStartWeapon").remove();
                $("td#" + currentPlayer.position + " .weaponStartThePlayer").remove();

                currentPlayer.position = currentPlayer.position + this.incrementationDeplacementJoueur(currentPlayer, target);

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

                    this.fightAction(target, currentPlayer);

                }

                this.updateWeapon(this.weapons, currentPlayer);

            } while (currentPlayer.position != target);

            this.miseEnSurbrillance(
                this.players[this.nextPlayer(currentPlayer.id)]
            );

        });
    }

    setInfo(tableObject, attrObject, idObject, newValue) {

        let theElement = tableObject.filter((ob) => ob.id === idObject);

        if (tableObject === "undefined" || attrObject === "undefined" || idObject === "undefined" || newValue === "undefined") {
            return null;
        } else {
            return (theElement[0][attrObject] = newValue);
        }

    }

    toutATour(currentPlayer, target) {
        if (currentPlayer.position === target) {

            let nextPlayer = 0;

            currentPlayer.id == 1 ? nextPlayer = 1 : nextPlayer = 0;

            if (nextPlayer != currentPlayer.id) {
                this.miseEnSurbrillance(this.players[nextPlayer]); 
            }

        }
    }

    incrementationDeplacementJoueur(currentPlayer, target) {
        let incrementation = null;

        if (target < currentPlayer.position) {
            //Vers la gauche, ou le haut
            target <= currentPlayer.position - this.rows ? incrementation = -this.rows : incrementation = -1;
        } else {
            //Vers la droite, ou le bas
            target >= currentPlayer.position + this.rows ? incrementation = +this.rows : incrementation = +1;
        }
        return incrementation;
    }

    updateWeapon(tableWeapons, currentPlayer) {
        let self = this;

        let oldIdWeapon = currentPlayer.idWeapon;

        tableWeapons.filter(function (weapon) {

            if(weapon.position === currentPlayer.position && oldIdWeapon != weapon.id) {

                currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["position"] = currentPlayer.position;

                self.weapons.push(currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]);

                let id = parseInt($("#" + weapon.position).attr("id"));
                if(id == currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["position"]) {
                    $("td#" + id).removeClass(weapon.name);
                    $("td#" + id).addClass(currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["name"]); 
                }

                let newWeaponOnHands = weapon;

                currentPlayer.weaponOnHands.splice(currentPlayer.weaponOnHands.length-1);
                currentPlayer.weaponOnHands.push(newWeaponOnHands);

                $("td#" + currentPlayer.position + " > img.playerWithStartWeapon").addClass("playWith" + currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["name"]);

                currentPlayer.weaponOnHands.forEach(function(newWeapon){ 
                    delete newWeapon.position; 
                });

            } 

        });

        $("td#" + currentPlayer.position + " > img.playerWithStartWeapon").removeClass("playWithundefined");
        $("td#" + currentPlayer.position + " > img.playerWithStartWeapon").addClass("playWith" + currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["name"]);

    }

    tourATourFight(currentPlayer, action, notCurrentPlayer) {

        if(action === true) {
            let temp = currentPlayer;
            currentPlayer = notCurrentPlayer;
            notCurrentPlayer = temp;
        } 

        this.fightDisplayEvent(currentPlayer, notCurrentPlayer);
    
    }

    fightDisplayEvent(currentPlayer, notCurrentPlayer) {

        let notCurrentPlayerName = notCurrentPlayer.name;
        let notCurrentPlayerLife = notCurrentPlayer.life;

        let winner = this.printWinnerPlayer(currentPlayer, notCurrentPlayer);

        
        $("#gameBoard").remove();
        $("#createNameContainer" + currentPlayer.id).remove();
        $("#createNameContainer" + notCurrentPlayer.id).remove();

        let fightTemplate = `
            <div class="fight" id="fightTemplate${currentPlayer.id}">
                <h3 class="fightingMessage${currentPlayer.id}" id="fightingMessage${currentPlayer.id}">
                    FIGHT !
                </h3>
                <h4 class="infoCurrentPlayerName${currentPlayer.id}">à votre tour : ${currentPlayer.name}</h4>
                <div class="infoWeaponPlayer${currentPlayer.id}" id="infoWeaponPlayer${currentPlayer.id}">
                    Weapon : ${currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["name"]}
                </div>
                <div class="infoWeaponDamagePlayer${currentPlayer.id}" id="infoWeaponDamagePlayer${currentPlayer.id}">
                    Damage : ${currentPlayer.weaponOnHands[currentPlayer.weaponOnHands.length-1]["damage"]}
                </div>
                <div class="playerLifeInfo${currentPlayer.id}" id="playerLifeInfo${currentPlayer.id}">
                    Life of player ${notCurrentPlayer.name} : ${notCurrentPlayer.life}
                </div>
                <progress class="lifeBarPlayer${currentPlayer.id}" id="lifeBarPlayer${currentPlayer.id}" value="${notCurrentPlayer.life}" max="100">
                    ${notCurrentPlayer.life} %
                </progress>
                <p class="attackMessage${currentPlayer.id}">
                    ${notCurrentPlayerName} attaque que voulez vous faire ?
                </p>
                <button class="defendBtn${currentPlayer.id}" id="defendBtn${currentPlayer.id}">
                    <i class="fas fa-shield-alt"></i> Defend
                </button>
                <button class="attackBtn${currentPlayer.id}" id="attackBtn${currentPlayer.id}">
                    <i class="fas fa-bomb"></i> Attack
                </button>
            </div>
        `;


        let FinishGameTemplate = `
        <div class="fight" id="fightTemplate${currentPlayer.id}">
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
    
        $(fightTemplate).appendTo(".gameBoardContainer");


        $(function () {
            $("#lifeBarPlayer" + currentPlayer.id).progressbar({ value: notCurrentPlayerLife });

            if(notCurrentPlayer.life <= 50) {
                if(typeof $("#lifeBarPanelPlayer" + currentPlayer.id) != 'undefined') {
                    $('#lifeBarPanelPlayer'+currentPlayer.id).addClass("redMidLife");
                }
                $('#lifeBarPlayer'+currentPlayer.id).addClass("redMidLife");
            }

            if(notCurrentPlayer.life <= 0) {
                if(typeof $("#fightTemplate" + currentPlayer.id) != 'undefined' || 
                typeof $("#fightTemplate" + notCurrentPlayer.id) != 'undefined') {
                    $('.fight').remove();
                }
                $(FinishGameTemplate).appendTo(".gameBoardContainer");
            }

        });

        if(typeof $('#fightTemplate'+notCurrentPlayer.id) != 'undefined') {
            $('#fightTemplate'+notCurrentPlayer.id).remove();
        }

        this.attackOrDefendAction(currentPlayer, notCurrentPlayer);

    }

    attackOrDefendAction(currentPlayer, notCurrentPlayer) {
                    
        let getDamage = currentPlayer.weaponOnHands[0].damage;

        //Bouton d'attaque
        $("#attackBtn" + currentPlayer.id).click((e) => {
            let actionAttack = true;
            
            let newLife = this.setInfo(
                this.players,
                "life",
                notCurrentPlayer.id,
                notCurrentPlayer.life - getDamage
            );

            notCurrentPlayer.life = newLife;    
            newLife = notCurrentPlayer.life;

            $('#playerLifeInfo' + notCurrentPlayer.id).html("Life : " + newLife);
            $('#playerPanelLifeInfo' + notCurrentPlayer.id).html("Life : " + newLife);
            $("#lifeBarPlayer" + notCurrentPlayer.id).val(newLife);
            $("#lifeBarPanelPlayer" + notCurrentPlayer.id).val(newLife);

            this.tourATourFight(currentPlayer, actionAttack, notCurrentPlayer);
            
        });

        //Bouton se défendre
        $("#defendBtn" + currentPlayer.id).click((e) => {
            let actionDefend = true;           
            
            let newLife = this.setInfo(
                this.players,
                "life",
                notCurrentPlayer.id,
                notCurrentPlayer.life - getDamage / 2
            );

            notCurrentPlayer.life = newLife;
            newLife = notCurrentPlayer.life;

            $('#playerLifeInfo' + notCurrentPlayer.id).html("Life : " + newLife);
            $('#playerPanelLifeInfo' + notCurrentPlayer.id).html("Life : " + newLife);
            $("#lifeBarPlayer" + currentPlayer.id).val(newLife);
            $("#lifeBarPanelPlayer" + notCurrentPlayer.id).val(newLife);

            this.tourATourFight(currentPlayer, actionDefend, notCurrentPlayer);

        });

    }

    printWinnerPlayer(currentPlayer, notCurrentPlayer) {
       
        //on compare la vie des joueur pour définir le gagnant de la partie
        if(currentPlayer.life > notCurrentPlayer.life) {
            return currentPlayer.name;
        } else {
            return notCurrentPlayer.name;
        }

    } 

    fightAction(target, notCurrentPlayer) {

        this.players.map((el) => {
            if (target === el.position+1) {

                for( let step = 1; step < 2; step++) {
                    let rightDirection = el.position + step;

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

                    let leftDirection  = el.position - step;

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

        this.miseEnSurbrillance(currentPlayer);
        this.incrementationDeplacementJoueur(currentPlayer, target);
    }
}
