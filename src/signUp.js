import { utils } from './util';
import { firebaseConnection } from './firebaseConnectivity';
let signup = {
    signupPageCreate: () => {
        console.log('Signup page created.');
        firebaseConnection.init((data) => {
            console.log("connection : ", data);
            localStorage.isReceiver = false;
            if (localStorage.userName) {
                $.mobile.changePage("#activeUserListPage");
            }
        });
        $(`#signUpButton`).click(() => {
            let username = $(`#userNameInput`).val();
            let userObj = {
                userName: username,
                status: 'online',
                connectedWith: ""
            }
            firebaseConnection.getUserStatus(userObj, (sts) => {
                console.log('User Status : ', sts);
                if (sts === null) {
                    firebaseConnection.createNewUser(userObj, (status) => {
                        if (status == "online") {
                            //User is added, Open Online User list to request
                            localStorage.userName = username;
                            firebaseConnection.bindUserDatabaseEvents(localStorage.userName);
                            $.mobile.changePage('#activeUserListPage');
                        } else {
                            //GO to SignUp
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