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
            let weapon = new Weapon(weaponIndex, randomWeapon);
            this.weapons.push(weapon);

            let imgWeapon = $("<img />");
            let imgWeaponUrl = "assets/imgs/weapons/"+ randomWeapon +".png";
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

            let player = new Player(playerIndex);
            let weapon = new Weapon(playerIndex, 0);

            this.players.push(player);
            this.weapons.push(weapon);

            let imgWeapon = $("<img />");
            let imgWeaponUrl = "assets/imgs/weapons/"+ 0 +".png";

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

} 