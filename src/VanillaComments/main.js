import "./style/main.scss";

import VanillaComment from "./child/VanillaComment";
import VanillaCommentPlaceHolder from "./child/VanillaCommentPlaceHolder"
import VanillaPopup from "../VanillaPopup/main";


export default class VanillaComments extends HTMLElement {

    static title = "Comments";
    static postCommentButtonText = "POST";
    static commentInputPlaceHolder = "write comment ...";

    static emptyMessage = "do you want to add first comment on this post ?";

    /*
        ## this call back to send request to server
        
        must return ( Promise instance ) 
        IF [ resolve ] add new comment to comments list
        IF [ reject ] show alert to user
    */
    static i = 1000;
    static postCommentCallBack = (postId, content) => {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let newComment = {
                    id: VanillaComments.i,
                    content: content,
                    time: 'just now',
                    userId: 1,
                    userName: 'Esmaeel al-hadidi',
                    userPicture: ' https://homepages.cae.wisc.edu/~ece533/images/boat.png',
                };
                VanillaComments.i++;
                resolve(newComment);
            }, 1000);
        });
    };

    static get observedAttributes() {
        return ['templateid', 'postid', 'width', 'heigth', 'picture', 'fetch'];
    }
    
    constructor (templateId, postId, width, heigth, profilePicture, commentsUrl = null) {
        super();
        this.templateId = templateId;
        this._postId = postId;
        this._width = width;
        this._heigth = heigth;
        this._profilePicture = profilePicture;

        this.comments = new Map();
        this.vanillaPopup = new VanillaPopup();

        this._commentsUrl = commentsUrl;
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="VanillaComments${ this.templateId }" class="vanilla-comments">
            <header>
                <span id="VanillaCommentsTitle${ this.templateId }">${ VanillaComments.title }</span>
                <svg id="VanillaComments${ this.templateId }ExitButton" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="exit-icon">
                    <path d="M13.42 12L20 18.58 18.58 20 12 13.42 5.42 20 4 18.58 10.58 12 4 5.42 5.42 4 12 10.58 18.58 4 20 5.42z"></path>
                </svg>
            </header>
            <main id="VanillaComments${ this.templateId }InnerTemplate" class="vanilla-comments-inner-template">

                <section id="VanillaComments${ this.templateId }EmptyMessage" class="vanilla-comments-empty-massege">
                    <span>${ VanillaComments.emptyMessage }</span>
                </section>
            </main>
            <footer>
                <div><img id="VanillaComments${ this.templateId }ProfilePicture" src=" ${ this.profilePicture } "/></div>
                <div><textarea id="VanillaComments${ this.templateId }InputCommentContent" placeholder="${ VanillaComments.commentInputPlaceHolder }"></textarea></div>
                <div><section><button id="VanillaComments${ this.templateId }PostCommentButton">${ VanillaComments.postCommentButtonText }</button></section></div>
            </footer>
        </div>`;
        this.setEvents();
        this.checkEmpty();
        this.fetchComments(this.commentsUrl);
    }

    checkEmpty() {

        let emptyMessage = document.getElementById(`VanillaComments${ this.templateId }EmptyMessage`);
        
        if(emptyMessage == null) return;

        if(this.comments.size == 0) {

            emptyMessage.style = "display: block !important;";
            return;
        }

        emptyMessage.style = "display: none !important;";
    }

    /* 
        comment {
            id,
            content,
            time,
            userId,
            userName,
            userPicture,
            liked,
            likesCount,
            replies
        }
    */

    push(comment, checkEmpty = true) {

        if(typeof comment !== 'object' || comment === null) return;

        if(! comment.hasOwnProperty("id")) return;

        this.comments.set(comment.id, new VanillaComment(comment, this.templateId, this.profilePicture));

        let VanillaCommentsInnerTemplate = document.getElementById(`VanillaComments${ this.templateId }InnerTemplate`);

        if(VanillaCommentsInnerTemplate != null) {
            VanillaCommentsInnerTemplate.appendChild(this.comments.get(comment.id));
        }

        if(! checkEmpty) return;

        this.checkEmpty();
    }

    pop(id) {

        if( ! this.comments.has(id) ) return;

        let VanillaCommentsInnerTemplate = document.getElementById(`VanillaComments${ this.templateId }InnerTemplate`);

        if(VanillaCommentsInnerTemplate != null) {

            VanillaCommentsInnerTemplate.removeChild(this.comments.get(id));
        }

        this.comments.delete(id);

        this.checkEmpty();
    }

    pushAll(comments) {
        if(! Array.isArray(comments)) return;
        comments.forEach((comment) => {
            this.push(comment, false);
        });
        this.checkEmpty();
    }


    setEvents() {
        let postCommentButton = document.getElementById(`VanillaComments${ this.templateId }PostCommentButton`);
        let commentContentInput = document.getElementById(`VanillaComments${ this.templateId }InputCommentContent`);
        if(postCommentButton != null && commentContentInput != null) {
            postCommentButton.addEventListener('click', () => {

                let content = commentContentInput.value.trim();
                commentContentInput.value = '';

                if(content == '') {
                    // TODO: change placeholder color to red
                    commentContentInput.style = "border: 1.25px solid red;";
                    commentContentInput.focus();
                    return;
                }

                this.addPlaceHolder(content);

                let VanillaCommentsInnerTemplate = document.getElementById(`VanillaComments${ this.templateId }InnerTemplate`);
                VanillaCommentsInnerTemplate.scroll(0, VanillaCommentsInnerTemplate.scrollHeight);

                VanillaComments.postCommentCallBack(this.postId, content)
                .then((comment) => {
                    comment['liked'] = false;
                    comment['likesCount'] = 0;
                    this.removePlaceHolders();
                    this.push(comment);
                    VanillaCommentsInnerTemplate.scroll(0, VanillaCommentsInnerTemplate.scrollHeight);
                }).catch((message) => {
                    this.removePlaceHolders();
                    this.vanillaPopup.alert("post comment faild", message, "ok");
                });
            });
        }
    }

    addPlaceHolder(content) {

        let VanillaCommentsInnerTemplate = document.getElementById(`VanillaComments${ this.templateId }InnerTemplate`);

        if(VanillaCommentsInnerTemplate != null) {

            let emptyMessage = document.getElementById(`VanillaComments${ this.templateId }EmptyMessage`);
        
            if(emptyMessage != null) {

                emptyMessage.style = "display: none !important;";
            }

            VanillaCommentsInnerTemplate.appendChild(new VanillaCommentPlaceHolder(content));
        }
    }

    removePlaceHolders() {
        let VanillaCommentsInnerTemplate = document.getElementById(`VanillaComments${ this.templateId }InnerTemplate`);
        let placeHolders = document.querySelectorAll('.vanilla-comment-placeholder');
        if(VanillaCommentsInnerTemplate == null || placeHolders == null) return;
        placeHolders.forEach((element) => {
            if(element.parentElement == null || element.parentElement == undefined) return;
            if(VanillaCommentsInnerTemplate != element.parentElement.parentElement) return;
            VanillaCommentsInnerTemplate.removeChild(element.parentElement);
        });
        this.checkEmpty();
    }

    addPlaceHolders(count = 1) {

        let VanillaCommentsInnerTemplate = document.getElementById(`VanillaComments${ this.templateId }InnerTemplate`);

        if(VanillaCommentsInnerTemplate != null) {

            let emptyMessage = document.getElementById(`VanillaComments${ this.templateId }EmptyMessage`);
        
            if(emptyMessage != null) {

                emptyMessage.style = "display: none !important;";
            }

            for(let i = 0; i < count; i++) {

                VanillaCommentsInnerTemplate.appendChild(new VanillaCommentPlaceHolder(null, true));
            }
        }
    }

    fetchComments(commentsUrl) {
        this.addPlaceHolders(5);

        fetch(commentsUrl).then((resutl)=> {

            setTimeout(() => {
                this.removePlaceHolders();
            }, 1000);
        }).catch(() => {

            setTimeout(() => {
                this.removePlaceHolders();
            }, 1000);
        });

    }


    attributeChangedCallback(name, oldValue, newValue) {
        if(name == "templateid") {
            this.templateId = newValue;
        }
        if(name == "postid") {
            this.postId = newValue;
        }
        if(name == "width") {
            this.width = newValue;
        }
        if(name == "heigth") {
            this.heigth = newValue;
        }
        if(name == "picture") {
            this.profilePicture = newValue;
        }
        if(name == "fetch") {
            this._commentsUrl = newValue;
        }
    }

    get commentsUrl() { return this._commentsUrl; }
    set commentsUrl(value) {

        this.fetchComments(value);

        this._commentsUrl = value;
    }

    get postId() { return this._postId; }
    set postId(value) {
        this._postId = value;
    }

    get width() { return this._width; }
    set width(value) {
        this._width = value;
    }

    get heigth() { return this._heigth; }
    set heigth(value) {
        this._heigth = value;
    }

    get profilePicture() { return this._profilePicture; }
    set profilePicture(value) {
        let VanillaCommentsProfilePicture =  document.getElementById(`VanillaComments${ this.templateId }ProfilePicture`);
        if(VanillaCommentsProfilePicture != null) VanillaCommentsProfilePicture.src = value;
        this._profilePicture = value;
        this.comments.forEach((comment) => {
            comment.profilePicture = value;
        });
    }

}
window.customElements.define('vanilla-comments', VanillaComments);