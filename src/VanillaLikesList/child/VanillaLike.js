import "./../style/like.scss";

export default class VanillaLike extends HTMLElement {

    constructor (listId, like, toggleFollowCallBack = null) {
        super();

        this.like = like;

        this.listId = listId;

        this.toggleFollowCallBack = toggleFollowCallBack;

        this.vanillaPopUp = new VanillaPopup();
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="Vanilla${ this.listId }Like${ this.like.id }" class="vanilla-like">
                <div><img src="${ this.like.userPicture }" /></div>
                <div><span>${ this.like.userName }</span><span>${ this.like.followers } . followers</span></div>
                <div><button id="Vanilla${ this.listId }Like${ this.like.id }ToggleFollow" class="${ ( this.like.following ? 'following' : '' ) }">${ ( this.like.following ? 'following' : 'Follow') }</button></div>
            </div>
        `;

        if(this.toggleFollowCallBack != null) {

            let toggleFollowButton = document.getElementById(`Vanilla${ this.listId }Like${ this.like.id }ToggleFollow`);

            if(toggleFollowButton != null) {

                toggleFollowButton.addEventListener('click', () => {

                    this.like.following = ! this.like.following;
                    toggleFollowButton.setAttribute('style', ( this.like.following ? '' : 'font-size: 12px;'));
                    toggleFollowButton.setAttribute('class', ( this.like.following ? 'following' : '' ));
                    toggleFollowButton.textContent = ( this.like.following ? 'Un Follow' : 'Follow Back');

                    this.toggleFollowCallBack(this.like.userId).then((result) => {

                        if(result.status) return;

                        this.like.following = ! this.like.following;
                        toggleFollowButton.setAttribute('style', ( this.like.following ? '' : 'font-size: 12px;'));
                        toggleFollowButton.setAttribute('class', ( this.like.following ? 'following' : '' ));
                        toggleFollowButton.textContent = ( this.like.following ? 'Un Follow' : 'Follow Back');

                    }).catch((message) => {
                        
                        this.vanillaPopUp.alert('error in follow', message, 'ok');

                        this.like.following = ! this.like.following;
                        toggleFollowButton.setAttribute('style', ( this.like.following ? '' : 'font-size: 12px;'));
                        toggleFollowButton.setAttribute('class', ( this.like.following ? 'following' : '' ));
                        toggleFollowButton.textContent = ( this.like.following ? 'Un Follow' : 'Follow Back');
                    });

                });
            }

        }
    }
} 

window.customElements.define('vanilla-like', VanillaLike);
