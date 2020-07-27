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

        console.log(this.weapons);
        console.log(this.obstacles);
        console.log(this.players);

        let isfree = true;

        isfree = this.obstacles.filter(ob => ob.position === index).length > 0 ? false : isfree;

        isfree = this.weapons.filter(wp => wp.position === index).length > 0 ? false : isfree;

        isfree = this.players.filter(pl => pl.position === index).length > 0 ? false : isfree;

        return isfree;

    }   

    moveIsPossible() {
        let player1 = cellsPlayers[0].position;
        let player2 = cellsPlayers[1].position;

        //détection des obstacles à proximité des joueurs
        for(let i = 0; i < numberOfObstacles; i++) {

            //let classObstacle = document.getElementsByClassName("obstacle");
            let indexObstacle = cellsObsctacles[i].position;
            let playerPosition;

            if (player1 - 1 != indexObstacle) {
                console.log('OK');
                let playerPosition = player1 - 1;
                console.log('position -1:', playerPosition);
                $("td#"+ player1).addClass("moveIsPossible");
                $("td#"+playerPosition).addClass("moveIsPossible");

            } else {
                
                if (player1 - 1 == indexObstacle){ 
                    console.log('pas bon');
                    playerPosition = player1 - 1;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 - 2 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 - 2;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 - 3 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 - 3;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 + 1 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 + 1;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 + 2 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 + 2;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 + 3 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 + 3;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if(player1 - 10 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 - 10;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 - 20 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 - 20;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 - 30 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 - 30;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 + 10 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 + 10;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 + 20 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 + 20;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } else if (player1 + 30 == indexObstacle) {
                    console.log('pas bon');
                    playerPosition = player1 + 30;
                    $("td#"+playerPosition).removeClass("moveIsPossible");
                } 
            }


            if (player2 - 1 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 - 2 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 - 3 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 + 1 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 + 2 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 + 3 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 - 10 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 - 20 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 - 30 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 + 10 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 + 20 == indexObstacle) {
                console.log('pas bon');
            } else if (player2 + 30 == indexObstacle) {
                console.log('pas bon');
            } 

            //return indexObstacle;
            console.log('Obstacle :', indexObstacle);
            //console.log(cellsIndex);
            
            
        }
        
        

        //let obstacleIsPossible0 = cellsObsctacles[0].position;
    
        //for(let i = 0; i < numberOfObstacles; i++) {
            /*
            if(player1 - 10 == obstacle) {
                console.log('pas bon');
            } else if (player1 + 10 == obstacle) {
                console.log('pas bon');
            } */

            
             
            /*
            if (player2 - 10 == obstacle) {
                console.log('pas bon');
            } else if (player2 + 10 == obstacle) {
                console.log('pas bon');
            } */
            
    
        
         
    }

    /*
    
    lorsque tu génères les positions de tes joueurs, juste après tu vérifies que le joueur 2 n'est pas sur le même x ou y que le joueur 1. Si c'est le cas tu contines à générer la position du joueur 2 (boucle while) jusqu'à ce que la condition soit vérifiée. Exemple :
    while (cellPlayer0.dataset.x === cellPlayer1.dataset.x || cellPlayer0.dataset.y === cellPlayer1.dataset.y) {
    cellPlayer1 = this.getRandomCell();
    }
        
    */
 
} 