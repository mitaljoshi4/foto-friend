import { signup } from "./signUp";
import { activeUsers } from "./activeUserList";
import { camera } from "./cameraPage";
//https://medium.freecodecamp.org/es5-to-esnext-heres-every-feature-added-to-javascript-since-2015-d0c255e13c6e
$(document).on(`pagecreate`, `#signUpPage`, signup.signupPageCreate);
$(document).on(`pagebeforeshow`, `#activeUserListPage`, activeUsers.pageBeforeShow);
$(document).on(`pageshow`, `#activeUserListPage`, activeUsers.pageShow);
$(document).on(`pagecreate`, `#captureImagePage`, camera.pageCreate);



