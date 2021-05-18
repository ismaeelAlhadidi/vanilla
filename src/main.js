//import VanillaCropper from "./VanillaCropper/main";
// import VanillaPopup from "./VanillaPopup/main";
import VanillaPopup from "./VanillaPopup/main";
import VanillaNotifications from "./VanillaNotifications/main";
const file = document.getElementById('inpuFile');
var vanillaCropper = null;
file.onchange = function () {
    let fileReader = new FileReader();
    if(! file.files[0]) return;
    fileReader.readAsDataURL(file.files[0]);
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
//let vanillaPopup = new VanillaPopup();
//vanillaPopup.alert("this is title", "this is message", "button text").then().catch();

var vanillaPopup = new VanillaPopup();

var vanillaNotifications = new VanillaNotifications();

vanillaNotifications.open();

// vanillaNotifications.addPlaceHolders();

//vanillaNotifications.removePlaceHolders();

for(let i = 0; i < 20; i++) {
    vanillaNotifications.push(
        i,
        "mohammad ahmmad al-hadidi commented today on your new last bad post you publish it before three years",
        "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
        "34 minutes ago",
        !(i%3 ==  0),
        () => console.log("hi from notification " + i)
    );
}
//vanillaNotifications.removePlaceHolders();

/*

*/

/*
vanillaPopup.alert("", "please crop the image", "ok").then(()=>{
    console.log("hi from html");
});
var i = 0;
window.onclick = function () {
    console.log("window clicked");
    vanillaPopup.confirm("confirm title" + i, "confirm message", "YES", "NO").then( ( result ) => {
        console.log(result);
        i++;
    });
};
*/