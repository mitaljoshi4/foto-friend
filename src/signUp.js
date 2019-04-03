import { utils } from './util';
import { firebaseConnection } from './firebaseConnectivity';
let signup = {
    signupPageCreate: () => {
        console.log('Signup page created.');
        firebaseConnection.init((data) => {
            console.log("connection : ", data);
        });
        $(`#signUpButton`).click(() => {
            let username = $(`#userNameInput`).val();
            let userObj = {
                userName: username,
                status: true
            }
            firebaseConnection.updateUserStatus(userObj, (status) => {
                console.log('User Status : ', status);
            })
        });
    }

}
export { signup }