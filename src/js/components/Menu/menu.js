import {fetchModule} from '../../modules/ajax.js'


const menu = require('./menu.pug');
const root = document.getElementById('root');

export function createMenu () {


	fetchModule.doGet({path: '/profiles/current'})
		.then(response => {
			if (response.status === 200) {
				return response.json();
			}

			return Promise.reject(new Error('not auth'));
		})
		.then((user) => {
			const titles = {
				leaders: 'Лидеры',
				profile: 'Мой профиль',
				logout: 'Выйти'
			};
			const links = ['leaders', 'profile', 'logout'];
		
			const menuDiv = document.createElement('div');
			menuDiv.innerHTML = menu({ 'hrefs': links, 'labels': titles });
			root.appendChild(menuDiv);
		})
		.catch((err) => {
			const titles = {
				login: 'Вход',
				register: 'Регистрация',
				leaders: 'Лидеры',
			};
			const links = ['login', 'register', 'leaders'];
		
			const menuDiv = document.createElement('div');
			menuDiv.innerHTML = menu({ 'hrefs': links, 'labels': titles });
			root.appendChild(menuDiv);
		})
}
