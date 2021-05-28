import "./style/main.scss";

import VanillaList from "./../VanillaList/main";

import VanillaLike from "./child/VanillaLike";
import VanillaFollower from "./child/VanillaFollower";
import VanillaFollowing from "./child/VanillaFollowing";
import VanillaItemPlaceHolder from "./child/VanillaItemPlaceHolder";

export default class VanillaLikesList extends VanillaList {

    static emptyLikesMessage = "no likes yet";

    static emptyFollowerMessage = "no followers yet";

    static emptyFollowingMessage = "no following yet";

    static fetchLikesCallBack = (componentId, componentType) => {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([]);
            }, 1000);
        });
    };

    static fetchFollowerCallBack = (userId, temp) => {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([]);
            }, 1000);
        });
    };

    static fetchFollowingCallBack = (userId, temp) => {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([]);
            }, 1000);
        });
    };

    static toggleFollowCallBack = (userId) => {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([]);
            }, 1000);
        });
    };

    constructor (componentId, componentType, title, list = null, type = 'likes', autoFetch = false) {

        super("Likes" + componentType + componentId, title, list);

        this.type = type;

        this.componentId = componentId;
        this.componentType = componentType;
        this.type = type;
        
        this.autoFetch = autoFetch;
    }

    connectedCallback() {

        super.connectedCallback();

        this.setAttribute('class', 'vanilla-likes');


        if(this.autoFetch) {
            this.startPlaceHolders();
            let callBack = this.getCallBack(this.type);
            if(callBack == null) {
                this.stopPlaceHolders();
                return;
            }
            this.fetchListFrom(callBack);
        }
    }

    destroy() {

        if(! this.isConnected) return;

        if(this.parentElement == null) return;

        this.parentElement.removeChild(this);
    }

    close() {

        let parent = this.parentElement;

        if( parent != document.body) {

            if(parent != null && parent != undefined) {

                parent = this.parentElement.parentElement;

                if(parent != null && parent != undefined) {
                    
                    if(typeof parent.destroy === 'function') parent.destroy();
                }

            }
        }

        this.destroy();
    }

    open() {

        if(! this.isConnected) {

            let VanillaList = document.getElementById(`VanillaList${ this.id }`);

            if(VanillaList == null) document.body.appendChild(this);
        }

        this.style = "";
        this.isOpend = true;
    }

    /*
        like: {
            id,
            userName, -> string
            userPicture, -> [ url to image ]
            userId,
            followers, -> integer [ followers of user who make this like ]
            following, -> boolean [ current authenticated user following 'this user' or not ]
        }
    */

    add(like) {

        if(typeof like !== 'object' || like === null) return;

        if(! like.hasOwnProperty("id")) return;

        if(! Array.isArray(this.list)) {
            
            this.list = [like];
            return;
        }

        if(! this.isConnected) {

            document.body.appendChild(this);
        }

        let VanillaListInnerTemplate = document.getElementById(`VanillaList${ this.id }InnerTemplate`);
        
        if(VanillaListInnerTemplate == null) return;

        if(this.type == 'likes') VanillaListInnerTemplate.appendChild(new VanillaLike(this.id, like, VanillaLikesList.toggleFollowCallBack));

        else if(this.type == 'following') VanillaListInnerTemplate.appendChild(new VanillaFollowing(this.id, like, VanillaLikesList.toggleFollowCallBack));

        else VanillaListInnerTemplate.appendChild(new VanillaFollower(this.id, like, VanillaLikesList.toggleFollowCallBack));

        this.list.push(like);
    }

    setList () {

        this.startPlaceHolders();

        if(! Array.isArray(this.list)){
            this.stopPlaceHolders();
            return;
        }

        let VanillaListInnerTemplate = document.getElementById(`VanillaList${ this.id }InnerTemplate`);

        let parent = document.getElementById(`VanillaList${ this.id }`);

        if(parent == null) {
            this.stopPlaceHolders();
            return;
        }

        if(this.list.length < 1) {
            this.stopPlaceHolders();
            return;
        }

        let newVanillaListInnerTemplate = document.createElement('main');

        newVanillaListInnerTemplate.setAttribute('id', `VanillaList${ this.id }InnerTemplate`);

        if(this.type == 'likes') {
            for(let i = 0; i < this.list.length; i++) {

                newVanillaListInnerTemplate.appendChild(new VanillaLike(this.id, this.list[i], VanillaLikesList.toggleFollowCallBack));
            }
        }

        else if(this.type == 'following') {
            for(let i = 0; i < this.list.length; i++) {

                newVanillaListInnerTemplate.appendChild(new VanillaFollowing(this.id, this.list[i], VanillaLikesList.toggleFollowCallBack));
            }
        }

        else if(this.type == 'follower') {
            for(let i = 0; i < this.list.length; i++) {

                newVanillaListInnerTemplate.appendChild(new VanillaFollower(this.id, this.list[i], VanillaLikesList.toggleFollowCallBack));
            }
        }

        this.stopPlaceHolders();

        if(VanillaListInnerTemplate != null) {

            parent.removeChild(VanillaListInnerTemplate);
        }

        parent.appendChild(newVanillaListInnerTemplate);
    }

    getCallBack(type) {

        switch(type) {
            case 'likes':
                return VanillaLikesList.fetchLikesCallBack;
            case 'follower':
                return VanillaLikesList.fetchFollowerCallBack;
            case 'following':
                return VanillaLikesList.fetchFollowingCallBack;
            default:
                return null;
        }
    }

    fetchListFrom(callBack) {

        callBack(this.componentId, this.componentType).then((result) => {

            this.list = result;

            this.stopPlaceHolders();
        }).catch(() => {
            this.stopPlaceHolders();
        });
    }


    startPlaceHolders(count = 6) {

        if(this.placeHolderStarted) return;
        this.removeEmptyMessage();
        this.placeHolderStarted = true;

        let VanillaListInnerTemplate = document.getElementById(`VanillaList${ this.id }InnerTemplate`);
        if(VanillaListInnerTemplate == null) {

            this.placeHolderStarted = false;
            return;
        }

        for(let i = 0; i < count; i++) {

            VanillaListInnerTemplate.appendChild(new VanillaItemPlaceHolder());
        }
    }

    stopPlaceHolders() {
        
        this.placeHolderStarted = false;

        let VanillaListInnerTemplate = document.getElementById(`VanillaList${ this.id }InnerTemplate`);
        if(VanillaListInnerTemplate == null) return;

        let selected = document.querySelectorAll('.vanilla-item-placeholder');

        if(selected == null) return;

        selected.forEach((element) => {
            let target = element.parentElement;
            if(target == null || target == undefined) return;
            if(target.parentElement == null || target.parentElement == undefined) return;
            if(target.parentElement != VanillaListInnerTemplate) return;
            VanillaListInnerTemplate.removeChild(target);
        });

        if(! Array.isArray(this.list) || this.list.length < 1) {
            this.showEmptyMessage();
        }
    }

    showEmptyMessage() {

        let emptyMessage = document.getElementById('VanillaLikesListEmptyMessage' + this.componentId + this.componentType);

        if(emptyMessage != null) return;

        emptyMessage = document.createElement('section');

        let emptyMessageInnerSpan = document.createElement('span');

        switch(this.type) {
            case 'likes':
                emptyMessageInnerSpan.textContent = VanillaLikesList.emptyLikesMessage;
                break;
            case 'follower':
                emptyMessageInnerSpan.textContent = VanillaLikesList.emptyFollowerMessage;
                break;
            case 'following':
                emptyMessageInnerSpan.textContent = VanillaLikesList.emptyFollowingMessage;
                break;
            default:
                return;
        }

        emptyMessage.appendChild(emptyMessageInnerSpan);

        emptyMessage.setAttribute('class', 'vanilla-likes-list-empty-message');

        emptyMessage.setAttribute('id', 'VanillaLikesListEmptyMessage' + this.componentId + this.componentType);

        if(this.children.length > 0)
        if(this.children[0].children.length > 1)
        this.children[0].children[1].appendChild(emptyMessage);
    }

    removeEmptyMessage() {

        let emptyMessage = document.getElementById('VanillaLikesListEmptyMessage' + this.componentId + this.componentType);

        if(emptyMessage == null) return;

        let parent = emptyMessage.parentElement;

        if(parent == null || parent == undefined) return;

        parent.removeChild(emptyMessage);
    }
}

window.customElements.define('vanilla-likes-list', VanillaLikesList);