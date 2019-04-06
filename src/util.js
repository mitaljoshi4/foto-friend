import { firebaseConnection } from './firebaseConnectivity';
let utils = {
    isFirebase: false,
    appSettings: {
        appId: `com.foto.friend`
    },
    firebaseAppSetting: {
        apiKey: `AIzaSyAUdJhlxb8gf4dDd8JArrCJU-PJ2ahhiUw`,
        authDomain: `foto-friend` + `.firebaseapp.com`,
        databaseURL: `https://foto-friend.firebaseio.com/`,
        projectId: `foto-friend`
    },
    firebaseApp: {},
    setUserData: (userData, callback) => {
        firebaseConnection.updateUserStatus(userData, callback);
    },
    getActiveUserList: (userList) => {
        let userListTemplate = '';
        $.each(userList, (i, user) => {
            if (user != localStorage.userName) {
                userListTemplate += utils.getUserListTemplate(i, user);
            }
        });
        return userListTemplate;
    },
    getUserListTemplate: (i, userData) => {
        let template = `<li class="media border-bottom border-success">` +
            `<div class="row full-width">` +
            `<div class="col col-3 m-auto">` +
            `<img src="../img/user.png" class="user-image rounded-circle">` +
            `</div>` +
            `<div class="col col-5 m-auto">` +
            `<h5>` +
            userData +
            `</h5>` +
            `</div>` +
            `<div class="col col-2 m-auto">` +
            `<img src="../img/accept.png" class="small-icon rounded-circle">` +
            `</div>` +
            `<div class="col col-2 m-auto">` +
            `<img src="../img/reject.png" class="small-icon rounded-circle">` +
            `</div>` +
            `</div>` +
            `</li>`;
        return template;
    }
}

export { utils }