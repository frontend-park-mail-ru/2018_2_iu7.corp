import Bus from './Bus.js';
import { version } from 'punycode';

class Router {
    constructor() {
        this._routes = {};
        this._currentRoute = null;
    }

    /**
     * Register a new path
     */
    register(path, View) {
        this._routes[path] = {
            View: View,
            viewEntity: null
        };

        return this;
    }

    /**
     * Run action by path
     * 
     * @return {Router}
     */
    open(path = '/') {
        let fullPath = path;
        let aPath = path.split('/');
        path = '/' + aPath[1];
        
        if (!this._routes[path]) {
            console.log('Router.js: no such page');
            return;
        }
        console.log(this._routes[path]);

        if (this._routes[path].viewEntity === null) {
            console.log('ROUTER if 1');
            this._routes[path].viewEntity = new this._routes[path].View();
        }

        // TODO открытие лидерборда

        window.history.pushState({lastRoute: this._currentRoute}, "", fullPath);
        this._currentRoute = path;

        if (!this._routes[path].viewEntity.isShown) {
            console.log('ROUTER if 3');
            Object.values(this._routes).forEach(({viewEntity}) => {
                if (viewEntity && viewEntity.isShown) {
                    console.log('VIEW IS SHOWN', viewEntity);
                    viewEntity.hide();
                }     
            });

            this._routes[path].viewEntity.show();
        } else {
            if (path === this._currentRoute) {
                this.rerender();
            }
        }
        return this;
    }


    rerender() {
        this._routes[this._currentRoute].viewEntity.show();
    }

    getPathTo(View) {
        for (let key in Object.getOwnPropertyNames(this._routes)) {
            if (this._routes[key].View === View) {
                return key;
            }
        }
    }
}

export default new Router();

window.addEventListener('popstate', function (event) {
    event.preventDefault();

    if (event.state.lastRoute) {
        router.open(event.state.lastRoute);
    }

});