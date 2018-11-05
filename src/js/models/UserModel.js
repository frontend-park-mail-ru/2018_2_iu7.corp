import { fetchModule } from '../modules/ajax.js';
import Bus from '../modules/Bus.js';


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
    // static Fetch() {

    //     if (UserModel._data !== null) {
    //         Bus.emit("done-get-user", UserModel._data);
    //         return;
    //     }

    //     console.log("server fetchiung user", UserModel._data);

    //     AjaxModule.doGet({path: '/profiles/current'}).
    //         then((resp) => {
    //             if (resp.status === 200) {
    //                 return resp.json();
    //             }

    //             return Promise.reject(new Error("no login"));
    //         }).
    //         then((data) => {
    //             console.log('FETCH USER THEN');
    //             console.log(data);
    //             UserModel._data = data;
    //             UserModel._data.is_authenticated = true;
    //             Bus.emit("done-get-user", UserModel.__data);

    //         }).
    //         catch((err) => {
    //             console.log('FETCH USER CATCH');
    //             // errorHandler(err);
    //             UserModel._data = {is_authenticated: false};

    //             Bus.emit("done-get-user", UserModel.__data);
    //         });
    // }
}