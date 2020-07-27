class Weapon {
    constructor(i, position, id){
        this.position = position;
        this.id = i;
        switch(this.id) {
            case 0:
                this.damage = 5;
                this.name = "Fork";
               // this.skin = skin;
            break;
            case 1:
                this.damage = 10;
                this.name = "Lazer";
                //this.skin = skin;
            break;
            case 2:
                this.damage = 15;
                this.name = "Maxi";
                //this.skin = skin;
            break;
            case 3:
                this.damage = 20;
                this.name = "Mega";
                //this.skin = skin;
            break;

        }
    }

}