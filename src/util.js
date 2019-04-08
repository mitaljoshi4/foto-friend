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
    setActiveUserList: () => {
        utils.getActiveUsers((userList) => {
            if (userList.length != 0) {
                let listData = utils.getActiveUserList(userList);
                $("#activeUserListContainer").html(listData);
                // $("#activeUserListContainer").listview('refresh');
            } else {
                $("#activeUserListContainer").html("<h4 class='text-center'>No active user found.</h4>");
                // $("#activeUserListContainer").listview('refresh');
            }
        });
    },
    setRequestsList: () => {
        utils.getPendingRequests((reqList) => {
            if (reqList.length != 0) {
                let listData = utils.getPendingRequestsList(reqList);
                if (listData != '') {
                    $("#requestsListContainer").html(listData);
                } else {
                    $("#requestsListContainer").html("<h4 class='text-center'>No requests found.</h4>");
                }
                // $("#activeUserListContainer").listview('refresh');
            } else {
                $("#requestsListContainer").html("<h4 class='text-center'>No requests found.</h4>");
                // $("#activeUserListContainer").listview('refresh');
            }
        });
    },
    setImagesList: () => {

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
    getPendingRequestsList: (reqList) => {
        let reqListTemplate = '';
        $.each(reqList, (i, request) => {
            if (request.receiver == localStorage.userName) {
                reqListTemplate += utils.getRequestListTemplate(i, request);
            }
        });
        return reqListTemplate;
    },
    getRequestListTemplate: (i, reqData) => {
        let template = `<li class="media border-bottom border-success">` +
            `<div class="row full-width">` +
            `<div class="col col-3 m-auto">` +
            `<img src="./img/user.png" class="user-image rounded-circle">` +
            `</div>` +
            `<div class="col col-5 m-auto">` +
            `<h5><b>` +
            reqData.sender +
            `</b></h5>` +
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
    getUserListTemplate: (i, userData) => {
        let template = `<li class="media border-bottom border-success">` +
            `<div class="row full-width">` +
            `<div class="col col-3 m-auto">` +
            `<img src="./img/user.png" class="user-image rounded-circle">` +
            `</div>` +
            `<div class="col col-6 m-auto">` +
            `<h5>` +
            userData +
            `</h5>` +
            `</div>` +
            `<div class="col col-3 m-auto">` +
            `<img src="./img/add-user.png" class="small-icon rounded-circle">` +
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
    getPendingRequests: (callback) => {
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
    getImages: (callback) => {
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