export default class BaseScene {
	constructor () {
		this._firstLayer = null;
		this._firstLayerContext = null;
	}
	init (firstLayer, firstLayerContext, secondLayer, secondLayerContext) {
		// console.log('Scene init');
		this._firstLayer = firstLayer;
		this._firstLayerContext = firstLayerContext;

		this._secondLayer = secondLayer;
		this._secondLayerContext = secondLayerContext;

	}

	updateGameField (data) {
		// console.log('Scene updateGameField');
		// console.log('Scene data',data);
		this._field.resetField(data);
		// console.log(this._field._data);
	}

	updateUsers (data) {
		// console.log('Scene updateUsers');
		this._player.update(data.x, data.y, this._field.bricksInField);
	}

	clearFirstLayer () {
		this._firstLayerContext.clearRect(0, 0, this._firstLayer.width, this._firstLayer.height);
	}

	clearSecondLayer () {
		this._secondLayerContext.clearRect(0, 0, this._secondLayer.width, this._secondLayer.height);
	}



	render () {
		// console.log('Scene render');
		// this._field.drawField();
		this._player.draw();
		this._player.plantedBombs.forEach(bomb => {
			bomb.draw();
		});
	}

	loopCallback () {
		this.clearSecondLayer(); 
		this.render();
		window.requestAnimationFrame(this.loopCallback.bind(this));
	}

	startLoop () {
		// this._field.drawField();
		this._player.draw();
		window.addEventListener('resize', function(){console.log("resi")})
		window.requestAnimationFrame(this.loopCallback.bind(this));
	}
}
