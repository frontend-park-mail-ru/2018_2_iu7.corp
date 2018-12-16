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

	clearFirstLayer () {
		this._firstLayerContext.clearRect(0, 0, this._firstLayer.width, this._firstLayer.height);
	}

	clearSecondLayer () {
		this._secondLayerContext.clearRect(0, 0, this._secondLayer.width, this._secondLayer.height);
	}

	render () {
		// console.log(this._players); // TODO при взрыве бомбы игрок остается в массиве
		this._players.forEach(player => {
			player.plantedBombs.forEach( bomb => {
				bomb.drawBomb();
			})
		}) 

		this._players.forEach(player => {
			player.drawPlayer();
		}) 
	}

	loopCallback () {
		this.clearSecondLayer();
		this.render();
		window.requestAnimationFrame(this.loopCallback.bind(this));
	}

	startLoop () {
		window.requestAnimationFrame(this.loopCallback.bind(this));
	}
}
