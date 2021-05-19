import "./main.scss";

export default class VanillaSmallGallery extends HTMLElement {

    static emptyMessage = "no Images or Videos now";

    constructor (width = 340, height = 440, images = null, videos = null, canRemove = false) {
        super();
        this._width = width;
        this._height = height;
        this._images = images;
        this._videos = videos;
        this._currentIndex = 0;
        this.changing = false;
        this.canRemove = canRemove;
    }

    connectedCallback() {

        this.innerHTML = `
            <div id="VanillaSmallGallery" class="vanilla-small-gallery" style="width: ${ this.width }px; height: ${ this.height }px">
                <svg id="VanillaSmallGalleryRemoveButton" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor">
                    <path d="M13.42 12L20 18.58 18.58 20 12 13.42 5.42 20 4 18.58 10.58 12 4 5.42 5.42 4 12 10.58 18.58 4 20 5.42z"></path>
                </svg>
                <div id="VanillaInnerSmallGallery">
                    <img id="VanillaSmallGalleryCurrentImage"/>
                    <video id="VanillaSmallGalleryCurrentVideo"></video>
                </div>
                <nav id="VanillaSmallGalleryNav"></nav>
                <section id="VanillaSmallGalleryNextButton"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg></section>
                <section id="VanillaSmallGalleryPrevButton"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg></section>
                <div id="VanillaSmallGalleryEmptyMessage" class="vanilla-small-gallery-empty-message">
                    <span>${ VanillaSmallGallery.emptyMessage }</span>
                </div>
                <div id="VanillaSmallGalleryPlaceHolder" class="vanilla-small-gallery-placeholder">
                    <div class="vanilla-small-gallery-progress loader-dual-ring"><div></div><div></div><div></div></div>
                </div>
            </div>
        `;

        this.change();

        let vanillaSmallGalleryNextButton = document.getElementById("VanillaSmallGalleryNextButton");
        if(vanillaSmallGalleryNextButton != null) {
            vanillaSmallGalleryNextButton.addEventListener('click', () => { if(!this.changing) this.currentIndex++ });
        }

        let vanillaSmallGalleryPrevButton = document.getElementById("VanillaSmallGalleryPrevButton");
        if(vanillaSmallGalleryPrevButton != null) {
            vanillaSmallGalleryPrevButton.addEventListener('click', () => { if(!this.changing) this.currentIndex-- });
        }

        let vanillaSmallGalleryRemoveButton = document.getElementById("VanillaSmallGalleryRemoveButton");
        if(vanillaSmallGalleryRemoveButton != null) {
            vanillaSmallGalleryRemoveButton.addEventListener('click', () => {
                if(! this.canRemove) return;

                this.remove(this.currentIndex);
            });
        }
    }

    addImage(url) {
        if(this.images == null) {
            this._currentIndex = 0;
            this.images = [url];
            return;
        }
        this.images.push(url);
        this.currentIndex = this.images.length-1;
    }

    addVideo(url) {
        if(this.videos == null) {
            this._currentIndex = ( this.images != null ? this.images.length : 0 );
            this.videos = [url];
            return;
        }
        this.videos.push(url);
        this.currentIndex = ( this.images != null ? this.images.length : 0 ) + this.videos.length-1;
    }

    removeImage(index) {
        if(index < 0 || index > this.images.length-1) return;
        this.images.splice(index, 1);
        this.currentIndex = ( this.currentIndex >= index ? ( this.currentIndex-1 < 0 ? 0 : this.currentIndex-1 ) : this.currentIndex );
    }

    removeVideo(index) {
        let videoIndex = index - ( this.images != null ? this.images.length : 0 );
        if(videoIndex < 0 || videoIndex > this.videos.length-1) return;
        this.videos.splice(videoIndex, 1);
        this.currentIndex = ( this.currentIndex >= index ? ( this.currentIndex-1 < 0 ? 0 : this.currentIndex-1 ) : this.currentIndex );
    }

    remove(index) {
        if(! Array.isArray(this.images)) {
            this.removeVideo(index);
            return;
        }
        if(index >= this.images.length) {
            this.removeVideo(index);
            return;
        }

        this.removeImage(index);
    }

    clear() {
        this._images = null;
        this._videos = null;
        this.change();
    }

    get width() { return this._width; }
    set width(value) {
        let vanillaSmallGallery = document.getElementById("VanillaSmallGallery");
        if(vanillaSmallGallery != null) vanillaSmallGallery.style = `width: ${ value }px; height: ${ this.height }px`;
        this._width = value;
    }

    get height() { return this._height; }
    set height(value) {
        let vanillaSmallGallery = document.getElementById("VanillaSmallGallery");
        if(vanillaSmallGallery != null) vanillaSmallGallery.style = `width: ${ this.width }px; height: ${ value }px`;
        this._height = value;
    }

    get images() {
        return this._images;
    }
    set images(value) {
        if(! Array.isArray(value)) return;
        
        this._images = value;

        this.change();
    }

    get videos() {
        return this._videos;
    }
    set videos(value) {
        if(! Array.isArray(value)) return;
        
        this._videos = value;

        this.change();
    }

    get currentIndex() { return this._currentIndex; }
    set currentIndex(value) {
        this._currentIndex = value;
        this.change();
    }

    change() {
        this.changing = true;
        this.startPlaceHolder();
        let blobsCount = ( this.images != null ? this.images.length : 0 ) 
            + ( this.videos != null ? this.videos.length : 0 );

        this.resetNextAndPrevButtonDisplay(blobsCount);
        
        this.resetNav(blobsCount);

        this.checkIfGalleryIsEmpty(blobsCount);

        this.checkIfCanRemove(blobsCount);

        let vanillaSmallGalleryCurrentImage = document.getElementById("VanillaSmallGalleryCurrentImage");
        let vanillaSmallGalleryCurrentVideo = document.getElementById("VanillaSmallGalleryCurrentVideo");

        if(this.images == null || this.currentIndex >= this.images.length) {
            vanillaSmallGalleryCurrentImage.setAttribute("style", "display: none !important;");
            
            let currentVideoIndex = this.currentIndex - ( this.images != null ? this.images.length : 0 );

            if(this.videos == null || currentVideoIndex > this.videos.length-1) {
                vanillaSmallGalleryCurrentVideo.setAttribute("style", "display: none !important;");
                this.stopPlaceHolder();
                this.changing = false;
                return;
            }

            vanillaSmallGalleryCurrentVideo.setAttribute("style", "display: block !important;");
            vanillaSmallGalleryCurrentVideo.src = this.videos[currentVideoIndex];
            this.stopPlaceHolder();
            this.changing = false;
            return;
        }

        vanillaSmallGalleryCurrentVideo.setAttribute("style", "display: none !important;");
        vanillaSmallGalleryCurrentImage.setAttribute("style", "display: block !important;");
        vanillaSmallGalleryCurrentImage.src = this.images[this.currentIndex];
        this.stopPlaceHolder();
        this.changing = false;
    }

    resetNav(blobsCount) {

        let vanillaSmallGalleryNav = document.getElementById("VanillaSmallGalleryNav");

        if(vanillaSmallGalleryNav == null) return;
        if(blobsCount <= 1) {
            vanillaSmallGalleryNav.style = "";
            return;
        }
        vanillaSmallGalleryNav.style = "display: block !important;";
        if(vanillaSmallGalleryNav.children.length > blobsCount) {
            let extraSpan = vanillaSmallGalleryNav.children.length-blobsCount;
            for(let i = 0; i < extraSpan; i++) {
                vanillaSmallGalleryNav.removeChild(vanillaSmallGalleryNav.children[i]);
            }
        }
        if(vanillaSmallGalleryNav.children.length < blobsCount) {
            let neededSpan = blobsCount-vanillaSmallGalleryNav.children.length;
            for(let i = 0; i < neededSpan; i++) {
                let span = document.createElement('span');
                vanillaSmallGalleryNav.appendChild(span);
            }
        }

        let selected = document.querySelectorAll('.vanilla-small-gallery-selected-nav-span');

        selected.forEach((element) => {
            element.setAttribute("class", "");
        });

        if(vanillaSmallGalleryNav.children >= this.currentIndex) return;

        vanillaSmallGalleryNav.children[this.currentIndex].setAttribute('class', 'vanilla-small-gallery-selected-nav-span');
        
        for(let i = 0; i < vanillaSmallGalleryNav.children.length; i++) {
            if(i == this.currentIndex) continue;
            vanillaSmallGalleryNav.children[i].addEventListener('click', () => {
                if(!this.changing) this.currentIndex = i;
            });
        }
    }

    resetNextAndPrevButtonDisplay(blobsCount) {
        let vanillaSmallGalleryNextButton = document.getElementById("VanillaSmallGalleryNextButton");
        let vanillaSmallGalleryPrevButton = document.getElementById("VanillaSmallGalleryPrevButton");

        if(vanillaSmallGalleryNextButton == null || vanillaSmallGalleryPrevButton == null) return;
        if(blobsCount <= 1) {
            vanillaSmallGalleryNextButton.style = "";
            vanillaSmallGalleryPrevButton.style = "";
            return;
        }
        vanillaSmallGalleryNextButton.style = "display: block !important;";
        if(this.currentIndex != 0) {
            vanillaSmallGalleryPrevButton.style = "display: block !important;";
        }

        if(this.currentIndex == 0) {
            vanillaSmallGalleryPrevButton.style = "";
        }

        if(this.currentIndex >= blobsCount-1) {
            vanillaSmallGalleryNextButton.style = "";
            return;
        }
        vanillaSmallGalleryNextButton.style = "display: block !important;";
    }

    startPlaceHolder() {
        let vanillaSmallGalleryPlaceHolder = document.getElementById("VanillaSmallGalleryPlaceHolder");
        if(vanillaSmallGalleryPlaceHolder != null) vanillaSmallGalleryPlaceHolder.setAttribute("style", "display: block !important;");
    }

    stopPlaceHolder() {
        setTimeout(() => {
            let vanillaSmallGalleryPlaceHolder = document.getElementById("VanillaSmallGalleryPlaceHolder");
            if(vanillaSmallGalleryPlaceHolder != null) vanillaSmallGalleryPlaceHolder.setAttribute("style", "");
        }, 500);
    }

    checkIfGalleryIsEmpty(blobsCount) {
        let vanillaSmallGalleryEmptyMessage = document.getElementById("VanillaSmallGalleryEmptyMessage");
        if(vanillaSmallGalleryEmptyMessage == null) return;
        if(blobsCount == 0) {
            vanillaSmallGalleryEmptyMessage.setAttribute("style", "display: block !important;");
            return;
        }
        vanillaSmallGalleryEmptyMessage.setAttribute("style", "");
    }
    
    checkIfCanRemove(blobsCount) {
        let VanillaSmallGalleryRemoveButton = document.getElementById("VanillaSmallGalleryRemoveButton");
        if(VanillaSmallGalleryRemoveButton == null) return;
        if(blobsCount == 0 || ! this.canRemove) {
            VanillaSmallGalleryRemoveButton.setAttribute("style", "");
            return;
        }
        VanillaSmallGalleryRemoveButton.setAttribute("style", "display: block !important;");
    }

}

window.customElements.define('vanilla-small-gallery', VanillaSmallGallery);