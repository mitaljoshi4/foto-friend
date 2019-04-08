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
            firebaseConnection.bindDatabaseEvents();
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
    bindDatabaseEvents: () => {
        firebaseConnection.bindUsersEvents();
        firebaseConnection.bindImagesEvents();
        firebaseConnection.bindRequestsEvents();
    },
    bindImagesEvents: () => {
        let refValue = '/images';
        var commentsRef = firebase.database().ref(refValue);
        firebaseConnection.bindChildEvents(commentsRef, refValue);
    },
    bindUsersEvents: () => {
        let refValue = '/users';
        var commentsRef = firebase.database().ref(refValue);
        firebaseConnection.bindChildEvents(commentsRef, refValue);
    },
    bindRequestsEvents: () => {
        let refValue = '/requests';
        var commentsRef = firebase.database().ref(refValue);
        firebaseConnection.bindChildEvents(commentsRef, refValue);
    },
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
            firebaseDatabase.ref(url).once("value", (s) => {
                console.log("getActiveUsers : ", s);
                scallback(s);
            });
        } catch (e) {
            ecallback(e);
        }
    }
}
export { firebaseConnection };
