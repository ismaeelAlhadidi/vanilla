import "./../style/comment.scss";

import VanillaReplay from "./VanillaReplay";
import VanillaReplyPlaceHolder from "./VanillaReplyPlaceHolder";

export default class VanillaComment extends HTMLElement {

    static postReplyButtonText = "Post";
    static replyInputPlaceHolder = "write reply ...";

    static i = 1000;
    static postReplayCallBack(commentId, content) {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let newReplay = {
                    id: VanillaComment.i,
                    content: content,
                    time: 'just now',
                    userId: 1,
                    userName: 'Esmaeel al-hadidi',
                    userPicture: ' https://homepages.cae.wisc.edu/~ece533/images/boat.png',
                };
                VanillaComment.i++;
                resolve(newReplay);
            }, 1000);
        });
    }

    static toggleLike = (commentId) => {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let status = true;
                resolve(status);
            }, 1000);
        });
    }

    constructor (comment, templateId, profilePicture) {
        super();
        this.comment = comment;
        this.templateId = templateId;

        this._profilePicture = profilePicture;

        this.replies = new Map();

        this.replyOpend = false;
    }

    connectedCallback() {
        this.innerHTML =`
        <div id="Vanilla${ this.templateId }Comment${ this.comment.id }" class="vanilla-comment">
            <div id="Vanilla${ this.templateId }Comment${ this.comment.id }Card">
                <div><img src="${ this.comment.userPicture }"/></div>
                <div>
                    <div>
                        <span>${ this.comment.userName }</span>
                        <span>${ this.comment.time }</span>
                    </div>
                    <p>${ this.comment.content }</p>
                </div>
                <div>X</div>
                <footer><div id="Vanilla${ this.templateId }Comment${ this.comment.id }OpenReplies">
                        <span id="Vanilla${ this.templateId }Comment${ this.comment.id }RepliesCount">${ this.countfilter(this.replies.size, 'reply') }</span>
                        <svg fill="currentColor" height="24" viewBox="0 0 48 48" width="24">
                            <path clip-rule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fill-rule="evenodd"></path>
                        </svg>
                    </div><div>
                        <span id="Vanilla${ this.templateId }Comment${ this.comment.id }LikesCount">${ this.likesCountfillter(this.comment.likesCount) }</span>
                        <svg id="Vanilla${ this.templateId }Comment${ this.comment.id }ToggleLikeButton" fill="currentColor" height="24" viewBox="0 0 48 48" width="24">
                            <path style="${ ( this.comment.liked ? 'display: none !important;' : 'display: block !important;' ) }" d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                            <path style="${ ( this.comment.liked ? 'display: block !important;color: red;' : 'display: none !important;' ) }" d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                        </svg><!--<svg fill="#ed4956" height="24" viewBox="0 0 48 48" width="24"></svg>-->
                    </div></footer>
            </div>
            <main id="Vanilla${ this.templateId }Comment${ this.comment.id }Replies">
                <footer id="Vanilla${ this.templateId }Comment${ this.comment.id }PostReply">
                    <div><img id="Vanilla${ this.templateId }Comment${ this.comment.id }ProfilePicture" src=" ${ this.profilePicture } "/></div>
                    <div><textarea id="Vanilla${ this.templateId }Comment${ this.comment.id }InputReplayContent" placeholder="${ VanillaComment.replyInputPlaceHolder }"></textarea></div>
                    <div><section><button id="Vanilla${ this.templateId }Comment${ this.comment.id }PostReplayButton">${ VanillaComment.postReplyButtonText }</button></section></div>
                </footer>
            </main>
        </div>
        `;

        this.pushAll(this.comment.replies);

        this.setEvents();
    }

    setEvents() {
        let postReplayButton = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }PostReplayButton`);
        let inputReplayContent = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }InputReplayContent`);
        if(postReplayButton != null && inputReplayContent != null) {
            postReplayButton.addEventListener('click', () => {

                let content = inputReplayContent.value.trim();
                inputReplayContent.value = '';

                if(content == '') {
                    // TODO: change placeholder color to red
                    inputReplayContent.style = "border-bottom: 1.25px solid red;";
                    inputReplayContent.focus();
                    return;
                }

                this.addPlaceHolder(content);
                
                VanillaComment.postReplayCallBack(this.comment.id, content)
                .then((replay) => {
                    replay['liked'] = false;
                    replay['likesCount'] = 0;
                    this.removePlaceHolder();
                    this.push(replay);
                }).catch((message) => {
                    this.removePlaceHolder();
                    this.vanillaPopup.alert("post replay faild", message, "ok");
                });
            });
        }

        let openReplies = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }OpenReplies`);
        let replies = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }Replies`);
        if(openReplies != null && replies != null) {
            openReplies.addEventListener('click', () => {

                if(this.replyOpend) {
                    replies.setAttribute('style', 'height: 0 !important;');
                    this.replyOpend = false;
                    return;
                }
                this.replyOpend = true;
                let height = this.getRepliesApproximateHeight();
                replies.setAttribute('style', 'height: ' + height +' !important;');
            });
        }

        let toggleLikeButton = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }ToggleLikeButton`);
        if(toggleLikeButton != null) {
            toggleLikeButton.addEventListener('click', () => {
                this.comment.liked = ! this.comment.liked;

                if(this.comment.liked) this.comment.likesCount++;
                else this.comment.likesCount--;

                this.setLiked();
                VanillaComment.toggleLike(this.comment.id)
                .then((status) => {
    
                    if(status) return;

                    if(this.comment.liked) this.comment.likesCount--;
                    else this.comment.likesCount++;

                    this.vanillaPopup.alert("error", (this.comment.liked ? 'make like filed' : 'remove like filed') ,"ok");

                    this.comment.liked = ! this.comment.liked;
                    this.setLiked();
                    
                }).catch(() => {

                    if(this.comment.liked) this.comment.likesCount--;
                    else this.comment.likesCount++;
    
                    this.vanillaPopup.alert("error", (this.comment.liked ? 'make like filed' : 'remove like filed') ,"ok");

                    this.comment.liked = ! this.comment.liked;
                    this.setLiked();

                });
            });
        }
    }

    setLiked() {
        
        let toggleLikeButton = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }ToggleLikeButton`);
        
        if(toggleLikeButton == null) return;

        if(toggleLikeButton.children.length < 2) return;

        toggleLikeButton.children[0].setAttribute('style', ( this.comment.liked ? 'display: none !important;' : 'display: block !important;' ));

        toggleLikeButton.children[1].setAttribute('style', ( this.comment.liked ? 'display: block !important;color: red;' : 'display: none !important;' ));
        
        let likesCount = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }LikesCount`);

        if(likesCount == null) return;

        likesCount.textContent = this.likesCountfillter(this.comment.likesCount);

    }

    addPlaceHolder(content) {
        let replies = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }Replies`);

        if(replies == null) return;

        let replayPlaceHolder = new VanillaReplyPlaceHolder(content);

        if(replies.children <= 1) {
            replies.appendChild(replayPlaceHolder);
            if(this.replyOpend) {
                let height = this.getRepliesApproximateHeight();
                replies.setAttribute('style', 'height: ' + height +' !important;');
            }
            return;
        }

        replies.insertBefore(replayPlaceHolder, replies.children[1]);
        if(this.replyOpend) {
            let height = this.getRepliesApproximateHeight();
            replies.setAttribute('style', 'height: ' + height +' !important;');
        }
    }

    removePlaceHolder() {
        let replies = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }Replies`);
        let placeHolders = document.querySelectorAll('.vanilla-replay-placeholder');
        if(replies == null || placeHolders == null) return;
        placeHolders.forEach((element) => {
            if(element.parentElement == null || element.parentElement == undefined) return;
            if(replies != element.parentElement) return;
            replies.removeChild(element);
        });
        if(this.replyOpend) {
            let height = this.getRepliesApproximateHeight();
            replies.setAttribute('style', 'height: ' + height +' !important;');
        }
    }

    push(reply, multi = false) {

        if(typeof reply !== 'object' || reply === null) return;

        if(! reply.hasOwnProperty("id")) return;

        this.replies.set(reply.id, new VanillaReplay(reply, this.templateId, this.profilePicture));

        let VanillaCommentReplies = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }Replies`);
        
        if(VanillaCommentReplies == null) return;
        
        if(! multi) {
            
            if(VanillaCommentReplies.children <= 1) {
                VanillaCommentReplies.appendChild(this.replies.get(reply.id));
                return;
            }

            VanillaCommentReplies.insertBefore(this.replies.get(reply.id), VanillaCommentReplies.children[1]);
            this.setRepliesCountLabel();
            if(this.replyOpend) {
                let height = this.getRepliesApproximateHeight();
                VanillaCommentReplies.setAttribute('style', 'height: ' + height +' !important;');
            }
            return;
        }

        VanillaCommentReplies.appendChild(this.replies.get(reply.id));
        if(this.replyOpend) {
            let height = this.getRepliesApproximateHeight();
            VanillaCommentReplies.setAttribute('style', 'height: ' + height +' !important;');
        }
    }

    pop(id) {

        if( ! this.replies.has(id) ) return;

        let VanillaCommentReplies = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }Replies`);

        if(VanillaCommentReplies != null) {

            VanillaCommentReplies.removeChild(this.replies.get(id));

            if(this.replyOpend) {
                let height = this.getRepliesApproximateHeight();
                VanillaCommentReplies.setAttribute('style', 'height: ' + height +' !important;');
            }
        }

        this.replies.delete(id);
    }
    
    pushAll(replies) {

        if(! Array.isArray(replies)) return;
        
        replies.forEach((reply) => {
            this.push(reply, true);
        });

        this.setRepliesCountLabel();
    }

    setRepliesCountLabel() {
        let repliesCountLabel = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }RepliesCount`);
        
        if(repliesCountLabel == null) return;

        repliesCountLabel.textContent = this.countfilter(this.replies.size, 'reply');
    }

    likesCountfillter(likesCount) {
        
        return this.countfilter(likesCount, 'like');
    }

    countfilter(count, item) {
        if(count == undefined || count < 0) return '0 ' + this.plural(item);

        if(count == 1) return '1 ' + item;

        return Math.floor(count) + ' ' + this.plural(item);
    }

    plural(word) {

        if(! word.endsWith("y")) return word + 's';

        return word.substring(0, word.length - 1) + 'ies';
    }

    getRepliesApproximateHeight() {
        let approximateHeight = 0;

        let repliesParent = document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }Replies`);

        if(repliesParent == null) return approximateHeight+"px";

        let marginOfreply = 5;
        
        for(let i = 0; i < repliesParent.children.length; i++) {
            approximateHeight += repliesParent.children[i].getBoundingClientRect().height + marginOfreply;
        }

        approximateHeight -= marginOfreply; /* because post replay element don't have margin */

        return approximateHeight+"px";
    }

    get profilePicture() { return this._profilePicture; }
    set profilePicture(value) {
        let profilePicture =  document.getElementById(`Vanilla${ this.templateId }Comment${ this.comment.id }ProfilePicture`);
        if(profilePicture != null) profilePicture.src = value;
        this._profilePicture = value;
    }
}

window.customElements.define('vanilla-comment', VanillaComment);