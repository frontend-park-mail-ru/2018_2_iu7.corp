import Router from '../modules/Router.js';
import Bus from "../modules/Bus.js";
import { getEventTarget } from '../utils.js';

export default class NavigationController {
    keyPressedCallback(event) {
        let link = getEventTarget(event.target);
        if (!link) {
            return;
        }

        event.preventDefault();

        if (link.dataset.href === "/logout") {
            Bus.emit("user-logout")
        }

        Router.open(link.dataset.href);
    }
}