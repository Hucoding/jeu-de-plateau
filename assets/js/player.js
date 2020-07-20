class Player {
    constructor(id, name, life, position, weapon, oldWeapon, skin, action){
        this.id = id; //id du joueur
        this.weapon = weapon; // arme du joueur
        this.name = name; // nom du joueur
        this.life = life; //point de vie
        this.position = position; //position du joueur
        this.oldWeapon = oldWeapon; // quand le joueur choisis une arme suppression de la précédente remise de l'arme à son emplacement initial
        this.skin = skin; //skin quand le joueur à une arme
        this.action = action; //Est ce que le joueur est en train d'attaquer = true ou de se défendre = false ? 
    }

}

