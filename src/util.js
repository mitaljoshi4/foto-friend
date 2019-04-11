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
                utils.bindSendRequestClickEvent();
                // $("#activeUserListContainer").listview('refresh');
            } else {
                $("#activeUserListContainer").html("<h4 class='text-center'>No active user found.</h4>");
                // $("#activeUserListContainer").listview('refresh');
            }
            $.mobile.loading('hide');
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
                utils.updateToDatabase('/' + localStorage.userName, { connectedWith: reqdata.sender });
                utils.updateToDatabase('/' + reqdata.sender, { connectedWith: localStorage.userName });
                localStorage.isReceiver = true;
                let updateData = {
                    "status": "accepted",
                    "sender": reqdata.sender
                }
                utils.updateRequestStatus(updateData);
                utils.startCamera();
            });
        });
    },
    bindSendRequestClickEvent: () => {
        let acceptBtnList = $("#activeUserListContainer").find('.sendRequest');
        $.each(acceptBtnList, (i, val) => {
            $(val).click(function () {
                let receiverUser = val.dataset.detail;
                console.log("Request send to : ", receiverUser);
                //set sent request data to logged in user
                let sentObj = {
                    acceptTime: 0,
                    receiver: receiverUser,
                    sentTime: 0,
                    status: "pending"
                }
                let refURL = '/' + localStorage.userName + '/request/sent/' + receiverUser;
                utils.setToDatabase(refURL, sentObj);

                //set received request data to receiver user 
                let receivedObj = {
                    acceptTime: 0,
                    sender: localStorage.userName,
                    sentTime: 0,
                    status: "pending"
                }
                let receiveURL = '/' + receiverUser + '/request/received/' + localStorage.userName;
                utils.setToDatabase(receiveURL, receivedObj);
                //TODO: Also push to receiver's request/receive object array
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
            `<div class="col col-3 m-auto sendRequest" data-detail=` + userData + `>` +
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
                    //Update Images
                    if (data.val() != '') {
                        localStorage.myImage = data.val();
                        if (localStorage.otherImage) {
                            utils.setImageToCanvas(localStorage.myImage, localStorage.otherImage);
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
                    //Update active user list
                    let path = data.ref.getParent().path.toString();
                    let isMyData = path.includes('/' + localStorage.userName + '/');
                    if (isMyData) {
                        localStorage.connectedWith = data.val();
                        firebaseConnection.bindUserDatabaseEvents(data.val());
                    }
                    console.log('Users Update : ', eventType, data);
                    break;
                }
            case 'sent':
                {
                    // Update requests list
                    console.log('Sent Event : ', eventType);
                    console.log('Sent Data : ', data);
                    if (eventType == 'child_changed') {
                        if (data.val().status == 'accepted') {
                            if (localStorage.isReceiver == "false" && data.val().receiver == localStorage.connectedWith) {
                                utils.startCamera();
                            } else {
                            }
                        } else if (data.val().status == 'capturing') {
                            setTimeout(() => {
                                utils.captureImage();
                            }, 2000)
                        }
                    }
                    break;
                }
            case 'received':
                {
                    // Update requests list
                    console.log('Received Event : ', eventType);
                    console.log('Received Data : ', data);
                    if (eventType == 'child_changed') {
                        if (data.val().status == 'accepted') {
                            if (localStorage.isReceiver == "true" && data.val().sender == localStorage.connectedWith) {
                                //Update status and start camera
                                utils.startCamera();
                            } else {
                            }
                        } else if (data.val().status == 'capturing') {
                            setTimeout(() => {
                                utils.captureImage();
                            }, 2000)
                        }
                    }
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
                    let reqList = [];
                    s.forEach(function (n) {
                        let status = n.val().status;
                        if (status == "pending") {
                            reqList.push(n.val());
                        }
                    })
                    callback(reqList);
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
            localStorage.removeItem('myImage');
            localStorage.removeItem('otherImage');
            $("#captureButton").show();
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
                //send image to database

                // $("#capturedImage").prop('src', 'data:image/png;base64,' + base64PictureData[0]);
                utils.stopCamera();
            });
        } catch (e) {
            console.log("Error in capture image.....");
        }
    },
    stopCamera: () => {
        try {
            $("#captureButton").hide();
            CameraPreview.stopCamera();
        } catch (e) {
            console.log("Error in capture image.....");
        }
    },
    setImageToCanvas: (img1, img2) => {
        var tempImg;
        if (localStorage.isReceiver == "true") {
            tempImg = img1;
            img1 = img2;
            img2 = tempImg;
        }
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        // Store the current transformation matrix
        ctx.save();

        // Use the identity matrix while clearing the canvas
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Restore the transform
        ctx.restore();
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
    updateRequestStatus: (updatedData) => {
        if (localStorage.isReceiver != "false") {
            let refUrl = localStorage.userName + '/request/received/' + localStorage.connectedWith;
            utils.updateToDatabase(refUrl, updatedData);
            var upData = {
                "receiver": localStorage.userName,
                "status": updatedData.status
            };
            var sentUrl = localStorage.connectedWith + '/request/sent/' + localStorage.userName;
            utils.updateToDatabase(sentUrl, upData);
            firebaseConnection.bindImagesEvents(localStorage.connectedWith);
        } else {
            var upData = {
                "receiver": localStorage.connectedWith,
                "status": updatedData.status
            };
            let refUrl = localStorage.userName + '/request/sent/' + localStorage.connectedWith;
            utils.updateToDatabase(refUrl, upData);
            var sentUrl = localStorage.connectedWith + '/request/received/' + localStorage.userName;
            utils.updateToDatabase(sentUrl, updatedData);
            firebaseConnection.bindImagesEvents(localStorage.connectedWith);
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