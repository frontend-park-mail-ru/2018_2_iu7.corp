'use strict'

const users = {
    'n@mail.ru': {
        email: 'n@mail.ru',
        password: '1',
        score: '10'
    },
    'm@mail.ru': {
        email: 'm@mail.ru',
        password: '1',
        score: '10'
    },
    'd@mail.ru': {
        email: 'd@mail.ru',
        password: '1',
        score: '10'
    }
};
const ids = {};

const initMocks = (app) => {
    app.post('/signup', function (req, res) {
        const password = req.body.password;
        const email = req.body.email;
        if (
            !password || !email || 
            !password.match(/^\S{4,}$/) ||
            !email.match(/@/)
        ) {
            return res.status(400).json({error: 'Не валидные данные пользователя'});
        }
        if (users[email]) {
            return res.status(400).json({error: 'Пользователь уже существует'});
        }

        const id = uuid();
        const user = {password, email, score: 0};
        ids[id] = email;
        users[email] = user;

        res.cookie('sessionid', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
        res.status(201).json({id});
    });

    app.post('/login', function (req, res) {
        const password = req.body.password;
        const email = req.body.email;
        if (!password || !email) {
            return res.status(400).json({error: 'Не указан логин или пароль'});
        }
        if (!users[email] || users[email].password !== password) {
            return res.status(400).json({error: 'Не верный логин и/или пароль'});
        }

        const id = uuid();
        ids[id] = email;

        res.cookie('sessionid', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
        res.status(201).json({id});
    });

    app.post('/change', function (req, res) {

        const new_email = req.body.email;
        const new_password = req.body.password;

        const id = req.cookies['sessionid'];
        const email = ids[id];
        users[email].email = new_email;
        users[email].password = new_password;
        res.json(users[new_email]);
    });

    app.get('/me', function (req, res) {
        const id = req.cookies['sessionid'];
        const email = ids[id];
        if (!email || !users[email]) {
            return res.status(401).end();
        }

        users[email].score += 1;

        res.json(users[email]);
    });

    app.get('/users', function (req, res) {
        console.log('HIIIIIIIIIIIIIIIIIIIIII');
        const scorelist = Object.values(users)
            .sort((l, r) => r.score - l.score)
            .map(user => {
                return {
                    email: user.email,
                    score: user.score,
                }
            });

        res.json(scorelist);
    });
}
module.exports = initMocks;