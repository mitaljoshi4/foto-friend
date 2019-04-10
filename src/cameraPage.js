import { utils } from "./util";
var camera = {
    pageCreate: () => {
        $(document).on('click', "#captureButton", () => {
            try {
                $.mobile.loading('show');
                utils.updateRequestStatus('capturing');
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