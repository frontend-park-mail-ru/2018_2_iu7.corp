export default class BaseView {
    constructor() {
        console.log('BASE CONSTRUCTOR');
        this.viewDiv = document.createElement('div');
        BaseView.rootToRender.appendChild(this.viewDiv);
        this.viewDiv.hidden = true;
    }

    get isShown() {
        return this.viewDiv.hidden === false;
    }

    static get rootToRender() {
        return document.getElementById('root');
    }

    show() {
        console.log('BASE SHOW');
        this.viewDiv.hidden = false;
    }

    hide() {
        this.viewDiv.hidden = true;
    }

    render() {
        this.viewDiv.innerHTML = '';
    }
}