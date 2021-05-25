import VanillaComments from "../VanillaComments/main";
import VanillaGalleryTemplate from "../VanillaGalleryTemplate/main";
import VanillaPopup from "../VanillaPopup/main";
import VanillaSmallGallery from "../VanillaSmallGallery/main";
import "./main.scss";

export default class VanillaOpenPostTemplate extends HTMLElement {


    static maxContentLength = 100;
    static seeMoreMessage = "see more";
    static seeLessMessage = "see less";

    static toggleLike = (postId) => {

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let status = true;
                resolve(status);
            }, 1000);
        });
    }

    constructor(templateId, postId, images, videos, content, time, likesCount, isLiked, commentsCount, profilePicture, commentsUrl) {
        super();

        this.commentsTemplate = new VanillaComments(templateId, postId, null, null, profilePicture, commentsUrl);

        this.smallGallery = new VanillaSmallGallery(null, null, images, videos, false, templateId);

        this.gallery = new VanillaGalleryTemplate(images, videos, false, templateId);

        this.postId = postId;
        this.templateId = templateId;

        this._content = content;
        this._time = time;
        this._likesCount = likesCount;
        this._commentsCount = commentsCount;
        this._isLiked = isLiked;

        this.template = this.createTemplate();

        this.commentsUrl = commentsUrl;

        this.vanillaPopup = new VanillaPopup();

        this.setAttribute('style', 'display: none !important;');
    }

    createTemplate() {
        
        let mainDiv = document.createElement('div');
        mainDiv.setAttribute('id', `VanillaOpenPost${ this.postId }Template${ this.templateId }`);
        mainDiv.setAttribute('class', 'vanilla-open-post-template vanilla-pop-up-container');

            let exitButton = document.createElement('section');
            exitButton.setAttribute('class', 'vanilla-pop-up-exit-button');
            exitButton.innerHTML = `
                <svg viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor">
                    <path d="M13.42 12L20 18.58 18.58 20 12 13.42 5.42 20 4 18.58 10.58 12 4 5.42 5.42 4 12 10.58 18.58 4 20 5.42z"></path>
                </svg>
            `;
            let exitButtonHandler = () => {
                this.close();
            };
            exitButton.addEventListener('click', exitButtonHandler);

            let innerDiv = document.createElement('div');

                let rigthSection = document.createElement('section');

                    let smallGalleryContainer = document.createElement('div');
                    smallGalleryContainer.setAttribute('id', `VanillaOpenPost${ this.postId }Template${ this.templateId }SmallGalleryContainer`);
                    let click = 1;
                    smallGalleryContainer.addEventListener('dblclick', () => {
                        click = 1;
                        this.gallery.open();
                        this.gallery.currentIndex = this.smallGallery.currentIndex;
                    });
                    // for dblclick event on Android :
                    smallGalleryContainer.addEventListener('click', () => {
                        if(click < 2) {
                            click++;
                            setTimeout( () => {
                                click = 1;
                            }, 500);
                            return;
                        }
                        click = 1;
                        this.gallery.open();
                        this.gallery.currentIndex = this.smallGallery.currentIndex;
                    });

                    let contentDiv = this.createContentDiv();
                    if(contentDiv != null) smallGalleryContainer.appendChild(contentDiv);
                    smallGalleryContainer.appendChild(this.smallGallery);

                    let commentsAndLikesMetaData = document.createElement('div');

                    commentsAndLikesMetaData.innerHTML = `
                            <footer><div>
                            <span id="Vanilla${this.templateId}Post${this.postId}CommentsCount">${ this.countfilter(this.commentsCount, 'comment') }</span>
                            <svg fill="currentColor" height="24" viewBox="0 0 48 48" width="24">
                                <path clip-rule="evenodd" d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z" fill-rule="evenodd"></path>
                            </svg>
                        </div><div>
                            <span id="Vanilla${this.templateId}Post${this.postId}LikesCount">${ this.countfilter(this.likesCount, 'like') }</span>
                            <svg id="Vanilla${this.templateId}Post${this.postId}LikeButton" fill="currentColor" height="24" viewBox="0 0 48 48" width="24">
                                <path style="${ ( this.isLiked ? 'display: none !important;' : 'display: block !important;' ) }" d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                                <path style="${ ( this.isLiked ? 'display: block !important;color: red;' : 'display: none !important;' ) }" d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                            </svg>
                        </div></footer>
                    `;

                    if(commentsAndLikesMetaData.children.length > 0) if(commentsAndLikesMetaData.children[0].children.length > 0)
                    commentsAndLikesMetaData.children[0].children[0].addEventListener('click', () => {
                        leftSection.setAttribute('style', 'display: block !important; position: fixed; z-index: 3; padding: 0; top: 0; left: 0; width: 100%;');
                        exitButton.removeEventListener('click', exitButtonHandler);
                        exitButtonHandler = () => {
                            leftSection.setAttribute('style', '');
                            exitButton.removeEventListener('click', exitButtonHandler);
                            exitButtonHandler = () => {
                                this.close();
                            };
                            exitButton.addEventListener('click', exitButtonHandler);
                        };
                        exitButton.addEventListener('click', exitButtonHandler);
                    });
                    if(commentsAndLikesMetaData.children.length > 0) if(commentsAndLikesMetaData.children[0].children.length > 1)
                    if(commentsAndLikesMetaData.children[0].children[1].children.length > 1) {

                        commentsAndLikesMetaData.children[0].children[1].children[0].addEventListener('click', () => {

                            this.vanillaPopup.likes(this.postId, 'Post', 'likes list', null, true);
                        });

                        commentsAndLikesMetaData.children[0].children[1].children[1].addEventListener('click', this.toggleLikeHandler);

                    }

                rigthSection.appendChild(smallGalleryContainer);
                rigthSection.appendChild(commentsAndLikesMetaData);

                let leftSection = document.createElement('section');
                leftSection.appendChild(this.commentsTemplate);

            innerDiv.appendChild(rigthSection);
            innerDiv.appendChild(leftSection);

        mainDiv.appendChild(exitButton);
        mainDiv.appendChild(innerDiv);

        return mainDiv;
    }
    
    connectedCallback() {
        
        this.appendChild(this.template);
    }


    toggleLikeHandler = () => {

        this.isLiked = ! this.isLiked;

        if(this.isLiked) this.likesCount++;
        else this.likesCount--;

        VanillaOpenPostTemplate.toggleLike(this.postId)
        .then((status) => {

            if(status) return;

            if(this.isLiked) this.likesCount--;
            else this.likesCount++;

            this.vanillaPopup.alert("error", (this.isLiked ? 'make like filed' : 'remove like filed') ,"ok");

            this.isLiked = ! this.isLiked;
            
        }).catch(() => {

            if(this.isLiked) this.likesCount--;
            else this.likesCount++;

            this.vanillaPopup.alert("error", (this.isLiked ? 'make like filed' : 'remove like filed') ,"ok");

            this.isLiked = ! this.isLiked;

        });

    };

    open() {

        if(! this.isConnected) document.body.appendChild(this);

        this.setAttribute('style', 'display: block !important;');

        this.commentsTemplate.commentsUrl = this.commentsUrl;

        this.smallGallery.currentIndex = 0;
    }

    close() {

        this.setAttribute('style', 'display: none !important;');
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

    createContentDiv() {

        if(typeof this.content != 'string') return null;

        if(this.content.trim() == '') return null;

        let contentDiv = document.createElement('div');

        contentDiv.setAttribute('class', 'vanilla-open-post-template-content-div');


        let content = this.content;

        if(! this.contentSizeIsValid()) {


            content = content.substr(0, VanillaOpenPostTemplate.maxContentLength)
                + " <span>" + VanillaOpenPostTemplate.seeMoreMessage + "</span>";
        }

        contentDiv.innerHTML = `
            ${ content }
        `;

        let seeMoreButtonHandler = () => {
            contentDiv.innerHTML = `${this.content} <span>${VanillaOpenPostTemplate.seeLessMessage}</span>`;
            if(contentDiv.children.length == 1) contentDiv.children[0].addEventListener('click', () => {
                contentDiv.innerHTML = `
                    ${ content }
                `;
                if(contentDiv.children.length == 1) contentDiv.children[0].addEventListener('click', seeMoreButtonHandler);
            });
        }

        if(contentDiv.children.length == 1) contentDiv.children[0].addEventListener('click', seeMoreButtonHandler);

        return contentDiv;
    }

    contentSizeIsValid() {

        return this.content.length > VanillaOpenPostTemplate.maxContentLength ? false : true;
    }

    get content () { return this._content; }
    set content (value) {

        this._content = value;

        let smallGalleryContainer = document.getElementById(`VanillaOpenPost${ this.postId }Template${ this.templateId }SmallGalleryContainer`);

        if(smallGalleryContainer != null) {
            if(smallGalleryContainer.children.length == 2) {
                if(smallGalleryContainer.children[0] != this.smallGallery) {
                    smallGalleryContainer.removeChild(smallGalleryContainer.children[0]);
                }
            }
            if(smallGalleryContainer.children.length == 1) {
                let contentDiv = this.createContentDiv();
                if(contentDiv != null) smallGalleryContainer.insertBefore(contentDiv, smallGalleryContainer.children[0]);
            }
        }
    }

    get time () { return this._time; }
    set time (value) {
        //  TODO : find place to time !!
        this._time = value; 
    }

    get likesCount () { return this._likesCount; }
    set likesCount (value) {
        
        let likesCountLabel = document.getElementById(`Vanilla${this.templateId}Post${this.postId}LikesCount`);

        if(likesCountLabel != null) likesCountLabel.textContent = this.countfilter(value, 'like');

        this._likesCount = value;
    }

    get commentsCount () { return this._commentsCount; }
    set commentsCount (value) {

        let commentsCountLabel = document.getElementById(`Vanilla${this.templateId}Post${this.postId}CommentsCount`);

        if(commentsCountLabel != null) commentsCountLabel.textContent = this.countfilter(value, 'comment');

        this._commentsCount = value;
    }

    get isLiked () { return this._isLiked; }
    set isLiked (value) {
        let likeButton = document.getElementById(`Vanilla${this.templateId}Post${this.postId}LikeButton`);
                            
        if(likeButton != null && likeButton.children.length > 1) {
            likeButton.children[0].setAttribute('style', ( value ? 'display: none !important;' : 'display: block !important;' ));
            likeButton.children[1].setAttribute('style', ( value ? 'display: block !important;color: red;' : 'display: none !important;' ));
        }

        this._isLiked = value;
    }
}

window.customElements.define('vanilla-open-post-template', VanillaOpenPostTemplate);