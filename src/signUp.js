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
            firebaseConnection.getUserStatus(userObj, (status) => {
                console.log('User Status : ', status);
                if (status == null) {
                    firebaseConnection.updateUserStatus(userObj, (status) => {
                        if (status == true) {
                            localStorage.userName = username;
                            $.mobile.change
                            //TODO : User is added, Open Online User list to request
                        } else {
                            //TODO: GO to SignUp
                            localStorage.removeItem('userName');
                            alert('Connection Lost, Try again Later..');
                            // $("#signUpButton").val('');
                        }
                    })
                } else {
                    localStorage.removeItem('userName');
                    alert('Username already exists !!');
                }
            })
        });
    }

}
export { signup }