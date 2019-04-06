import { utils } from './util';
import { firebaseConnection } from './firebaseConnectivity';
let signup = {
    signupPageCreate: () => {
        console.log('Signup page created.');
        firebaseConnection.init((data) => {
            console.log("connection : ", data);
            if (localStorage.userName) {
                $.mobile.changePage("#activeUserListPage");
            }
        });
        $(`#signUpButton`).click(() => {
            let username = $(`#userNameInput`).val();
            let userObj = {
                userName: username,
                status: 'online',
                connectedWith: ''
            }
            firebaseConnection.getUserStatus(userObj, (status) => {
                console.log('User Status : ', status);
                if (status == null) {
                    firebaseConnection.updateUserStatus(userObj, (status) => {
                        if (status == "online") {
                            localStorage.userName = username;
                            $.mobile.changePage('#activeUserListPage');
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