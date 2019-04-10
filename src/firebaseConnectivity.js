import { utils } from './util';
//eventRef:https://firebase.google.com/docs/database/web/lists-of-data
let firebaseConnection = {
    init: (callback) => {
        if (firebase) {
            let config = {
                apiKey: utils.firebaseAppSetting.apiKey,
                authDomain: utils.firebaseAppSetting.authDomain,
                databaseURL: utils.firebaseAppSetting.databaseURL,
                projectId: utils.firebaseAppSetting.projectId
            };
            if (!firebase.apps.length) {
                utils.firebaseApp = firebase.initializeApp(config);
                utils.isFirebase = true;
            }
            if (localStorage.userName) {
                firebaseConnection.bindUserDatabaseEvents(localStorage.userName);
            } else {
                localStorage.clear();
                $.mobile.changePage('#signUpPage');
            }
            callback(true);
        } else {
            console.log("Failed to load firebase script : ");
            utils.isFirebase = false;
            callback(false);
        }
    },
    createNewUser: (data, callback) => {
        try {
            let getDB = () => {
                let defaultData = {
                    "userStatus": data.status,
                    "connectedWith": data.connectedWith,
                    "image": ""
                }
                utils.setToDatabase('/' + data.userName, defaultData)
                utils.userStatus = data.status;
                callback(utils.userStatus);
            }
            if (utils.firebaseApp) {
                getDB();
            } else {
                firebaseConnection.init((isDone) => {
                    if (isDone) getDB();
                });
            }
        } catch (e) {
            console.log("Error in update of firebase database : " + e);
        }
    },
    updateUserStatus: (data, callback) => {
        try {
            let getDB = () => {
                let firebaseDatabase = utils.firebaseApp.database();
                let defaultData = {
                    "userStatus": data.status,
                    "connectedWith": data.connectedWith,
                    "image": {},
                    "request": {
                        "sent": {},
                        "received": {}
                    }
                }
                firebaseDatabase.ref().set(defaultData);
                firebaseConnection.getUserStatus(data, (userStatus) => {
                    if (userStatus) {
                        utils.userStatus = userStatus;
                    } else {
                        utils.userStatus = 'offline';
                    }
                    console.log("Current User Status : ", utils.userStatus);
                    callback(utils.userStatus);
                });
            }
            if (utils.firebaseApp) {
                getDB();
            } else {
                firebaseConnection.init((isDone) => {
                    if (isDone) getDB();
                });
            }
        } catch (e) {
            console.log("Error in update of firebase database : " + e);
        }
    },
    getUserStatus: (userData, mainCallback) => {
        try {
            let getStatus = (callback) => {
                let data;
                let refURL = userData.userName;
                firebaseConnection.getDatabaseOf(refURL, (s) => {
                    if (s.exists() == true) {
                        data = s.val();
                        callback(data.userStatus);
                    } else {
                        callback(null);
                    }
                });
            }
            if (utils.firebaseApp) {
                getStatus(mainCallback);
            } else {
                firebaseConnection.init((isDone) => {
                    if (isDone) {
                        getStatus(mainCallback);
                    } else {
                        mainCallback(null);
                    }
                });
            }
        } catch (e) {
            console.log("Error in firebase database read : " + e);
            mainCallback(null);
        }
    },
    bindUserDatabaseEvents: (user) => {
        firebaseConnection.bindUsersEvents(user);
        firebaseConnection.bindImagesEvents(user);
        firebaseConnection.bindSentRequestsEvents(user);

        // firebaseConnection.bindReceivedRequestsEvents(user);
    },
    bindImagesEvents: (user) => {
        let refValue = user + '/image/';
        var commentsRef = firebase.database().ref(refValue);
        firebaseConnection.bindChildEvents(commentsRef, 'image');
    },
    bindUsersEvents: (user) => {
        let refValue = user + '/connectedWith/';
        var commentsRef = firebase.database().ref(refValue);
        firebaseConnection.bindChildEvents(commentsRef, 'connectUser');
    },
    bindSentRequestsEvents: (user) => {
        let refValue = user + '/request/';
        var commentsRef = firebase.database().ref(refValue);
        firebaseConnection.bindChildEvents(commentsRef, 'sent');
    },
    // bindReceivedRequestsEvents: () => {
    //     let refValue = localStorage.userName + '/request/received/';
    //     var commentsRef = firebase.database().ref(refValue);
    //     firebaseConnection.bindChildEvents(commentsRef, 'received');
    // },
    bindChildEvents: (commentsRef, refValue) => {
        commentsRef.on('child_added', function (data) {
            console.log('child_added of : ', data.key);
            utils.updateList('child_added', data, refValue);
        });

        commentsRef.on('child_changed', function (data) {
            console.log('child_changed of : ', data.key);
            utils.updateList('child_changed', data, refValue);
        });

        commentsRef.on('child_removed', function (data) {
            console.log('child_removed of : ', data.key);
            utils.updateList('child_removed', data, refValue);
        });
    },
    getDatabaseOf: (url, scallback, ecallback) => {
        try {
            let firebaseDatabase = utils.firebaseApp.database();
            firebaseDatabase.ref(url + '/').once("value", (s) => {
                console.log("getActiveUsers : ", s);
                scallback(s);
            });
        } catch (e) {
            ecallback(e);
        }
    }
}
export { firebaseConnection };
