const users = {
	'a.ostapenko@corp.mail.ru': {
		email: 'a.ostapenko@corp.mail.ru',
		password: 'password',
		age: 21,
		score: 72
	},
	'd.dorofeev@corp.mail.ru': {
		email: 'd.dorofeev@corp.mail.ru',
		password: 'password',
		age: 21,
		score: 100500
	},
	's.volodin@corp.mail.ru': {
		email: 'marina.titova@corp.mail.ru',
		password: 'password',
		age: 21,
		score: 72
	},
	'a.tyuldyukov@corp.mail.ru': {
		email: 'a.tyuldyukov@corp.mail.ru',
		password: 'password',
		age: 21,
		score: 72
	}
};
const ids = {};

const initMocks = (app) => {
	app.post('/signup', function (req, res) {
		const password = req.body.password;
		const email = req.body.email;
		const age = req.body.age;
		if (
			!password || !email || !age ||
			!password.match(/^\S{4,}$/) ||
			!email.match(/@/) ||
			!(typeof age === 'number' && age > 10 && age < 100)
		) {
			return res.status(400).json({
				error: 'Не валидные данные пользователя'
			});
		}
		if (users[email]) {
			return res.status(400).json({
				error: 'Пользователь уже существует'
			});
		}

		const id = uuid();
		const user = {
			password,
			email,
			age,
			score: 0
		};
		ids[id] = email;
		users[email] = user;

		res.cookie('session_id', id, {
			expires: new Date(Date.now() + 1000 * 60 * 10)
		});
		res.status(201).json({
			id
		});
	});

	app.post('/login', function (req, res) {
		const password = req.body.password;
		const email = req.body.email;
		if (!password || !email) {
			return res.status(400).json({
				error: 'Не указан E-Mail или пароль'
			});
		}
		if (!users[email] || users[email].password !== password) {
			return res.status(400).json({
				error: 'Не верный E-Mail и/или пароль'
			});
		}

		const id = uuid();
		ids[id] = email;

		res.cookie('session_id', id, {
			expires: new Date(Date.now() + 1000 * 60 * 10)
		});
		res.status(201).json({
			id
		});
	});

	app.get('/me', function (req, res) {
		const id = req.cookies['session_id'];
		const email = ids[id];
		if (!email || !users[email]) {
			return res.status(401).end();
		}

		users[email].score += 1;

		res.json(users[email]);
	});

	app.get('/users', function (req, res) {
		const scorelist = Object.values(users)
			.sort((l, r) => r.score - l.score)
			.map(user => {
				return {
					email: user.email,
					age: user.age,
					score: user.score
				};
			});

		res.json(scorelist);
	});
};

module.exports = initMocks;
