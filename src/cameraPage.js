import { utils } from "./util";
var camera = {
    pageCreate: () => {
        $(document).on('click', "#captureButton", () => {
            try {
                utils.captureImage();
            } catch (e) {
                console.log("Error in capture Image");
                utils.stopCamera();
            }
        });
    }
}
export { camera }