import { fetchModule } from '../modules/ajax.js';
import { setCookie, getCookie, deleteCookie } from '../utils.js';
import Bus from '../modules/Bus.js';


export default class GameModel {
    static CreateRoom (data) {
        console.log('coool data',data);
        // data.max_num_players = +data.max_num_players;
        // data.time_limit = +data.time;
        // data.field_size = {
        //     width:20,
        //     height:20
        // };
        // data.allow_anonymous = true; // костыль - добавить чекбокс в форму
        const authToken = 'qwerqwer';
		const gameHeaders = {
			'Authorization': 'Bearer ' + authToken
        };
        return;
        return fetchModule.doPost({ path: '/multiplayer/rooms', body: data, headers: gameHeaders })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    return response.json();
                }
                return Promise.reject(new Error('unsuccess room create'));
            })

            .then( (data) => {
                console.log(data);
                Bus.emit('done-create-room', data)
            })
            .catch( (err) => {
                console.log('игра не получилась(',err)
            })
    }   
}