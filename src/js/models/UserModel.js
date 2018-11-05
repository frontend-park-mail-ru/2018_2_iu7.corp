import { fetchModule } from '../modules/ajax.js';
import Bus from '../modules/Bus.js';
import Router from '../modules/Router.js';

export default class UserModel {
    static Fetch() {
        if (UserModel._data !== null) { // если пользователь уже был получен
            Bus.emit('done-get-user', UserModel._data);
            return;
        }

        console.log("server fetchiung user", UserModel._data);

        fetchModule.doGet({path: '/profiles/current'})
            .then( response => {
                if (response.status === 200) {
                    return response.json();
                }
                return Promise.reject(new Error('not auth'));
            })
            .then( (user) => {
                console.log('FETCH USER THEN');
                console.log(user);
                UserModel._data = user;
                UserModel._data.is_authenticated = true;
                Bus.emit('done-get-user', UserModel._data);
            })
            .catch( (err) => {
                console.log('FETCH USER CATCH');
                console.log(err);
                UserModel._data = {is_authenticated: false};
                Bus.emit('done-get-user', UserModel._data);
            });
    }

    static Register(data) {
        return fetchModule.doPost({path: '/auth/register', body: data})
            .then( response => {
                if (response.status === 400) {
                    console.log('Register status: ', response.status);
                    return Promise.reject(response.status);
                }
                if (response.status === 201) {
                    console.log('Register done');
                    UserModel._data = null;
                    const username = data.username;
                    const password = data.password;
                    Bus.emit('submit-data-signin', {username, password});
                }
            })
            .catch( (err) => {
                console.log('Register err: ',err);
            });
    }

    static Signin(data) {
        return fetchModule.doPost({path: '/auth/login', body: data})
            .then( response => {
                if (response.status === 400) {
                    return Promise.reject(response.status);
                }
                if (response.status === 200) {
                    UserModel._data = null;
                    Bus.emit("wipe-views");
                }
            })
            .catch( (err) => {
                console.log(err);
            });
    }

    // TODO больше проверок
    static Change(data) {
        fetchModule.doPut({path: '/profiles/current', body: data})
            .then( response => {
                if (response.status === 400) {
                    console.log(response.status);
                }

                if (response.status === 200) {
                    UserModel._data = null;
                    Router.open('/profile');
                }
            })
            .catch( (err) => {
                console.log(err);
            })
    }
}