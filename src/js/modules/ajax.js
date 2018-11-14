const serverUrl = 'https://bombergame-backend.now.sh';

export class fetchModule {
	static _ajax ({ method = 'GET', path = '/', body } = {}) {
		const url = serverUrl + path;

		const options = {
			mode: 'cors',
			credentials: 'include',
			method: method
		};

		if (body) {
			options.headers = { 'Content-Type': 'application/json; charset=utf-8' };
			options.body = JSON.stringify(body);
		}
		return fetch(url, options);
	}

	static doGet (params = {}) {
		return this._ajax({ ...params, method: 'GET' });
	}

	static doPost (params = {}) {
		return this._ajax({ ...params, method: 'POST' });
	}

	static doDelete (params = {}) {
		return this._ajax({ ...params, method: 'DELETE' });
	}

	static doPut (params = {}) {
		return this._ajax({ ...params, method: 'PUT' });
	}
}
