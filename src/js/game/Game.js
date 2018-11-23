import Bus from '../modules/Bus.js';
import Scene from './Scene.js'

class Game{
    constructor(socketUrl) {
        this._socketUrl = socketUrl;
        this._socket = new WebSocket(this._socketUrl);
        this._scene = new Scene();
        // this.send.bind(this);
    }

    init() {
        console.log('Game init');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        this._scene.init(canvas, ctx);
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }
    

    start() {
        console.log('Game start');
        this._socket.send('ready');
        this.update();
        Bus.emit('scene-start');
    }

    update() {
        console.log('Game Update');
        this._socket.onmessage = function(event) {
            let incomingMessage = JSON.parse(event.data); 
            Game.prototype.proxy(incomingMessage);
        }
    }

    proxy(message){
        console.log('Game Proxy');
        switch (message.type){
            case "user":
                this.emitUpdateUsers(message.data);
                break;
            case "field":
                this.emitUpdateGameField(message.data);
                break;
            default:
                break;
        }
    }

    emitUpdateGameField(data){
        console.log('Game emitUpdateGameField', 'field Data', data);
        Bus.emit('updateGameField', data);
    }

    emitUpdateUsers(data){
        console.log('Game emitUpdateUsers');
        Bus.emit('updateUser', data);    
    }

    emitUpdateBomb() {

    }

    send(message){
        console.log('Game send', 'message', message);
        this._socket.send(message);
        this.update();
    }

    onKeyDown(e) {
        console.log('keycode',e.keyCode);
        if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */){
            // this.send("up");
            this._socket.send("up");
            this.update();
          }
        if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */){
            // this.send("right");
            this._socket.send("right");
            this.update();
        }
        if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */){
            // this.send("down");
            this._socket.send("down");
            this.update();
        }
        if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */){
            // this.send("left");
            this._socket.send("left");
            this.update();
        }
        
    }
    
}

export default new Game("ws://80.252.155.65:8081");