import Bus from '../../modules/Bus.js';
import Vector from './Vector.js';
import getDirectionFromTouch from '../utils/math.js';

export default class Controls {
	constructor () {
        this._registeredActions = false;
        this._paddingHeight = window.innerHeight * 0.2;
        this._halfWidth = window.innerWidth / 2;
        this.leftTouchID = -1;
        this._leftTouchPos = new Vector(0,0);
        this._leftTouchStartPos = new Vector(0,0);
        this._context = null;
        this._canvas = null;
        
        this._touches = []; // array of touch vectors

        // вот именно эти две переменные отвечают за адекватную отправку команд
        this._moveInterval = 120;
        this.time = 0;
        this.direction = null;

        this._keyCodes = {
            UP : [38, 87, 'up'],
            DOWN: [40, 83, 'down'],
            LEFT: [37, 65, 'left'],
            RIGHT: [39, 68, 'right'],
            BOMB: [13, 32, 'bomb'],
            F: [70, 'f'],
        }

        this.moveArray = [];
    }

    resetControlsPos(e){
        this._paddingHeight = window.innerHeight * 0.2;
        this._halfWidth = window.innerWidth / 2;
        window.scrollTo(0,0); 
    }
    
    init (canvas) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        console.log('ctx: ', this._context);
		if (!this._registeredActions) {
			window.addEventListener('touchstart', this.onTouchStart.bind(this));
			window.addEventListener('touchmove', this.onTouchMove.bind(this));
            window.addEventListener('touchend', this.onTouchEnd.bind(this));
            window.addEventListener('onorientationchange', this.resetControlsPos.bind(this));
            window.addEventListener('onresize', this.resetControlsPos.bind(this));

            document.addEventListener('keydown', this.onKeyDown.bind(this));
            document.addEventListener('keyup', this.onKeyUp.bind(this));
			this._registeredActions = true;
        }
        this.sendBusMessage();
    }

    handleMessage(message){
        if (this._keyCodes.UP.includes(message)) {
			Bus.emit('single-user', {dx:0, dy:-1, pointer : 1});
		}
		if (this._keyCodes.RIGHT.includes(message)) {
            Bus.emit('single-user', {dx:1, dy:0, pointer : 2});
		}
		if (this._keyCodes.DOWN.includes(message)) {
            Bus.emit('single-user', {dx:0, dy:1, pointer : 3});
		}
		if (this._keyCodes.LEFT.includes(message)) {
            Bus.emit('single-user', {dx:-1, dy:0, pointer : 4});
		}
		if (this._keyCodes.BOMB.includes(message)) {
            Bus.emit('single-setBomb');
        }
        if (this._keyCodes.F.includes(message)) /* f to pay respects */ {
			// Bus.emit('pay-respects');
			console.log("F")
		}
    }

    sendBusMessage(){ 
        if (performance.now() - this.time > this._moveInterval && this.direction){
            this.time = performance.now();
            this.handleMessage(this.direction);
        }
        this.drawControls(this._canvas, this._context);
        requestAnimationFrame( () => {
            this.sendBusMessage();
        });
    }

	onKeyDown (e) {
        this.direction = e.keyCode;
    }
    
    onKeyUp (e) {
        this.direction = null;
	}

	onTouchStart(e) {
        for(let i = 0; i<e.changedTouches.length; i++){
			let touch = e.changedTouches[i]; 
			if((this.leftTouchID<0) && (touch.clientX<this._halfWidth) && (touch.clientY > this._paddingHeight)){
                this.leftTouchID = touch.identifier;
                this._leftTouchStartPos.reset(touch.clientX, touch.clientY); 	
				this._leftTouchPos.copyFrom(this._leftTouchStartPos); 
				continue; 		
			} else if (touch.clientY > this._paddingHeight) {
                this.direction = 'bomb';
			}	
		}
		this._touches = e.touches; 
    }
	 
	onTouchMove(e) {
		// Prevent the browser from doing its default thing (scroll, zoom)
        // e.preventDefault(); 
        for(let i = 0; i<e.changedTouches.length; i++){
            let touch = e.changedTouches[i]; 
			if(this.leftTouchID == touch.identifier){
                this._leftTouchPos.reset(touch.clientX, touch.clientY); 
                this.direction = getDirectionFromTouch(this._leftTouchStartPos, this._leftTouchPos)
                break; 		
			}		
		}
		this._touches = e.touches; 
	} 
	 
	onTouchEnd(e) { 
		this._touches = e.touches; 
		for(let i = 0; i<e.changedTouches.length; i++){
			let touch =e.changedTouches[i]; 
			if(this.leftTouchID == touch.identifier){
                this.leftTouchID = -1;
                this.direction = null; 
                break; 		
			}		
		}
    }
    
    drawControls(canvas, context){ 
        for(let i=0; i<this._touches.length; i++) {
            let touch = this._touches[i]; 
            if(touch.identifier == this.leftTouchID){
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath(); 
                context.strokeStyle = "cyan"; 
                context.lineWidth = 6; 
                context.arc(this._leftTouchStartPos._x, this._leftTouchStartPos._y, 40,0,Math.PI*2,true); 
                context.stroke();
                context.beginPath(); 
                context.strokeStyle = "cyan"; 
                context.lineWidth = 2; 
                context.arc(this._leftTouchStartPos._x, this._leftTouchStartPos._y, 60,0,Math.PI*2,true); 
                context.stroke();
                context.beginPath(); 
                context.strokeStyle = "cyan"; 
                context.arc(this._leftTouchPos._x, this._leftTouchPos._y, 40, 0,Math.PI*2, true); 
                context.stroke(); 
                
            } else {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath(); 
                context.fillStyle = "white";
                context.beginPath(); 
                context.strokeStyle = "red";
                context.lineWidth = "6";
                context.arc(touch.clientX, touch.clientY, 40, 0, Math.PI*2, true); 
                context.stroke();
            }
        }
    } 
}
