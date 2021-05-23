import "./../style/like.scss";

export default class VanillaFollowing extends HTMLElement {

    constructor (listId, like) {
        super();

        this.like = like;

        this.listId = listId;
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="Vanilla${ this.listId }Like${ this.like.id }" class="vanilla-like">
                <div><img src="${ this.like.userPicture }" /></div>
                <div><span>${ this.like.userName }</span><span>${ this.like.followers } . followers</span></div>
                <div><button class="${ ( this.like.following ? 'following' : '' ) }">${ ( this.like.following ? 'remove' : 'Follow') }</button></div>
            </div>
        `;
    }
} 

window.customElements.define('vanilla-following', VanillaFollowing);