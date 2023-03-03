/************************************************************************/
//************************       Tank Class       ***********************/
/************************************************************************/

export default class Tank {
    constructor( _name ){
        this._owner = _name;

        this._health = 0;
        this._attack = 0;
        this._shield = 0;
        this._speed = 0;
        
        this._power = 0;
        this._isWinner = false;
    }

    get owner () {
        return this._owner;
    }

    set owner( val ){
        this._owner = val;
    }

    get health() {
        return this._health;
    }

    set health( val ) {
        this._health = val;
    }

    get attack() {
        return this._attack;
    }

    set attack( val ) {
        this._attack = val;
    }

    get shield() {
        return this._shield;
    }

    set shield( val ) {
        this._shield = val;
    }

    get speed() {
        return this._speed;
    }

    set speed( val ) {
        this._speed = val;
    }

    get power() {
        return this._power;
    }

    set power( val ) {
        this._power = val;
    }

    get isWinner(){
        return this._isWinner;
    }

    set isWinner( val ){
        this._isWinner = val;
    }

    setProperties( _he, _at, _sh, _sp ){
        this.health = _he;
        this.attack = _at;
        this.shield = _sh;
        this.speed = _sp;

        this.power = Number(_he) + Number(_at) + Number(_sh) + Number(_sp);
    }
}