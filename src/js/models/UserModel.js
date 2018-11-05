import { fetchModule } from '../modules/ajax.js';
import Bus from '../modules/Bus.js';


// TODO вместо is_authenticated сделать функцию вовзращающую Promise

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

    static Signin(data) {
        return fetchModule.doPost({path: '/auth/login', body: data})
            .then( response => {
                if (response.status === 400) {
                    return Promise.reject(response.status);
                }
                if (resp.status === 200) {
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
        return fetchModule.doPut({path: '/profiles/current', body: data})
            .then( response => {
                Bus.emit("wipe-views");
            })
            .catch( (err) => {
                console.log(err);
            })
    }
}