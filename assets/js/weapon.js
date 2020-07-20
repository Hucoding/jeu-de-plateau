class Weapon {
    constructor(position, id){
        this.position = position;
        this.id = id;
        switch(this.id) {
            case 0:
                this.damage = 5;
                this.name = "Fork";
               // this.skin = skin;
            break;
            case 1:
                this.damage = 10;
                this.name = "Lazer gun";
                //this.skin = skin;
            break;
            case 2:
                this.damage = 15;
                this.name = "Maxi gun";
                //this.skin = skin;
            break;
            case 3:
                this.damage = 20;
                this.name = "Mega gun";
                //this.skin = skin;
            break;

        }
    }
    /*
    skinForTheWeapon(element, random) {
        if(cellsWeapons.indexOf(Weapon)) {
            let imageUrl = "assets/imgs/weapons/"+ random +".png";
            this.skin = imageUrl;
            element.css("background-image", "url(" + this.skin + ")");
        } 
    }*/

}