const serverUrl = 'http://176.119.156.66';

export class fetchModule {
	static _ajax ({ method = 'GET', path = '/', body, headers } = {}) {
		const url = serverUrl + path;

		const options = {
			mode: 'cors',
			credentials: 'include',
			method: method,
			headers: {}
		};
		if (headers) {
			options.headers = headers;
		}

		if (body) {
			options.headers['Content-Type'] = 'application/json; charset=utf-8' ;
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
	static doPatch (params = {}) {
		return this._ajax({ ...params, method: 'PATCH' });
	}
}
