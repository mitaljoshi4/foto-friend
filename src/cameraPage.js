import { utils } from "./util";
var camera = {
    pageCreate: () => {
        $(document).on('click', "#captureButton", () => {
            try {
                $.mobile.loading('show');
                let updatedData = {
                    "sender": localStorage.connectedWith,
                    "status": "capturing"
                }
                utils.updateRequestStatus(updatedData);
                setTimeout(() => {
                    utils.captureImage();
                }, 3000);
            } catch (e) {
                console.log("Error in capture Image");
                utils.stopCamera();
            }
        });
    }
}
export { camera }