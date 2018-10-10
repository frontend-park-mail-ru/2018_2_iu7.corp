const noop = () => null;

export class AjaxModule {
	_ajax ({callback = noop, method = 'GET', path = '/', body} = {}) {
		if (body) {
			body = JSON.stringify(body);
		}

		fetch('https://strategio-api.now.sh' + path, {
			method,
			body,
			mode: 'cors',
			credentials: 'include',
		  }).then(callback);
	}

	doGet (params = {}) {
		this._ajax({...params, method: 'GET'});
	}
	doPost (params = {}) {
		this._ajax({...params, method: 'POST'});
	}
}