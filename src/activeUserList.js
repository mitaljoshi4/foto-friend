import { utils } from "./util";
var activeUsers = {
    pageBeforeShow: () => {
        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            console.log('Current TAb : ', e.target) // newly activated tab
            console.log('Previous TAb : ', e.relatedTarget) // previous active tab
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