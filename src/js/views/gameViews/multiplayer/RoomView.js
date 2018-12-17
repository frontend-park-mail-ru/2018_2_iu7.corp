import BaseView from '../../BaseView.js';
import Bus from '../../../modules/Bus.js';
import Socket from '../../../modules/Socket.js';
import NavigationController from '../../../controllers/NavigationController.js';
import MultiPlayerScene from '../../../game/multiplayer/MultiPlayerScene.js';
import { makeNumberMatrix } from '../../../game/GameUtils.ts';
import { authMenuHeader, notAuthMenuHeader } from '../../dataTemplates/headerMenuData.js';

const roomTmpl = require('../../templates/gameTemplates/room.pug');
const canvasTmpl = require('../../templates/gameTemplates/canvas.pug');

const inGameRenderData = {};

inGameRenderData.helpValues = [
	{
		label: 'Цель игры',
		data: 'Уничтожить всех врагов'
	},
	{
		label: 'Перемещение персонажа',
		data: '"wasd" или стрелочки'
	},
	{
		label: 'Поставить бомбу',
		data: '"f"'
	},
	{
		label: 'Радиус бомбы',
		data: '2 клетки'
	}
];

export default class RoomView extends BaseView {
	constructor () {
		super(roomTmpl);
		this._currentUser = null;
		this._me = null;
		this._meLocked = false;
		this._currentRoomId = null;
		this._connection = new Socket();
		this._navigationController = new NavigationController();
		Bus.on('done-get-user', this._setCurrentUser.bind(this));
		Bus.on('done-get-target-room', this._setCurrentRoomId.bind(this));
		Bus.on('multiplayer-room-pending', this.render.bind(this)); // отрисовываем новых людей
		Bus.on('multiplayer-room-pending', this._setInitialFieldMatrix.bind(this)); // предварительно перед началом игры создаем карту нужного размера из блоков grass
		Bus.on('multiplayer-room-pending', this._setPlayersId.bind(this));
		Bus.on('multiplayer-room-on', this.renderGame.bind(this))
	}

	_setCurrentUser (user) {
		this._currentUser = user;
	}

	_setCurrentRoomId (id) {
		this._currentRoomId = id;
	}

	// инициализируем матрицу заданного размера кубиками grassBrick до начала игры
	_setInitialFieldMatrix (data) {
		const matrix = makeNumberMatrix(data.field_size.height, data.field_size.width)
		MultiPlayerScene.initNumberMatrix(matrix)
	}

	// каждый раз когда в комнату заходит игрок, обновляем массив игроков для будущей сцены
	// массив игроков да начала игры является массивом id каждого игрока
	_setPlayersId (data) {
		console.log("connected: ", data)
		MultiPlayerScene.setPlayersId(data.players);
	}

	show () {
		Bus.emit('get-user');
		Bus.emit('get-target-room');
		this._connection.setRoomId(this._currentRoomId);
		this._connection.connectionOpen();

		super.show();
	}

	render (data) {
		// нужно, чтобы выделить текущего пользователя
		if (!this._meLocked){
			this._me = data.players[data.players.length - 1];
			this._meLocked = true;
		}

		const renderData = {
			players : data.players,
			me: this._me
		};

		if (!this._currentUser.is_authenticated) {
			renderData.headerValues = notAuthMenuHeader();
			renderData.headerValues.push({
				label: 'Завершить игру',
				href: "javascript:void(0)",
				id:"stop-game"
			});
			super.render(renderData);
		} else {
			renderData.headerValues = authMenuHeader(this._currentUser.id);
			renderData.headerValues.push({
				label: 'Завершить игру',
				href: "javascript:void(0)",
				id:"stop-game"
			});
			super.render(renderData);
		}
		this.registerActions();
	}

	renderGame () { 
		this._template = canvasTmpl;
		if (!this._currentUser.is_authenticated) {
			inGameRenderData.headerValues = notAuthMenuHeader();
			inGameRenderData.headerValues.push({
				label: 'Завершить игру',
				href: "javascript:void(0)",
				id:"stop-game"
			});
			super.render(inGameRenderData);
		} else {
			inGameRenderData.headerValues = authMenuHeader(this._currentUser.id);
			inGameRenderData.headerValues.push({
				label: 'Завершить игру',
				href: "javascript:void(0)",
				id:"stop-game"
			});
			super.render(inGameRenderData);
		}
		this.showInfo();
		MultiPlayerScene.init();
		MultiPlayerScene.startLoop();
	}


	hide () {
		super.hide();
		Bus.totalOff('multiplayer-room-pending');
		Bus.totalOff('multiplayer-room-on');
		Bus.totalOff('multiplayer-object-player');
		Bus.totalOff('multiplayer-object-wall.solid');
		Bus.totalOff('multiplayer-object-wall.weak');

		this._connection.connectionClosed();
		console.log('connection closed');
	}

	showInfo () {
		document.getElementById('dropdown-game-info').style.height = '100%';
	};

	hideInfo () {
		document.getElementById('dropdown-game-info').style.height = '0%';
	};

	registerActions () {
		const startButton = document.getElementById('start-game');
		startButton.addEventListener('click', () => {
			this.renderGame.bind(this)
			this._connection.startGame();
		})

		const stopButton = document.getElementById('stop-game');
		stopButton.addEventListener('click', () => {
			this._connection.stopGame();
		})
		// this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
