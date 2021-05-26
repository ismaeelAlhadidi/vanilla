//import VanillaCropper from "./VanillaCropper/main";
// import VanillaPopup from "./VanillaPopup/main";
import VanillaPopup from "./VanillaPopup/main";
import VanillaNotifications from "./VanillaNotifications/main";
import VanillaSmallGallery from "./VanillaSmallGallery/main";
import VanillaAddPostTemplate from "./VanillaAddPostTemplate/main";
import VanillaHeader from "./VanillaHeader/main";
import VanillaList from "./VanillaList/main";
import VanillaGalleryTemplate from "./VanillaGalleryTemplate/main";
import VanillaComments from "./VanillaComments/main";
import VanillaLikesList from "./VanillaLikesList/main";
import VanillaOpenPostTemplate from "./VanillaOpenPostTemplate/main";

/*
let vanillaHeader = new VanillaHeader();
vanillaHeader.profilePicture = "https://homepages.cae.wisc.edu/~ece533/images/boat.png";
vanillaHeader.userName = "Eman mohammad";
vanillaHeader.vanillaCategoriesList.list = [
    {text: 'abstract', url: ''}, {text: 'Caricature', url: ''},{text: 'cartoon', url: ''},
    {text: 'decorative', url: ''},{text: 'raster', url: ''},{text: 'Portrait', url: ''},
];
*/

//document.body.appendChild(vanillaHeader);


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

/*var vanillaGalleryTemplate = new VanillaGalleryTemplate([
    "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
    "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png",
    "https://homepages.cae.wisc.edu/~ece533/images/boat.png"
],[
    "https://www.rmp-streaming.com/media/big-buck-bunny-360p.mp4"
]);*/
//vanillaGalleryTemplate.open(-1);

let comments = document.getElementById('temp');
//comments.style = "display: none !important;";
setTimeout(() => {
    comments.push({
        id: 1,
        content: "comment from mohammad al-hadidi pushed in file main.js",
        time: "3 hours ago",
        userId: 3,
        userName: "mohammad al-hadidi",
        userPicture: "https://homepages.cae.wisc.edu/~ece533/images/monarch.png",
        liked: false,
        likesCount: 10,
        replies: [
            {
                id: 2,
                content: "comment from mohammad al-hadidi pushed in file main.js 1",
                time: "3 hours ago",
                userId: 3,
                userName: "mohammad al-hadidi",
                userPicture: "https://homepages.cae.wisc.edu/~ece533/images/monarch.png",
                liked: false,
                likesCount: 10
            },
            {
                id: 3,
                content: "comment from mohammad al-hadidi pushed in file main.js 2",
                time: "3 hours ago",
                userId: 3,
                userName: "mohammad al-hadidi",
                userPicture: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
                liked: true,
                likesCount: 10
            }
        ],
    });
    comments.push({
        id: 2,
        content: "comment from mohammad al-hadidi pushed in file main.js",
        time: "3 hours ago",
        userId: 3,
        userName: "mohammad al-hadidi",
        userPicture: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
        liked: true,
        likesCount: 10,
        replies: [
            {
                id: 4,
                content: "comment from mohammad al-hadidi pushed in file main.js",
                time: "3 hours ago",
                userId: 3,
                userName: "mohammad al-hadidi",
                userPicture: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
                liked: false,
                likesCount: 10
            },
            {
                id: 5,
                content: "comment from mohammad al-hadidi pushed in file main.js",
                time: "3 hours ago",
                userId: 3,
                userName: "mohammad al-hadidi",
                userPicture: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
                liked: false,
                likesCount: 10
            }
        ],
    });
}, 2000);
/*
vanillaPopup.follower(1, 'Post', 'follower list', [
    {
        id: 0,
        userName: 'esmaeel al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 90,
        following: false
    },
    {
        id: 1,
        userName: 'mohammad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 12,
        following: true
    },
    {
        id: 2,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 3,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 4,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 5,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 6,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 7,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 8,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 9,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 10,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 11,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    },
    {
        id: 12,
        userName: 'ahmmad al-hadidi',
        userPicture: 'https://homepages.cae.wisc.edu/~ece533/images/boat.png',
        userId: 1,
        followers: 10,
        following: false
    }
]);


// comments.commentsUrl = "";

/*
comments.push({
    id: 1,
    content: "comment from mohammad al-hadidi pushed in file main.js",
    time: "3 hours ago",
    userId: 3,
    userName: "mohammad al-hadidi",
    userPicture: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
    liked: false,
    likesCount: 10
});
comments.push({
    id: 2,
    content: "comment from mohammad al-hadidi pushed in file main.js",
    time: "3 hours ago",
    userId: 3,
    userName: "mohammad al-hadidi",
    userPicture: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
    liked: false,
    likesCount: 10
});
comments.push({
    id: 3,
    content: "comment from mohammad al-hadidi pushed in file main.js",
    time: "3 hours ago",
    userId: 3,
    userName: "mohammad al-hadidi",
    userPicture: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
    liked: false,
    likesCount: 10
});
comments.push({
    id: 4,
    content: "comment from mohammad al-hadidi pushed in file main.js",
    time: "3 hours ago",
    userId: 3,
    userName: "mohammad al-hadidi",
    userPicture: "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
    liked: false,
    likesCount: 10
});

//let vanillaComments = new VanillaComments();
//document.body.appendChild(vanillaComments);

/*
var vanillaList = new VanillaList(0, "list",[
    {text: '1', url: 'null'},
    {text: '2', url: 'null'},
    {text: '3', url: 'null'},
    {text: '4', url: 'null'},
    {text: '5', url: 'null'}
]);
vanillaList.add(1, 'null');
vanillaList.add(2, 'null');
vanillaList.add(3, 'null');
vanillaList.add(4, 'null');
vanillaList.add(5, 'null');
vanillaList.add(1, 'null');
vanillaList.add(2, 'null');
vanillaList.add(3, 'null');
vanillaList.add(4, 'null');
vanillaList.add(5, 'null');
*/

/*var vanillaSmallGallery = new VanillaSmallGallery(340, 440, [
    "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
    "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png",
    "https://homepages.cae.wisc.edu/~ece533/images/boat.png"
],[
    "https://www.rmp-streaming.com/media/big-buck-bunny-360p.mp4"
]);
//document.body.appendChild(vanillaSmallGallery);*/

//vanillaSmallGallery.addImage("https://homepages.cae.wisc.edu/~ece533/images/airplane.png");
//vanillaSmallGallery.addImage("https://homepages.cae.wisc.edu/~ece533/images/arctichare.png");
//vanillaSmallGallery.addImage("https://homepages.cae.wisc.edu/~ece533/images/boat.png");
//vanillaSmallGallery.addVideo("https://www.rmp-streaming.com/media/big-buck-bunny-360p.mp4");

// var vanillaAddPostTemplate = new VanillaAddPostTemplate(5);
/*
let vanillaHeader = document.getElementById('VanillaHeader').parentElement;

vanillaHeader.profilePicture = "https://homepages.cae.wisc.edu/~ece533/images/boat.png";
vanillaHeader.setAttribute('picture', "https://homepages.cae.wisc.edu/~ece533/images/boat.png");
vanillaHeader.setAttribute('categories', JSON.stringify([
    {text: '1', url: 'null'},
    {text: '2', url: 'null'},
    {text: '3', url: 'null'},
    {text: '4', url: 'null'},
    {text: '5', url: 'null'}
]));

vanillaHeader.setAttribute('notifications', JSON.stringify([{
    id: 1,
    content: "mohammad ahmmad al-hadidi commented today on your new last bad post you publish it before three years",
    image: "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
    time: "34 minutes ago",
    readed: !(1%3 ==  0),
    url: ""
}]));*/


/*let post = new VanillaOpenPostTemplate(24, 13, [
        "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
        "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png",
        "https://homepages.cae.wisc.edu/~ece533/images/boat.png",
        "https://homepages.cae.wisc.edu/~ece533/images/baboon.png",
        "https://homepages.cae.wisc.edu/~ece533/images/monarch.png",
        "https://homepages.cae.wisc.edu/~ece533/images/watch.png"
    ],[
        "https://www.rmp-streaming.com/media/big-buck-bunny-360p.mp4"
    ], "is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages"
    ,'just now', 1, true, 200, "https://homepages.cae.wisc.edu/~ece533/images/airplane.png", ''
);

post.open();*/

let temp = document.createElement('button');

temp.setAttribute('style', 'width : 100px; height: 100px; background-color: red');
document.body.appendChild(temp);

let vanillaAddPostTemplate = new VanillaAddPostTemplate(6, 1, [
    'type 1',
    'type 2',
    'type 3'
], false, 12);

temp.addEventListener('click', () => {
    vanillaAddPostTemplate.open().then((images, videos)=> {
        console.log("post");
    }).catch(() => {
        console.log("exit");
    });
});



//vanillaNotifications.open();

// vanillaNotifications.addPlaceHolders();

//vanillaNotifications.removePlaceHolders();
/*

for(let i = 0; i < 20; i++) {
    vanillaNotifications.push(
        i,
        "mohammad ahmmad al-hadidi commented today on your new last bad post you publish it before three years",
        "https://homepages.cae.wisc.edu/~ece533/images/airplane.png",
        "34 minutes ago",
        !(i%3 ==  0),
        () => console.log("hi from notification " + i)
    );
}*/
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