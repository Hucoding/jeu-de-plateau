class Player {
    constructor(id, name, position, weaponOnHands){
        this.id = id; 
        this.name = name; 
        this.position = position; 
        this.weaponOnHands = [weaponOnHands];
        this.life = maxLife;
        this.isLife = true;
    }

    // Getters
    getName() {
        return this.name;
    }

    getPosition() {
        return this.position;
    }

    getLife() {
        return this.life;
    }

    getIsLife() {
        return this.isLife;
    }

    // Setters
    setName(newValue) {
        this.name = newValue;
    }

    setPosition(newValue) {
        this.position = newValue;
    }

    // Recois le dégat affligé à sa vie
    setLife(newValue) {
        this.life = this.life - newValue;
        if(this.life <= 0) {
            this.isLife = false;
        }
    }

}



