class Gameboard {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.numberOfCell = 0;
        this.obstacles = cellsObsctacles;
        this.weapons = cellsWeapons;
        this.players = cellsPlayers;
    }

    createTheGameBoard() {

        let gameboard = document.getElementById("gameBoard");

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

        let maxIndex = rowGameBoard * columnGameBoard - 1;

        let obstacleIndex = -1;

        for(let i = 0; i < numberOfObstacles; i++) {            

            do {

                obstacleIndex = Math.round(Math.random() * maxIndex);

            } while(!this.cellIsFree(obstacleIndex));

            $("td#"+obstacleIndex).addClass("obstacle");
            let obstacle = new Obstacle(obstacleIndex);
            this.obstacles.push(obstacle);
        }

    } 
    
    generateWeapons() {

        let maxIndex = rowGameBoard * columnGameBoard - 1;

        let weaponIndex = -1;

        for (let i = 0; i < numberOfWeapons; i++) {
            
            do {

                weaponIndex = Math.round(Math.random() * maxIndex);

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

        let maxIndex = rowGameBoard * columnGameBoard - 1;

        let playerIndex = -1;

        for (let i = 0; i < numberOfPlayers; i++) {

            do { 

                playerIndex = Math.round(Math.random() * maxIndex);

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

    moveInDirection(playerPosition, step, colorStep) {

        // Itération -10 à -30
        // i = -10         
        // i = -20
        // i = -30     // stop

        // i est égale à une step qui est en réalité une case du tableau
        let i = step;
        let endTest;

        if(step < 0){
            endTest = i >= (step * numberMove);
        } else {
            endTest = i <= (step * numberMove);
        }

        while (endTest) {
            
            let line = playerPosition % this.columns;
            let map_limit;

            if(step == 1) {
                map_limit = (line + i) < this.columns;
            } else if(step == -1) {
                map_limit = (line + i) > -1;
            } else {
                map_limit = true;
            }

            if(this.cellIsMovable(playerPosition + i) && map_limit){
                let resultMove = playerPosition + i;

                //Cette condition permet de mettre en couleur une case commune de déplacements que peuvent avoir les joueurs
                if(colorStep == "moveIsPossiblePlayer2" && $("td#"+resultMove).hasClass("moveIsPossiblePlayer1")) {
                    $("td#"+resultMove).removeClass("moveIsPossiblePlayer1");
                    $("td#"+resultMove).addClass("moveIsPossibleBothPlayer");
                } else {
                    $("td#"+resultMove).addClass(colorStep);
                }

            } else {
                break;
            }

            i = i + step;

            if(step < 0){
                endTest = i >= (step * numberMove);
            } else {
                endTest = i <= (step * numberMove);
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
    
        let positionPlayer1 = cellsPlayers[0].position;
        let positionPlayer2 = cellsPlayers[1].position;

        let opponentPlayer = this.players[this.id == 0 ? 1 : 0].position;
        console.log("opponentPlayer :", opponentPlayer);


        //Mouvements Joueur 1
        //définition des paramètres pour le joueur 1
        this.moveInDirection(positionPlayer1, 1, "moveIsPossiblePlayer1"); //mouvements à droite
        this.moveInDirection(positionPlayer1, this.columns, "moveIsPossiblePlayer1"); //mouvement en bas
        this.moveInDirection(positionPlayer1, -1, "moveIsPossiblePlayer1"); //mouvements à gauche
        this.moveInDirection(positionPlayer1, this.columns * -1, "moveIsPossiblePlayer1"); //mouvements en haut

        //Mouvements Joueur 2
        //définition des paramètres pour le joueur 2
        this.moveInDirection(positionPlayer2, 1, "moveIsPossiblePlayer2"); //mouvements à droite
        this.moveInDirection(positionPlayer2, this.columns, "moveIsPossiblePlayer2"); //mouvements en bas
        this.moveInDirection(positionPlayer2, -1, "moveIsPossiblePlayer2"); //mouvements à gauche
        this.moveInDirection(positionPlayer2, this.columns * -1, "moveIsPossiblePlayer2"); //mouvements en haut


    }

} 


