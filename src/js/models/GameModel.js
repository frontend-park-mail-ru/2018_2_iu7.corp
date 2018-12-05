import { fetchModule } from '../modules/ajax.js';
import { setCookie, getCookie, deleteCookie } from '../utils.js';
import Bus from '../modules/Bus.js';


export default class GameModel {
    static CreateRoom (data) {
        console.log('game model');
        data.allow_anonymous = true; // костыль - добавить чекбокс в форму
        const authToken = 'qwerqwer';
		const gameHeaders = {
			'Authorization': 'Bearer ' + authToken
        };
        return fetchModule.doPost({ path: '/multiplayer/rooms', body: data, headers: gameHeaders })
            .then(response => {
                console.log(response);
                if (response.status === 200) {
                    return response.json();
                }
                return Promise.reject(new Error('unsuccess room create'));
            })

            .then( (data) => {
                console.log('game data',data);
                Bus.emit('done-create-room', data)
            })
            .catch( (err) => {
                console.log('игра не получилась(',err)
            })
    }   
}