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
        //console.log("index current value in gameBoard Controller:", this.indexCurrentPlayer);
        let self = this;
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

            $("td#"+weaponIndex).addClass(`${weapon.name}`);
           
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
            let firstWeaponDamage = 5;
            let playerId = i+1;
            let playerName = "Joueur" + "_" + `${playerId}`;
            let weaponId = this.weapons.length - 1;
            let weapon = new Weapon(weaponId, playerIndex, firstWeaponDamage, firstWeapon);
            console.log(weapon);
            let playerWeaponId = weapon.id;

            let player = new Player(playerId, playerName, playerIndex, playerWeaponId);

            this.createPlayerNameForm(player, playerId, playerName);
            
            this.players.push(player);
            this.weapons.push(weapon);

            this.players.map((el) => {
                if (playerIndex === el.position+1) {
                    location.reload();
                } else if (playerIndex === el.position-1) {
                    location.reload();
                } else if (playerIndex === el.position+10) {
                    location.reload();
                } else if (playerIndex === el.position-10) {
                    location.reload();
                } 
            });

            let imgPlayer = $("<img />");
            let imgPlayerUrl = "assets/imgs/players/alien.png";

            imgPlayer.attr("class", "playerWithStartWeapon");
            imgPlayer.attr("src", imgPlayerUrl);  
            imgPlayer.appendTo("td#"+playerIndex, 0);

            $("td#" + playerIndex + " > img.playerWithStartWeapon").addClass("playWith"+firstWeapon);
            console.log('player IN ADD PLAYER', player);
            console.log('weapon id', weaponId);
            this.update(player, playerId, playerName);
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


    // Création d'une fonction de mise a jour du nom du joueur et du formulaire
    update(player, playerId, playerName) {

       //let getInfoCurrentPlayerWeapon = this.getInfo(this.weapons, "name", player.idWeapon);

        //ce premier bloc de code à pour but de mettre à jour et remplacer le nom du joueur par défaut lorsque l'utilisateur rentre un nom personnalisé pour le joueur
        $('#buttonCreateName' + playerId).on("click", function (getInfoCurrentPlayerWeapon) {

        console.log('weapons IN FUNCTION', self.weapons);

        //let getNewWeaponName = this.getInfo(this.weapons, "name", player.idWeapon);
        //let setPlayerWeaponName = this.setInfo(this.weapons, "name", player.idWeapon, getNewWeaponName);

            if ($('#createName'+ playerId).val().length === 0) { // Si le joueur 1 n'a pas rentrer son pseudo
                $('#createName'+ playerId).css('border', '1px solid red');
                $('#playerName'+ playerId).text('Entrez votre nom !').css({  //on affiche un message d'erreur
                    'color': 'red',
                    'font-weight': 'bold'
                });
            } else {

                let playerClassAndIdName = 'playerName'+ playerId;
                let newPlayerName = $('#createName'+ playerId).val();
                
                $('.playerName'+ playerId).replaceWith(`<h3 class="${playerClassAndIdName}" id="${playerClassAndIdName}">" ${newPlayerName} "</h3>`); // Remplace player 1 par le nom du joueur

                //Mise à jour du nom du joueur dans l'objet
                playerName = newPlayerName;
                player.name = playerName;

                if(player.name === playerName) {

                    let mytemplate = `
                        <div class="playerNameChanged${player.id}" id="playerNameChanged${player.id}">
                            pseudo : ${player.name}
                        </div>
                        <div class="playerLifeInfo${player.id}" id="playerLifeInfo${player.id}">
                            Life : ${player.life}
                        </div>
                        <div class="playerWeaponInfo" id="playerWeaponInfo${player.id}">
                            Weapon : ${player.idWeapon}
                        </div>`;
                
                    $(mytemplate).appendTo(".playerPanel"+player.id);
                                
                }
                
                $('#createNameContainer'+ playerId).fadeOut("3000"); 

                $('#createName'+ playerId).val(''); // ici on remets l'input à zéro
                //Afficher player ici

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
    
        return tablePlayers[index];
          
    }

    nextPlayer(indexCurrentPlayer) {

        //console.log('INDEX CURRENT PLAYER', indexCurrentPlayer);   //index current player correspond à l'id du joueur
        let newIndex = 0;
        let allPlayers = this.players;
        let index = indexCurrentPlayer-1;
        if(typeof allPlayers[index+1] !== 'undefined'){ //l'index n'existe pas
            newIndex = index + 1;
        }
        let newPlayer = allPlayers[newIndex];
       // console.log('NEW ID', newPlayer.id);

        return newIndex;

    }

    miseEnSurbrillance(currentPlayer) {

        let rightDirection;
        let leftDirection;
        let topDirection;
        let bottomDirection;

       // console.log('name + pos', currentPlayer.name , currentPlayer.position);

        //ajout des cases de déplacement de droite quand cela est possible
        for( let step = 1; step < numberMove; step++) {

            rightDirection = currentPlayer.position + step;

            let currentRow = Number.parseInt(currentPlayer.position / this.rows);
            let limitMap = Number.parseInt(rightDirection / this.rows);

            if (currentRow != limitMap) {
                break;
            } else {

                if (this.cellIsMovable(rightDirection)) {
                    this.globalMoves.push(rightDirection)
                    $("td#"+rightDirection).addClass("moveIsPossible"+currentPlayer.id);
                } else {
                    break;
                }

            }

        }
        
        //ajout des cases de déplacement de gauche quand cela est possible
        for( let step = 1; step < numberMove; step++) {

            leftDirection  = currentPlayer.position - step;
            
            let currentRow = Number.parseInt(currentPlayer.position / this.rows);
            let limitMap = Number.parseInt(leftDirection / this.rows);

            if (currentRow != limitMap) {
                break;
            } else {

                if (this.cellIsMovable(leftDirection)) {
                    this.globalMoves.push(leftDirection)
                    $("td#"+leftDirection).addClass("moveIsPossible"+currentPlayer.id);
                } else {
                    break;
                }

            }     

        }

        //ajout des cases de déplacement du haut quand cela est possible
        for( let step = 1; step < numberMove; step++) {

            topDirection  = currentPlayer.position - (this.columns * step);

            let limitMap = Number.parseInt(topDirection / this.rows);

            if (limitMap < 0) {
                break;
            } else {

                if (this.cellIsMovable(topDirection)) {
                    this.globalMoves.push(topDirection)
                    $("td#"+topDirection).addClass("moveIsPossible"+currentPlayer.id);
                } else {
                    break;
                }

            }

        }

        //ajout des cases de déplacement du bas quand cela est possible
        for( let step = 1; step < numberMove; step++) {

            bottomDirection  = currentPlayer.position + (this.columns * step);

            let limitMap = Number.parseInt(bottomDirection / this.rows);

            if (limitMap >= this.rows) {
                break;
            } else {

                if (this.cellIsMovable(bottomDirection)) {
                    this.globalMoves.push(bottomDirection)
                    $("td#"+bottomDirection).addClass("moveIsPossible"+currentPlayer.id);
                } else {
                    break;
                }

            }

        }

        $('.moveIsPossible'+currentPlayer.id)
        .click( (e) => {

           // let dropWeapon = false;

            target = Number(e.target.id);            


            do {

                $("td#"+ currentPlayer.position + " .playerWithStartWeapon").remove();
                $("td#"+ currentPlayer.position + " .weaponStartThePlayer").remove();

                currentPlayer.position = currentPlayer.position + this.incrementationDeplacementJoueur(currentPlayer, target);

                //console.log(currentPlayer.position);

                if(currentPlayer.position === target) {

                    let currentWeapon = this.getInfo(this.weapons, "name", currentPlayer.idWeapon);
    
                    let imgPlayer = $("<img />");
                    let imgPlayerUrl = "assets/imgs/players/alien.png";
        
                    imgPlayer.attr("class", "playerWithStartWeapon");
                    imgPlayer.attr("src", imgPlayerUrl);  
                    imgPlayer.appendTo("td#"+currentPlayer.position, 0);  

                    $("td#"+currentPlayer.position + "> img.playerWithStartWeapon").addClass("playWith" + currentWeapon);

                    this.globalMoves.map((index) => {
                      $('td#'+index).removeClass('moveIsPossible'+currentPlayer.id);
                      $('td#'+index).unbind('click');
                    });

                    //combat
                    this.fightAction(target, currentPlayer.position);

                    //console.log('TABLEAU ARME', cellsWeapons);
                    //console.log('TABLEAU PLAYER', cellsPlayers);
                    
                }   

                //methode filter pour get les armes
                this.updateWeapon(this.weapons, currentPlayer);

                console.log('current position', currentPlayer.position);
                //console.log('target', target);



            } while(currentPlayer.position != target); 


            //Activation des cellules de déplacements pour le joueur adverse
            //let tour =  this.toutATour(currentPlayer, target);

            //this.fight(currentPlayer, this.players);

            this.miseEnSurbrillance(this.players[this.nextPlayer(currentPlayer.id)]);

            //console.log('tour a tour', tour);

            //console.log('player position:', currentPlayer.position);
            //console.log('table_weapons', cellsWeapons);
            
        });  

    }

    getInfo(tableObject, attrObject, idObject) {

        let theElement = tableObject.filter(ob => ob.id === idObject);

        if(tableObject === 'undefined' || attrObject === 'undefined' || idObject === 'undefined') {
            return null;
        } else {
            return theElement[0][attrObject];
        }

    }

    
    setInfo(tableObject, attrObject, idObject, newValue) {

        let theElement = tableObject.filter(ob => ob.id === idObject);

        if(tableObject === 'undefined' || attrObject === 'undefined' || idObject === 'undefined' || newValue === 'undefined') {
            return null;
        } else {
            return theElement[0][attrObject] = newValue;
        }

    }
    

    toutATour(currentPlayer, target) {

        if(currentPlayer.position === target) {

            let nextPlayer = 0;

           if(currentPlayer.id == 1) {
                nextPlayer = 1;
           } else {
               nextPlayer = 0;
           }

            if(nextPlayer != currentPlayer.id) {
                this.miseEnSurbrillance(this.players[nextPlayer]);
            }

        } 

    }

    incrementationDeplacementJoueur(currentPlayer, target) {

        let incrementation = null;

        if (target < currentPlayer.position) {

            //Vers la gauche, ou le haut
            if (target <= (currentPlayer.position - this.rows)) {

                incrementation = -this.rows;

                //console.log('haut');

                
            } else {

                incrementation = -1;

                //console.log('vers la gauche');

            }

        } else {

            //Vers la droite, ou le bas 
            if (target >= (currentPlayer.position + this.rows)) {

                incrementation = +this.rows;

                //console.log('bas');

            } else {

                incrementation = +1;

                //console.log('vers la droite');
            } 

        } 

        return incrementation;

    }


    updateWeapon(tableWeapons, currentPlayer){
       // console.log('passage update weapon');

        let newPlayerWeaponId = -1;
        let getNewWeaponName;
        let setNewPlayerWeaponName;
        let setNewPlayerWeaponPosition;

        let oldWeaponName = this.getInfo(this.weapons, "name", currentPlayer.idWeapon);
        console.log('oldWeaponName', oldWeaponName);
        let oldWeaponPosition = this.getInfo(this.weapons, "position", currentPlayer.idWeapon);

        let setOldPlayerWeaponPosition = this.setInfo(this.weapons, "position", currentPlayer.idWeapon, oldWeaponPosition);

        //console.log('acienne pos', oldWeaponPosition);

        //déposé l'ancienne arme, prendre la nouvelle arme et mettre à jour le skin de la nouvelle arme
        tableWeapons.filter(function(weapon) {

            if(weapon.position === currentPlayer.position) {

              $("td#"+currentPlayer.position).addClass(oldWeaponName);
              $("td#"+currentPlayer.position + " > img.playerWithStartWeapon").removeClass("playWith" + oldWeaponName);
              
              newPlayerWeaponId = weapon.id;
              currentPlayer.idWeapon = newPlayerWeaponId;

              oldWeaponPosition = setOldPlayerWeaponPosition;
              setOldPlayerWeaponPosition = oldWeaponPosition;

              //console.log('position ancienne arme', oldWeaponPosition);

            } else {
                currentPlayer.idWeapon;
            }

        });

        //nom de la nouvelle arme
        getNewWeaponName = this.getInfo(this.weapons, "name", currentPlayer.idWeapon);

        //set le nom de l'arme
        setNewPlayerWeaponName = this.setInfo(this.weapons, "name", currentPlayer.idWeapon, getNewWeaponName);
        //console.log("setNewPlayerWeaponName", setNewPlayerWeaponName);

        //nouvelle position de l'arme
        setNewPlayerWeaponPosition = this.setInfo(this.weapons, "position", currentPlayer.idWeapon, currentPlayer.position);
       // console.log('nouvelle position de l arme', setNewPlayerWeaponPosition);

        //si la position de la nouvelle arme est égale avec la position du joueur 
        if(setNewPlayerWeaponPosition === currentPlayer.position) {
            $("td#"+currentPlayer.position).removeClass(setNewPlayerWeaponName);
            $("td#"+currentPlayer.position + " > img.playerWithStartWeapon").addClass("playWith" + setNewPlayerWeaponName, true);
        }

       // console.log('nouvelle arme ramassée', getNewWeaponName);

        //problème quand on reviens sur la case initial du joueur à régler
        
    }

    fightDisplayEvent(currentPlayer) {
        //ici créer template factorisable pour l'action de combat
        //fonctionne dans les 2 cas si le joueur à créer ou non un nouveau pseudo

        let getInfoCurrentPlayerWeapon = this.getInfo(this.weapons, "name", currentPlayer.idWeapon);
        let getInfoCurrentPlayerWeaponDamage = this.getInfo(this.weapons, "damage", currentPlayer.idWeapon);

        $('#gameBoard').remove();

        let fightTemplate = `
            <div class="fight">

                <h3 class="fightingMessage${currentPlayer.id}" id="fightingMessage${currentPlayer.id}">FIGHT !</h3>
                <div class="infoWeaponPlayer${currentPlayer.id}" id="infoWeaponPlayer${currentPlayer.id}">Weapon : ${getInfoCurrentPlayerWeapon}</div>
                <div class="infoWeaponDamagePlayer${currentPlayer.id}" id="infoWeaponDamagePlayer${currentPlayer.id}">Damage : ${getInfoCurrentPlayerWeaponDamage}</div>
                <div class="playerLifeInfo${currentPlayer.id}" id="playerLifeInfo${currentPlayer.id}">Life : ${currentPlayer.life}</div>
                <div class="lifeBarPlayer${currentPlayer.id} ui-progressbar ui-corner-all ui-widget ui-widget-content" id="lifeBarPlayer${currentPlayer.id}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${currentPlayer.life}">
                    <div class="ui-progressbar-value ui-corner-left ui-widget-header ui-progressbar-complete ui-corner-right" style="width: 100%;"></div>
                </div>

                <p class="attackMessage${currentPlayer.id}">${currentPlayer.name} attacks you what do you want to do?</p>
                <button class="defendBtn${currentPlayer.id}" id="defendBtn${currentPlayer.id}"><i class="fas fa-shield-alt"></i> Defend</button>
                <button class="attackBtn${currentPlayer.id}" id="attackBtn${currentPlayer.id}"><i class="fas fa-bomb"></i> Attack</button></div>

            </div>
        `;

        $(fightTemplate).appendTo(".gameBoardContainer");

        $( function() {
            $('#lifeBarPlayer'+currentPlayer.id).progressbar({
                value: currentPlayer.life
            });
        });

        this.attackOrDefendAction(currentPlayer);
    }


    attackOrDefendAction(currentPlayer) {

        //dernière étape :
        // il faut faire le tour à tour pour que chaque joueur effectue une action de défense ou d'attaque
        // voir du coté de next player

        let weapon = this.getInfo(this.players, "idWeapon", currentPlayer.id);
        console.log('weapon', weapon);
        let getDamage = this.getInfo(this.weapons, "damage", weapon);
        console.log('damage', getDamage);

        //si le joueur attaque alors inflige les dégat selon l'arme qu'il possède,
        $("#attackBtn"+currentPlayer.id)
        .click( (e) => {

            let newLife =  currentPlayer.life - getDamage;
            currentPlayer.life = newLife;
            newLife = currentPlayer.life;

            if(currentPlayer.life <= 0) {
                alert('perdu');
            }

            //return newLife;
            console.log('life after damage', newLife);
            console.log('tableau de joueur', this.players);
        }); 

        // si le joeuur se défend alors inflige 50% des dégats 
        $("#defendBtn"+currentPlayer.id)
        .click( (e) => {

            let newLife = currentPlayer.life - getDamage/2;
            currentPlayer.life = newLife;
            newLife = currentPlayer.life;

            if(currentPlayer.life <= 0) {
                alert('perdu');
            }

            //return newLife;
            console.log('life after damage', newLife);
            console.log('tableau de joueur', this.players);

        }); 


    }


    fightAction(target) {
        
        //get position all player and make position condition
        this.players.map((el) => {
            if (target === el.position+1) {
                this.fightDisplayEvent(el);
            } else if (target === el.position-1) {
                this.fightDisplayEvent(el);
            } else if (target === el.position+10) {
                this.fightDisplayEvent(el);
            } else if (target === el.position-10) {
                this.fightDisplayEvent(el);
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
        // this.moveIsPossible();
        let currentPlayer = this.findMyCurrentPlayer(this.indexCurrentPlayer, this.players);
        this.miseEnSurbrillance(currentPlayer);
        this.incrementationDeplacementJoueur(currentPlayer, target);
        //console.log('current player', currentPlayer);

    }
     

} 


