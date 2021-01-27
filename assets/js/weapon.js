class Weapon {
    constructor(i, position, damage, name){
        this.position = position;
        this.id = i;
        this.damage = damage;
        this.name = name;
        switch(this.id) {
            case 0:
                this.damage = 5;
                this.name = "Fork";
            break;
            case 1:
                this.damage = 10;
                this.name = "Lazer";
            break;
            case 2:
                this.damage = 15;
                this.name = "Maxi";
            break;
            case 3:
                this.damage = 20;
                this.name = "Mega";
            break;

        }
    }

}