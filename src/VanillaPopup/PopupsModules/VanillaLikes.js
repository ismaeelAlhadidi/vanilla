import "./../style/likes.scss";

import VanillaLikesList from "./../../VanillaLikesList/main";


export default class VanillaLikes extends HTMLElement {


    static defaultZIndex = 10;

    constructor (componentId, componentType, title, list = null) {
        super();

        this.componentId = componentId;
        this.componentType = componentType;

        this.title = title;

        this.list = list;

        this.likesList = new VanillaLikesList(this.componentId, this.componentType, this.title, this.list);

        document.body.appendChild(this);
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="VanillaLikes" class="vanilla-center-pop-up" style="z-index: ${ VanillaLikes.defaultZIndex };">

            </div>
        `;

        this.children[0].appendChild(this.likesList);
    }

    open() {
        this.likesList.open();
        this.setAttribute('style', 'display: block !important;');
    }

    destroy() {

        if(! this.isConnected) return;

        if(this.parentElement == null) return;

        this.parentElement.removeChild(this);
    }

}

window.customElements.define('vanilla-likes', VanillaLikes);