'use strict';
import {createSignIn} from './components/Login/login.js';
import {createSignUp} from './components/Register/register.js';
import {createLeaderboard} from './components/Leaderboard/leaderboard.js';
import {createProfile} from './components/Profile/profile.js';
import {createMenu} from './components/Menu/menu.js';




export const CORS_URL = "https://strategio-api.now.sh";

const root = document.getElementById('root');
const AJAX = window.AjaxModule;


function errorMessage(title) { 
    if (!document.getElementById('error')) { // если сообщение об ошибке еще не было выведено
        const error_div = document.createElement('div');
        error_div.id = 'error';

        const p = document.createElement('p');
        p.textContent = title;
        error_div.appendChild(p);
        root.appendChild(error_div);
    } else {
        return;
    }
}


function buildErrorPage (error, title) { 
    root.appendChild(buildheader(title)); // добавляем заголовок который был на странице
    errorMessage(error); // добавляем сообщение об ошибке
}


function buildheader ( title ) {
    const header = document.createElement('div');
    const link = document.createElement('h1');
    const t = document.createElement('h1');
    link.appendChild(createMenuLink());
    t.textContent = title
    const line = document.createElement('hr');
    
    header.appendChild(link);
    header.appendChild(t);
    header.appendChild(line);
    return header;
}

function createMenuLink () {
    const link = document.createElement('a');
    link.href = link.dataset.href = 'menu';
    link.textContent = 'Главная';
    return link;
}

function changeProfile() {
    const form = document.createElement('form');
    const inputs = [
        {
            type: 'email',
            name: 'email',
            label: 'Новый E-mail: '
        },
        {
            type: 'password',
            name: 'password',
            label: 'Новый Пароль: '
        },
        {
            type: 'password',
            name: 'password_repeat',
            label: 'Новый Повторите пароль: '
        }
    ];

    inputs.forEach(function(item) {
        const form_part = document.createElement('p');
        const b = document.createElement('b');
        b.textContent = item.label;
        form_part.appendChild(b);
        form_part.appendChild(
            document.createElement('br')
        )

        const input = document.createElement('input');
        input.type = item.type;
        input.name = item.name;
        form_part.appendChild(input);
        form.appendChild(form_part);

    });
    const button = document.createElement('input');
    button.type = 'submit';
    button.name = 'submit';
    form.appendChild(button);

    form.addEventListener('submit', function ( event ) {
        event.preventDefault();
        const email = form.elements[ 'email' ].value;
        const password = form.elements[ 'password' ].value;
        const password_repeat = form.elements[ 'password_repeat' ].value;

        if (password !== password_repeat) {
            errorMessage('Пароли не совпадают');
            return;
        }
        AJAX.doPost({
            callback (xhr) {
                root.innerHTML = '';
                buildProfile();                
            },
            path: '/change',
            body: {
                email,
                password
            }
        });
    });

    root.appendChild(buildheader('Изменение данных'));
    root.appendChild(form);
}

const pages = {
	menu: createMenu,
	login: createSignIn,
	register: createSignUp,
	leaders: createLeaderboard,
	profile: createProfile,
	change: changeProfile
};

createMenu();

root.addEventListener('click', function (event) {
	if (!(event.target instanceof HTMLAnchorElement)) {
		return;
	}

	event.preventDefault();
	const link = event.target;

	console.log({
		href: link.href,
		dataHref: link.dataset.href
	});

	root.innerHTML = '';

	pages[ link.getAttribute('href') ]();
});
