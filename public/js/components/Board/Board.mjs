export const RENDER_TYPES = {
	DOM: 'dom',
	STRING: 'string',
	TMPL: 'template',
};

export class BoardComponent {
	constructor ({el = document.body, type = RENDER_TYPES.DOM} = {}) {
		this._el = el;
		this._type = type;
	}

	get data () {
		this._data;
	}

	set data (data = []) {
		this._data = data;
	}

	render () {
		if (!this._data) {
			return;
		}

		switch (this._type) {
			case RENDER_TYPES.DOM:
				this._renderDOM();
				return;
			case RENDER_TYPES.STRING:
				this._renderString();
				return;
			// case RENDER_TYPES.TMPL:
			// 	this._renderTMPL();
			// 	return;
		}
	}

	// _renderTMPL () {
	// 	const template = window.fest['js/components/Board/Board.tmpl'](this._data);
	// 	this._el.innerHTML = template;
	// }

	_renderString () {
		console.log('leaders_data: ', this._data);
		this._el.innerHTML = `
		<table border="1" cellpadding="0" cellspacing="0">
			<thead>
				<tr class="table-head__row">
					<th>avatar</th>
					<th>id</th>
					<th>score</th>
					<th>username</th>

				</tr>
			</thead>
			<tbody>
				${this._data.profiles.map(({avatar, id, score, username}) => (
					`
						<tr class="table-body__row">
							<td>${avatar}</td>
							<td>${id}</td>
							<td>${score}</td>
							<td>${username}</td>
						</tr>
					`.trim()
				)).join('\n')}
			</tbody>
		</table>
		`.trim();
	}

	_renderDOM () {

		const table = document.createElement('table');
		const thead = document.createElement('thead');
		thead.innerHTML = `
		<tr>
			<th>Email</th>
			<th>Age</th>
			<th>Score</th>
		</th>
		`;
		const tbody = document.createElement('tbody');

		table.appendChild(thead);
		table.appendChild(tbody);
		table.border = 1;
		table.cellSpacing = table.cellPadding = 0;

		this._data.forEach(function (user) {
			const email = user.email;
			const age = user.age;
			const score = user.score;

			const tr = document.createElement('tr');
			const tdEmail = document.createElement('td');
			const tdAge = document.createElement('td');
			const tdScore = document.createElement('td');

			tdEmail.textContent = email;
			tdAge.textContent = age;
			tdScore.textContent = score;

			tr.appendChild(tdEmail);
			tr.appendChild(tdAge);
			tr.appendChild(tdScore);

			tbody.appendChild(tr);

			this._el.appendChild(table);
		}.bind(this));
	}
}
