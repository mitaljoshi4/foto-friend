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
            `<img src="./img/user.png" class="user-image rounded-circle">` +
            `</div>` +
            `<div class="col col-5 m-auto">` +
            `<h5>` +
            userData +
            `</h5>` +
            `</div>` +
            `<div class="col col-2 m-auto">` +
            `<img src="./img/accept.png" class="small-icon rounded-circle">` +
            `</div>` +
            `<div class="col col-2 m-auto">` +
            `<img src="./img/reject.png" class="small-icon rounded-circle">` +
            `</div>` +
            `</div>` +
            `</li>`;
        return template;
    },
    updateList: (eventType, data, refVal) => {
        switch (refVal) {
            case '/images':
                {
                    //TODO : Update Image
                    console.log('Image Update : ', eventType, data);
                    break;
                }
            case '/users':
                {
                    //TODO : Update active user list
                    console.log('Users Update : ', eventType, data);
                    break;
                }
            case '/requests':
                {
                    // TODO: Update requests list
                    console.log('Requests Update : ', eventType, data);
                    break;
                }
            default:
                {
                    break;
                }
        }

    },
    getActiveUsers: (callback) => {
        try {
            // let packageId = utils.appSettings.appId.replace(new RegExp('[' + '.' + ']', 'g'), '-');
            let refURL = '/users/';
            firebaseConnection.getDatabaseOf(refURL, (s) => {
                if (s.exists() == true) {
                    let userData = s.val();
                    let activeList = [];
                    s.forEach(function (n) {
                        let status = n.val().status;
                        if (status == "online") {
                            activeList.push(n.key);
                        }
                    });
                    callback(activeList);
                } else {
                    callback([]);
                }
            }, (err) => {
                callback([]);
            })
        } catch (e) {
            callback([]);
        }
    },
    getRequestList: (callback) => {
        try {
            let refURL = '/requests/';
            firebaseConnection.getDatabaseOf(refURL, (s) => {
                if (s.exists() == true) {
                    let requests = s.val();
                    callback(requests);
                } else {
                    callback([]);
                }
            }, (err) => {
                callback([]);
            })
        } catch (e) {
            callback([]);
        }
    },
    getImageList: (callback) => {
        try {
            let refURL = '/images/';
            firebaseConnection.getDatabaseOf(refURL, (s) => {
                if (s.exists() == true) {
                    let images = s.val();
                    callback(images);
                } else {
                    callback([]);
                }
            }, (err) => {
                callback([]);
            })
        } catch (e) {
            callback([]);
        }
    }
}

export { utils }