const root = document.getElementById('root');

function buildheader (title) {
	const header = document.createElement('div');
	const link = document.createElement('h1');
	const t = document.createElement('h1');
	link.appendChild(createMenuLink());
	t.textContent = title;
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

export function buildErrorPage (error, title) {
	root.appendChild(buildheader(title)); // добавляем заголовок который был на странице
	errorMessage(error); // добавляем сообщение об ошибке
}

export function errorMessage (errorMessage) {
	if (!document.getElementById('error')) { // если сообщение об ошибке еще не было выведено
		const errorDiv = document.createElement('div');
		errorDiv.id = 'error';

		const p = document.createElement('p');
		p.textContent = errorMessage;
		errorDiv.appendChild(p);
		root.appendChild(errorDiv);
	}
}
