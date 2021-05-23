import "./style/main.scss";

import VanillaList from "./../VanillaList/main";

import VanillaLike from "./child/VanillaLike";

export default class VanillaLikesList extends VanillaList {

    constructor (componentId, componentType, title, list = null) {

        super("Likes" + componentType + componentId, title, list);
    }

    connectedCallback() {

        super.connectedCallback();

        this.setAttribute('class', 'vanilla-likes');
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

        VanillaListInnerTemplate.appendChild(new VanillaLike(this.id, like));

        this.list.push(like);
    }

    setList () {
        if(! Array.isArray(this.list)) return;

        let VanillaListInnerTemplate = document.getElementById(`VanillaList${ this.id }InnerTemplate`);

        let parent = document.getElementById(`VanillaList${ this.id }`);

        if(parent == null) return;

        if(VanillaListInnerTemplate != null) {

            parent.removeChild(VanillaListInnerTemplate);
        }

        VanillaListInnerTemplate = document.createElement('main');

        VanillaListInnerTemplate.setAttribute('id', `VanillaList${ this.id }InnerTemplate`);

        parent.appendChild(VanillaListInnerTemplate);

        for(let i = 0; i < this.list.length; i++) {

            VanillaListInnerTemplate.appendChild(new VanillaLike(this.id, this.list[i]));
        }
        
    }
}

window.customElements.define('vanilla-likes-list', VanillaLikesList);