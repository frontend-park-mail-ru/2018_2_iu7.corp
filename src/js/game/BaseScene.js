import GameBus from './GameBus.ts';

export default class BaseScene {

	getCanvasContext () {
		this.controlsLayer = document.getElementById('canvasControls');

		this.firstLayer = document.getElementById('canvas1');
		this.firstLayerContext = this.firstLayer.getContext('2d');

		this.secondLayer = document.getElementById('canvas2');
		this.secondLayerContext = this.secondLayer.getContext('2d');

		this.firstLayer.width = window.innerWidth;
		this.firstLayer.height = window.innerHeight; //* 0.7;

		this.secondLayer.width = window.innerWidth;
		this.secondLayer.height = window.innerHeight; //* 0.7;

		this.controlsLayer.width = window.innerWidth;
		this.controlsLayer.height = window.innerHeight;
	}

	clearFirstLayer () {
		this.firstLayerContext.clearRect(0, 0, this.firstLayer.width, this.firstLayer.height);
	}

	clearSecondLayer () {
		this.secondLayerContext.clearRect(0, 0, this.secondLayer.width, this.secondLayer.height);
	}

	checkCollisions () {
		this._creeps.forEach( creep => {
			if (creep.xPos === this._players[0].xPos && creep.yPos === this._players[0].yPos) {
				GameBus.emit('single-player-death');
			}
		});
	}

	renderPlayers () {
		this._players.forEach(player => {
			player.drawPlayer();
		});
	}

	// TODO при взрыве бомбы игрок остается в массиве
	renderBombs () {
		this._players.forEach(player => {
			player.plantedBombs.forEach(bomb => {
				bomb.drawBomb();
			});
		});
	}

	renderCreeps () {
		this._creeps.forEach(creep => {
			creep.drawCreep();
		});
	}
}
