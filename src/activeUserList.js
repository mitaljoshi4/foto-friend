import { utils } from "./util";
var activeUsers = {
    pageBeforeShow: () => {
        //TODO: get active tab and show according list
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            console.log('Current TAb : ', e.target) // newly activated tab
            console.log('Previous TAb : ', e.relatedTarget) // previous active tab
            var cTab = e.target.id;
            if (cTab == 'requests-tab') {
                utils.getActiveUsers((userList) => {
                    if (userList.length != 0) {
                        let listData = utils.getActiveUserList(userList);
                        $("#requestsListContainer").html(listData);
                        // $("#activeUserListContainer").listview('refresh');
                    } else {
                        $("#requestsListContainer").html("<h4>No active user found.</h4>");
                        // $("#activeUserListContainer").listview('refresh');
                    }
                });
            } else if (cTab == 'active-users-tab') {

            } else {

            }
        })


    }
}
export { activeUsers };