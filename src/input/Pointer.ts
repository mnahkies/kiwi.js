/// <reference path="../core/Game.ts" />
/// <reference path="../geom/Point.ts" />
/// <reference path="../geom/Circle.ts" />

module Kiwi.Input {

    export class Pointer {

        /*
        *
        * @method constructor
        * @param {Kiwi.Game} game
        * @return Kiwi.Input.Pointer
        */
        constructor(game:Kiwi.Game) {
            this._game = game;
            this.point = new Kiwi.Geom.Point();
            this.circle = new Kiwi.Geom.Circle(0, 0, 1);
        }

        /*
        * The type of object this class is.
        * @method objType
        * @return {string}
        */
        public objType():string {
            return 'Pointer';
        }

        /*
        * The game that this pointer belongs to.
        * @property _game
        * @type Kiwi.Game
        */
        private _game: Kiwi.Game;

        /*
        * Get the game that this pointer belongs to.
        * @type Kiwi.Game
        */
        public get game(): Kiwi.Game {
            return this._game;
        }

        /*
        * The unique identifier for this pointer.
        * @property _id
        * @type number
        */
        public id: number;

        /**
        * The horizontal coordinate of point relative to the game element
        * @property x
        * @type Number
        */
        public x: number = -1;

        /**
        * The vertical coordinate of point relative to the game element
        * @property y
        * @type Number
        */
        public y: number = -1;
        
        /**
        * The horizontal coordinate of point relative to the viewport in pixels, excluding any scroll offset
        * @property clientX
        * @type Number
        */
        public clientX: number = -1;

        /**
        * The vertical coordinate of point relative to the viewport in pixels, excluding any scroll offset
        * @property clientY
        * @type Number
        */
        public clientY: number = -1;

        /**
        * The horizontal coordinate of point relative to the viewport in pixels, including any scroll offset
        * @property pageX
        * @type Number
        */
        public pageX: number = -1;

        /**
        * The vertical coordinate of point relative to the viewport in pixels, including any scroll offset
        * @property pageY
        * @type Number
        */
        public pageY: number = -1;

        /**
        * The horizontal coordinate of point relative to the screen in pixels
        * @property screenX
        * @type Number
        */
        public screenX: number = -1;

        /**
        * The vertical coordinate of point relative to the screen in pixels
        * @property screenY
        * @type Number
        */
        public screenY: number = -1;

        /**
        * The point that this pointer is at. Same c ordina es asX/Y properties.
        * @property point
        * @type Kiwi.Geom.Point
        */
        public point: Kiwi.Geom.Point;
        
        /**
        * A circle that is representative of the area this point covers.
        * @property circle
        * @type Kiwi.Geom.Circle
        */
        public circle: Kiwi.Geom.Circle;
         
        /**
        * Indicates if this pointer is currently down.
        * @property isDown
        * @type boolean
        */
        public isDown: boolean = false;
        
        /**
        * Indicates if this pointer is currently up.
        * @property isUp
        * @type boolean
        */
        public isUp: boolean = true;
         
        /**
        * Indicates if this pointer is currently within the game.
        * @property withinGame
        * @type boolean
        */
        public withinGame: bool = false;
         
        /**
        * Indicates if this pointer is active. Note a mouse is always 'active' where as a finger is only active when it is down.
        * @property active
        * @type boolean
        */
        public active: bool = false;
         
        /**
        * Indicates the time that the pointer was pressed initially.
        * @property timeDown
        * @type number
        */
        public timeDown: number = 0;
        
        /**
        * Indicates the time that the pointer was released initially.
        * @property timeUp
        * @type number
        */
        public timeUp: number = 0;
        
        /**
        * The duration that the pointer has been down for in milliseconds.
        * @property duration
        * @type number
        */
        public duration: number = 0;
        
        /*
        * The duration that the pointer has been down for in frames.
        * @property frameDuration
        * @type number
        */
        public frameDuration: number = 0;
        
        /**
        * A time that is used to calculate if someone justPressed the pointer.
        * @property justPressedRate
        * @type number
        */
        public justPressedRate: number = 200;
         
        /**
        * A time that is used to calculate if someone justReleased the pointer.
        * @property justReleasedRate
        * @type number
        */
        public justReleasedRate: number = 200;
        
        /**
        * The method that gets executed when the pointer presses/initially goes down on the screen.
        * From the event passed the coordinates are calculated.
        * @method start
        * @param {event} event
        */
        public start(event) {
            this.move(event); 

            this.frameDuration = 0;
            this.withinGame = true;
            this.isDown = true;
            this.isUp = false;
            this.timeDown = this.game.time.now();
        }
        
        /**
        * The stop method is to be called when the pointer gets released initially. 
        * @method stop
        * @param {event} event
        */
        public stop(event) {
            this.withinGame = false;

            this.isDown = false;
            this.isUp = true;

            this.timeUp = this.game.time.now();
            this.duration = this.timeUp - this.timeDown;
        }
         
        /**
        * Used to get the cooridnates of a pointer and inputs them to the correct properties.  
        * @method move
        * @param {event} event
        */
        public move(event) { 
            this.clientX = event.clientX;
            this.clientY = event.clientY;

            this.pageX = event.pageX;
            this.pageY = event.pageY;

            this.screenX = event.screenX;
            this.screenY = event.screenY;

            this.x = this.pageX - this.game.stage.offset.x;
            this.y = this.pageY - this.game.stage.offset.y;

            this.point.setTo(this.x, this.y);
            this.circle.x = this.x;
            this.circle.y = this.y;

            this.duration = this.game.time.now() - this.timeDown;
        }
         
        /**
        * Indicates if the pointer was just pressed. This is based of the justPressedRate unless otherwise specifieds.
        * @method justPressed
        * @param {number} duration
        * @return bool
        */
        public justPressed(duration: number = this.justPressedRate): bool {

            if (this.isDown === true && (this.timeDown + duration) > this._game.time.now()) {
                return true;
            } else {
                return false;
            }

        }
         
        /**
        * Indicates if the pointer was just released. This is based of the justReleasedRate unless otherwise specified.
        * @method justReleased
        * @param {number} duration
        * @return bool
        */
        public justReleased(duration: number = this.justReleasedRate): bool {

            if (this.isUp === true && (this.timeUp + duration) > this._game.time.now()) {
                return true;
            } else {
                return false;
            }

        }
        
        /**
        * Resets the pointer properties to the default ones. Assumes that the pointer is no longer down.
        * @method reset
        */
        public reset() {
            this.isDown = false;
            this.isUp = true;
            this.timeDown = 0;
            this.timeUp = 0;
            this.duration = 0;
            this.frameDuration = 0;
        }
            
        /**
        * The update loop for the pointer. Used only if down to update the duration.
        * @method update.
        */
        public update() {
            if (this.isDown === true) {
                this.frameDuration ++;
                this.duration = this._game.time.now() - this.timeDown;
            } 
        }

    }

}