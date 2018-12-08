interface IListener {
    [key : string] : Array<Function>
}

class GameBus {
    constructor () {
        this._listeners = {};
    }
    private _listeners : IListener;


    public on (event : string, callback: Function) : void {
        if (!this._listeners[event]) { // todo хз что вернется если такого события нет
            this._listeners[event] = [];
        }
        this._listeners[event].push(callback);
    }

    public off (event : string, callback : Function) : void {
        this._listeners[event] = this._listeners[event].filter( clb => {
            return clb !== callback;
        });
    }

    public emit (event : string, data? : Object | undefined) : void { 
        // console.log(data);
        this._listeners[event].forEach( clb => {
            clb(data);
        });
    }
}

export default new GameBus();