'use strict'

import {
	BoardComponent,
	RENDER_TYPES,
} from './components/Board/Board.mjs';

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


function buildMenuLink () {
    const link = document.createElement('a');
    link.href = link.dataset.href = 'menu';
    link.textContent = 'Главная';
    return link;
}


function buildheader ( title ) {
    const header = document.createElement('div');
    const link = document.createElement('h1');
    const t = document.createElement('h1');
    link.appendChild(buildMenuLink());
    t.textContent = title
    const line = document.createElement('hr');
    
    header.appendChild(link);
    header.appendChild(t);
    header.appendChild(line);
    return header;
}


function buildMenu () {
    const header = document.createElement('div');
    header.textContent = 'Меню';
    root.appendChild(header);
    const titles = {
        rules: 'Rules',
        sign_in: 'Sign in',
        sign_up: 'Sign up',
        leaders: 'Leaders',
        me: 'Profile', 
    };

    Object.entries(titles).forEach(function (entry) {
        const href = entry[0];
        const title = entry[1];
        const a = document.createElement('a');

        a.href = href;
        a.dataset.href = href;
        a.textContent = title;
        root.appendChild(a);
        root.appendChild(document.createElement('br'));
    });
}


function buildSignIn() {
    const form = document.createElement('form');  // общая форма

    const inputs = [
        {
            type: 'text',
            name: 'email',
            label: 'E-mail: '
        },

        {
            type: 'password',
            name: 'password',
            label: 'Пароль: '
        }
    ];

    inputs.forEach(function(item) {
        const form_part = document.createElement('p'); // содержит заголовок и поле ввода
        const b = document.createElement('b'); // заголовок поля
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

        console.log(email);
        console.log(password);

        AJAX.doPost({
            callback (xhr) {
                root.innerHTML = '';
                buildProfile();                
            },
            path: '/login',
            body: {
                email,
                password
            }
        });
    });

    root.appendChild(buildheader('Вход'));
    root.appendChild(form);
}


function buildSignUp () { // аналогично функци логина только больше полей в форме
    const form = document.createElement('form');

    const inputs = [
        {
            type: 'email',
            name: 'email',
            label: 'E-mail: '
        },
        {
            type: 'password',
            name: 'password',
            label: 'Пароль: '
        },
        {
            type: 'password',
            name: 'password_repeat',
            label: 'Повторите пароль: '
        }
    ];

    inputs.forEach(function(item) {
        const form_part = document.createElement('p');
        const b = document.createElement('b');
        b.textContent = item.label; // 
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
            path: '/signup',
            body: {
                email,
                password
            }
        });
    });

    root.appendChild(buildheader('Регистрация'));
    root.appendChild(form);
}


function buildLeaderboard (users) {
    

    const tableWrapper = document.createElement('div');

	if (users) {
		const board = new BoardComponent({el: tableWrapper, type: RENDER_TYPES.STRING});
		board.data = users;
		board.render();
	} else {
		const em = document.createElement('em');
		em.textContent = 'Loading';
        root.appendChild(em);
        
		AJAX.doGet({
			callback (xhr) {
				const users = JSON.parse(xhr.responseText);
				root.innerHTML = '';
				buildLeaderboard(users);
			},
			path: '/users',
		});

        root.appendChild(buildheader('Таблица лидеров'));
        root.appendChild(tableWrapper);
    }
}


function buildProfile(me) {
    const page_label = document.createElement('h2');
    page_label.textContent = 'Настройки учетной записи'
    const parent_div = document.createElement('div');

    if (me) {
        const div1 = document.createElement('div');
        div1.textContent = `E-mail ${me.email}`;

        const div2 = document.createElement('div');
        div2.textContent = `Password ${me.password}`;

        const a = document.createElement('a');
        a.textContent = 'Изменить данные';
        a.href = a.dataset.href= 'change';
    
        parent_div.appendChild(div1);
        parent_div.appendChild(div2);
        parent_div.appendChild(a);

    } else {

        AJAX.doGet({
            callback (xhr) {
                if (!xhr.responseText) {
                    root.innerHTML = '';
                    buildErrorPage('Unauthorized', 'Профиль');
                    return;
                }
                const user = JSON.parse(xhr.responseText);
                root.innerHTML = '';
                buildProfile(user);
            },
            path: '/me'
        });
    }
    
    root.appendChild(buildheader('Профиль'));
    root.appendChild(parent_div);
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


function buildRules() {
    const rules_label = document.createElement( 'h2' );
    rules_label.textContent = 'Захвати или будь захвачен!';

    const main_ul = document.createElement('ul');
    const map = document.createElement('ul');
    const zone_parameters = document.createElement('ul');
    
    const rules = [
        {rule: 'Управление зажиманием и направлением мышки или джойстиком'},
        {rule: 'Цветной круг - персонаж игры'},
        {rule: 'Остановись в области или квадрате, чтобы захватить'},
        {rule: 'Карта:'}
    ];

    rules.forEach(function(item){
        const li = document.createElement('li')
        li.textContent = item.rule;
        main_ul.appendChild(li);
    });

    const map_rules = [
        {rule: 'Квадраты - элементы карты, время захвата отдельного квадрата = 1 сек.'},
        {rule: 'Зоны - выделены жирной линией, состоят из нескольких квадратов, время захвата = 0.5 сек. за каждый квадрат:'}
    ];

    map_rules.forEach(function(item){
        const li = document.createElement('li');
        li.textContent = item.rule;
        map.appendChild(li);
    });
    
    const li = document.createElement('li');
    li.textContent = 'Параметры зон: ';

    const zone_parameters_rules = [
        {rule: '[ ] - пустая зона, захват которых происходит целиком (0.5 секунды / квадрат)'},
        {rule: '[ x ] - зона, недоступная для захвата'},
        {rule: '[ваш цвет] - ваша зона, её могут захватить, защищайте её'},
        {rule: '[цвет другого игрока] - зона врага, захватите её'}
    ];

    zone_parameters_rules.forEach(function(item){
        const li = document.createElement('li');
        li.textContent = item.rule;
        zone_parameters.appendChild(li)
    });

    main_ul.appendChild(map);
    main_ul.appendChild(li);
    main_ul.appendChild(zone_parameters);

    root.appendChild(buildheader('Правила игры '));
    root.appendChild(rules_label);
    root.appendChild(main_ul);
    root.appendChild(document.createElement('hr'));

    const good_luck = document.createElement('h2');
    good_luck.textContent = 'Удачи в игре!';
    root.appendChild(good_luck);
}

const pages = {
    menu: buildMenu,
    rules: buildRules,
    sign_in: buildSignIn,
    sign_up: buildSignUp,
    leaders: buildLeaderboard,
    me: buildProfile,
    change: changeProfile
};

buildMenu();

root.addEventListener('click', function (event) {
    if (!(event.target instanceof HTMLAnchorElement)) {
        return;
    }
    event.preventDefault();
    const link = event.target;

    console.log({
        href: link.href,
        datahref: link.dataset.href
    });
    root.innerHTML = '';
    pages[ link.dataset.href ]();
});