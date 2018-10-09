
const CORS_URL = "https://strategio-api.now.sh";

const noop = () => null;
export class AjaxModule {
	_ajax ({callback = noop, method = 'GET', path = '/', body} = {}) {
		const xhr = new XMLHttpRequest();
		xhr.open(method, CORS_URL+path, true);
		xhr.withCredentials = true;

		if (body) {
			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
		}
		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) {
				return;
			}

			callback(xhr);
		};

		if (body) {
			xhr.send(JSON.stringify(body));
		} else {
			xhr.send();
			console.log(xhr.responseText)
		}
	}

	doGet (params = {}) {
		this._ajax({...params, method: 'GET'});
	}
	doPost (params = {}) {
		this._ajax({...params, method: 'POST'});
	}
}
