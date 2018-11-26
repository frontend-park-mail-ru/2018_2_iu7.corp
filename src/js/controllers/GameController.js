import Bus from '../modules/Bus.js';

class GameController {
    constructor () {
		this._targetGameId = null;
    }
    
    _setTargetGameId (id) {
        console.log('controller', id);
		if (id) {
			this._targetGameId = id;
		}
    }
    
    _getTargetGameId () {
        Bus.emit('done-get-target-room', this._targetGameId);
    }

}

export default new GameController();