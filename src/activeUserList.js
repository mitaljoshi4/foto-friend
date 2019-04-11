import { utils } from "./util";
var activeUsers = {
    pageBeforeShow: () => {
        localStorage.isReceiver = false;
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var cTab = e.target.id;
            if (cTab == 'requests-tab') {
                utils.setRequestsList();
            } else if (cTab == 'active-users-tab') {
                utils.setActiveUserList();
            } else {
                utils.setImagesList();
            }
        });
    },
    pageShow: () => {
        $('#myTab li:first-child a').tab('show');
        utils.setActiveUserList();
    }
}
export { activeUsers };