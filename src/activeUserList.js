import { utils } from "./util";
import { firebaseConnection } from "./firebaseConnectivity";
var activeUsers = {
    pageBeforeShow: () => {
        firebaseConnection.getActiveUsers((userList) => {
            if (userList.length != 0) {
                let listData = utils.getActiveUserList(userList);
                $("#activeUserListContainer").html(listData);
                // $("#activeUserListContainer").listview('refresh');
            } else {
                $("#activeUserListContainer").html("<h4>No active user found.</h4>");
                // $("#activeUserListContainer").listview('refresh');
            }
        });

    }
}
export { activeUsers };