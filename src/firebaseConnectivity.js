import { utils } from './util';
//TODO:https://firebase.google.com/docs/database/web/lists-of-data
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
            callback(true);
            console.log("Firebase configured : App Name : ", utils.firebaseApp.name);
        } else {
            console.log("Failed to load firebase script : ");
            utils.isFirebase = false;
            callback(false);
        }
    },
    updateUserStatus: (data, callback) => {
        try {
            let getDB = () => {
                let firebaseDatabase = utils.firebaseApp.database();
                firebaseDatabase.ref('/users/' + (data.userName ? data.userName : localStorage.userName)).set({ status: data.status, connectedWith: data.connectedWith });
                firebaseConnection.getUserStatus(data, (userStatus) => {
                    if (userStatus) {
                        utils.userStatus = userStatus;
                    } else {
                        utils.userStatus = false;
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
                let refURL = '/users/' + userData.userName;
                firebaseConnection.getDatabaseOf(refURL, (s) => {
                    if (s.exists() == true) {
                        data = s.val();
                        callback(data.status);
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
    bindChildEvents: () => {
        var commentsRef = firebase.database();
        commentsRef.on('child_added', function (data) {
            console.log(postElement, data.key, data.val().text, data.val().author);
        });

        commentsRef.on('child_changed', function (data) {
            console.log(postElement, data.key, data.val().text, data.val().author);
        });

        commentsRef.on('child_removed', function (data) {
            console.log(postElement, data.key);
        });
    },
    getDatabaseOf: (url, scallback, ecallback) => {
        try {
            let firebaseDatabase = utils.firebaseApp.database();
            firebaseDatabase.ref(url).once("value", (s) => {
                console.log("getActiveUsers : ", s);
                scallback(s);
            });
        } catch (e) {
            ecallback(e);
        }
    },
    getRequestList: () => {

    },
    getImageList: () => {

    }
}
export { firebaseConnection };
