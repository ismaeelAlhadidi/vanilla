//import VanillaCropper from "./VanillaCropper/main";
const file = document.getElementById('inpuFile');
var vanillaCropper = null;
file.onchange = function () {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file.files[0])
    fileReader.onload = function () {
        let image = new Image();
        image.onload = function () {
            let saveHandler = function (tempImage) {
                window.document.body.appendChild(tempImage);
            };
            let exitHandler = function() {
                console.log("exit from cropper callback");
            };
            let errorCallBack = function () {
                console.log("error call back");
            };
            if(vanillaCropper == null) {
                import("./VanillaCropper/main").then( (module) => {
                    vanillaCropper = new module.default();
                    vanillaCropper.start(image, 100, 70, saveHandler, exitHandler, errorCallBack);
                });
                return;
            }
            vanillaCropper.start(image, 100, 70, saveHandler, exitHandler, errorCallBack);
        }
        image.src = fileReader.result;
    };
}
/*
let image = new Image();
var vanillaCropper = new VanillaCropper();
            vanillaCropper.start(image, 100, 70, function () {
                console.log("image saved");
            }, function() {
                console.log("exit from cropper");
            });
image.src = "./images/118.jpg";
*/

