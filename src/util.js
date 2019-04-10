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
                    utils.bindAcceptClickEvent();
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
            if (request.status == 'pending') {
                reqListTemplate += utils.getRequestListTemplate(i, request);
            }
        });
        return reqListTemplate;
    },
    bindAcceptClickEvent: () => {
        let acceptBtnList = $("#requestsListContainer").find('.acceptImage');
        $.each(acceptBtnList, (i, val) => {
            $(val).click(function () {
                let reqdata = JSON.parse(val.dataset.detail);
                localStorage.connectedWith = reqdata.sender;
                localStorage.isReceiver = true;
                utils.updateRequestStatus('accepted');
                utils.startCamera();
                console.log("request-Data : ", reqdata);
            });
        });
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
            `<div class="col col-2 m-auto acceptImage" data-detail=` + JSON.stringify(reqData) + `>` +
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
    updateListImage: (eventType, data, refVal) => {

    },
    updateList: (eventType, data, refVal) => {
        switch (refVal) {
            case 'image':
                {
                    // console.log('image from : ', data.ref.getParent().path.toString());
                    //TODO : Update Images
                    if (data.val() != '') {
                        let path = data.ref.getParent().path.toString();
                        let isMyImage = path.includes('/' + localStorage.userName + '/');
                        if (isMyImage) {
                            localStorage.myImage = data.val();
                            if (localStorage.otherImage) {
                                utils.setImageToCanvas(localStorage.myImage, localStorage.otherImage);
                            }
                        } else {
                            localStorage.otherImage = data.val();
                            if (localStorage.myImage) {
                                utils.setImageToCanvas(localStorage.myImage, localStorage.otherImage);
                            }
                        }
                        // console.log('Image Update : ', eventType, data);
                        // localStorage.myImage = data.val();
                        // firebaseConnection.getDatabaseOf(localStorage.connectedWith + '/image/', (resdata) => {
                        //     utils.setImageToCanvas(data.val(), resdata.val().image);
                        // });
                    }
                    break;
                }
            case 'connectUser':
                {
                    //TODO : Update active user list

                    console.log('Users Update : ', eventType, data);
                    firebaseConnection.bindUserDatabaseEvents(data.val());
                    break;
                }
            case 'sent':
                {
                    // TODO: Update requests list
                    if (data.val().status == 'accepted') {
                        if (localStorage.isReceiver == "true" && data.val().sender == localStorage.connectedWith) {
                            //TODO: Update status and start camera
                            utils.startCamera();
                        } else if (localStorage.isReceiver == "false" && data.val().receiver == localStorage.connectedWith) {
                            utils.startCamera();
                        } else {
                        }
                    } else if (data.val().status == 'capturing') {
                        setTimeout(() => {
                            utils.captureImage();
                        }, 2000)
                    }
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
            let refURL = '';
            firebaseConnection.getDatabaseOf(refURL, (s) => {
                if (s.exists() == true) {
                    let userData = s.val();
                    let activeList = [];
                    s.forEach(function (n) {
                        let status = n.val().userStatus;
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
            let refURL = localStorage.userName + '/request/received';
            firebaseConnection.getDatabaseOf(refURL, (s) => {
                if (s.exists() == true) {
                    let requests = s.val();
                    callback([requests]);
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
            let refURL = localStorage.userName + '/image';
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
    },
    startCamera: () => {
        try {
            $.mobile.changePage('#captureImagePage');
            let options = {
                x: 0,
                y: 0,
                width: window.screen.width,
                height: window.screen.height - 300,
                camera: CameraPreview.CAMERA_DIRECTION.BACK,
                toBack: false,
                tapPhoto: false,
                tapFocus: true,
                previewDrag: false,
                storeToFile: true,
                disableExifHeaderStripping: false
            };
            CameraPreview.startCamera(options);
        } catch (e) {
            console.log("Error in camera plugin.....");
        }
    },
    captureImage: () => {
        try {
            $.mobile.loading('show');
            CameraPreview.takePicture(function (base64PictureData) {
                /* code here */
                let sendRefURL = localStorage.userName + '/image/';
                // recRefURL = localStorage.connectedWith
                utils.updateToDatabase(sendRefURL, { image: 'data:image/png;base64,' + base64PictureData[0] });
                //TODO : send image to database

                // $("#capturedImage").prop('src', 'data:image/png;base64,' + base64PictureData[0]);
                utils.stopCamera();
            });
        } catch (e) {
            console.log("Error in capture image.....");
        }
    },
    stopCamera: () => {
        try {
            localStorage.isReceiver = false;
            CameraPreview.stopCamera();
        } catch (e) {
            console.log("Error in capture image.....");
        }
    },
    setImageToCanvas: (img1, img2) => {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //First canvas data
        var img1 = loadImage(img1, main);
        //Second canvas data
        var img2 = loadImage(img2, main);

        var imagesLoaded = 0;

        function main() {
            imagesLoaded += 1;

            if (imagesLoaded == 2) {
                // composite now
                ctx.drawImage(img1, 0, 0, 100, 100);

                ctx.globalAlpha = 0.5;
                ctx.drawImage(img2, 100, 0, 100, 100);
            }
        }

        function loadImage(src, onload) {
            var img = new Image();

            img.onload = onload;
            img.src = src;
            $.mobile.loading('hide');
            return img;
        }
    },
    updateRequestStatus: (reqStatus) => {

        if (localStorage.isReceiver != "false") {
            let refUrl = localStorage.userName + '/request/received/';
            let updatedData = {
                status: reqStatus
            }
            utils.updateToDatabase(refUrl, updatedData);
            var sentUrl = localStorage.connectedWith + '/request/sent/'
            utils.updateToDatabase(sentUrl, updatedData);
            firebaseConnection.bindUserDatabaseEvents(localStorage.connectedWith);
        } else {
            let refUrl = localStorage.userName + '/request/sent/';
            let updatedData = {
                status: reqStatus
            }
            utils.updateToDatabase(refUrl, updatedData);
            var sentUrl = localStorage.connectedWith + '/request/received/'
            utils.updateToDatabase(sentUrl, updatedData);
            firebaseConnection.bindUserDatabaseEvents(localStorage.connectedWith);
        }


    },
    updateToDatabase: (refUrl, updatedData) => {
        let firebaseDatabase = utils.firebaseApp.database();
        firebaseDatabase.ref(refUrl).update(updatedData);
    },
    setToDatabase: (refUrl, newData) => {
        let firebaseDatabase = utils.firebaseApp.database();
        firebaseDatabase.ref(refUrl).set(newData);
    }
}

export { utils }