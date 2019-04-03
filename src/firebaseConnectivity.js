import { utils } from './util';
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
                let packageId = utils.appSettings.appId.replace(new RegExp('[' + '.' + ']', 'g'), '-');
                console.log('isUserExist : ', firebaseDatabase.ref('/' + packageId + '/' + (data.userName ? data.userName : localStorage.userName)));
                firebaseDatabase.ref('/' + packageId + '/' + (data.userName ? data.userName : localStorage.userName)).set({ status: data.status });
                firebaseConnection.getUserStatus((userStatus) => {
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
            console.log("Error in firebase database updation : " + e);
        }
    },
    getUserStatus: (mainCallback) => {
        try {
            let getStatus = (callback) => {
                let data;
                let packageId = utils.appSettings.appId.replace(new RegExp('[' + '.' + ']', 'g'), '-');
                let refURL = '/' + packageId + '/';
                let firebaseDatabase = utils.firebaseApp.database();
                firebaseDatabase.ref(refURL + localStorage.userName).once("value", (s) => {
                    data = s.val();
                    callback(data.status);
                });
            }
            if (utils.firebaseApp) {
                getStatus((points) => {
                    mainCallback(points);
                });
            } else {
                firebaseConnection.init((isDone) => {
                    if (isDone) {
                        getStatus((points) => {
                            mainCallback(points);
                        });
                    } else {
                        mainCallback(points);
                    }
                });
            }
        } catch (e) {
            console.log("Error in firebase database read : " + e);
            if (listItemData) {
                mainCallback(0);
            } else {
                mainCallback(null);
            }
        }
    }
}
export { firebaseConnection };
