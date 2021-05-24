import VanillaPopup from "../../VanillaPopup/main";
import "./../style/comment.scss";

export default class VanillaReplay extends HTMLElement {


    static toggleLike = (replyId) => {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let status = true;
                resolve(status);
            }, 1000);
        });
    }

    constructor (replay, templateId, profilePicture) {
        super();
        this.replay = replay;
        this.templateId = templateId;

        this._profilePicture = profilePicture;


        this.vanillaPopup = new VanillaPopup();
    }


    connectedCallback() {
        this.innerHTML =`
        <div id="Vanilla${ this.templateId }Replay${ this.replay.id }" class="vanilla-comment vanilla-replay">
            <div id="Vanilla${ this.templateId }Replay${ this.replay.id }Card">
                <div><img src="${ this.replay.userPicture }"/></div>
                <div>
                    <div>
                        <span>${ this.replay.userName }</span>
                        <span>${ this.replay.time }</span>
                    </div>
                    <p>${ this.replay.content }</p>
                </div>
                <div>X</div>
                <footer><div>
                        <span id="Vanilla${ this.templateId }Replay${ this.replay.id }LikesCount">${ this.likesCountfillter(this.replay.likesCount) }</span>
                        <svg id="Vanilla${ this.templateId }Replay${ this.replay.id }ToggleLikeButton" fill="currentColor" height="24" viewBox="0 0 48 48" width="24">
                            <path style="${ ( this.replay.liked ? 'display: none !important;' : 'display: block !important;' ) }" d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                            <path style="${ ( this.replay.liked ? 'display: block !important;color: red;' : 'display: none !important;' ) }" d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                        </svg><!--<svg fill="#ed4956" height="24" viewBox="0 0 48 48" width="24"></svg>-->
                    </div></footer>
            </div>
        </div>
        `;

        this.setEvents();
    }

    setEvents() {
        let toggleLikeButton = document.getElementById(`Vanilla${ this.templateId }Replay${ this.replay.id }ToggleLikeButton`);
        if(toggleLikeButton != null) {
            toggleLikeButton.addEventListener('click', () => {
                this.replay.liked = ! this.replay.liked;

                if(this.replay.liked) this.replay.likesCount++;
                else this.replay.likesCount--;

                this.setLiked();
                VanillaReplay.toggleLike(this.replay.id)
                .then((status) => {
    
                    if(status) return;

                    if(this.replay.liked) this.replay.likesCount--;
                    else this.replay.likesCount++;

                    this.vanillaPopup.alert("error", (this.replay.liked ? 'make like filed' : 'remove like filed') ,"ok");

                    this.replay.liked = ! this.replay.liked;
                    this.setLiked();
                    
                }).catch(() => {
    
                    if(this.replay.liked) this.replay.likesCount--;
                    else this.replay.likesCount++;

                    this.vanillaPopup.alert("error", (this.replay.liked ? 'make like filed' : 'remove like filed') ,"ok");

                    this.replay.liked = ! this.replay.liked;
                    this.setLiked();

                });
            });
        }

        let likesCount = document.getElementById(`Vanilla${ this.templateId }Replay${ this.replay.id }LikesCount`);
        if(likesCount != null) {
            likesCount.addEventListener('click', () => {
                this.vanillaPopup.likes(this.replay.id, 'Replay', 'likes list', null, true);
            });
        }
    }

    setLiked() {
        
        let toggleLikeButton = document.getElementById(`Vanilla${ this.templateId }Replay${ this.replay.id }ToggleLikeButton`);
        
        if(toggleLikeButton == null) return;

        if(toggleLikeButton.children.length < 2) return;

        toggleLikeButton.children[0].setAttribute('style', ( this.replay.liked ? 'display: none !important;' : 'display: block !important;' ));

        toggleLikeButton.children[1].setAttribute('style', ( this.replay.liked ? 'display: block !important;color: red;' : 'display: none !important;' ));
        
        let likesCount = document.getElementById(`Vanilla${ this.templateId }Replay${ this.replay.id }LikesCount`);

        if(likesCount == null) return;

        likesCount.textContent = this.likesCountfillter(this.replay.likesCount);
    
    }

    likesCountfillter(likesCount) {

        if(likesCount == undefined) return '0 likes';

        if(likesCount == '1') return '1 like';

        return likesCount + ' likes';
    }

    /*
        replay {
            id,
            content,
            time,
            userId,
            userName,
            userPicture,
            liked,
            likesCount
        }
    */

    
    get profilePicture() { return this._profilePicture; }
    set profilePicture(value) {
        let profilePicture =  document.getElementById(`Vanilla${ this.templateId }Replay${ this.replay.id }ProfilePicture`);
        if(profilePicture != null) profilePicture.src = value;
        this._profilePicture = value;
    }

}

window.customElements.define('vanilla-reply', VanillaReplay);