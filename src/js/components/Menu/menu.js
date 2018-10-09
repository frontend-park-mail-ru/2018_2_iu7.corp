'use strict'

const menu = require('./menu.pug');

const root = document.getElementById('root');

export function createMenu () {

    const titles = {
        login: 'Вход',
        register: 'Регистрация',
        leaders: 'Лидеры',
        profile: 'Мой профиль'
    };
    const links = ['login', 'register', 'leaders', 'profile'];

    const menuDiv = document.createElement('div');
    menuDiv.innerHTML = menu({'hrefs': links, 'labels':titles});
    root.appendChild(menuDiv);
}