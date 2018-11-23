import BaseView from './BaseView.js';
import Game from '../game/Game.js';
const canvasTmpl = require('./templates/canvas.pug')


export default class GameView extends BaseView {
    constructor() {
        super(canvasTmpl);
    }

    show() {
        super.show();
        this.render();
        Game.init()
        Game.start();
    }

    render() {
        const data = {
            title: 'Game'
        }
        super.render(data);
    }
}