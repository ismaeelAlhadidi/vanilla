import "./main.scss";

export default class VanillaGalleryTemplate extends HTMLElement {

    static emptyMessage = "no Images or Videos now";

    constructor (images = null, videos = null, canRemove = false, templateId = 0) {
        super();
        this._images = images;
        this._videos = videos;
        this._currentIndex = 0;
        this.changing = false;
        this.canRemove = canRemove;
        this.templateId = templateId;
    }

    connectedCallback() {

        this.innerHTML = `
            <div id="VanillaGalleryTemplate${this.templateId}" class="vanilla-pop-up-container">
                <section id="VanillaGalleryTemplate${this.templateId}ExitButton" class="vanilla-pop-up-exit-button">
                    <svg viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor">
                        <path d="M13.42 12L20 18.58 18.58 20 12 13.42 5.42 20 4 18.58 10.58 12 4 5.42 5.42 4 12 10.58 18.58 4 20 5.42z"></path>
                    </svg>
                </section>
                <div class="vanilla-gallery-template vanilla-pop-up-inner-center-template">
                    <svg id="VanillaGalleryTemplate${this.templateId}RemoveButton" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor">
                        <path d="M13.42 12L20 18.58 18.58 20 12 13.42 5.42 20 4 18.58 10.58 12 4 5.42 5.42 4 12 10.58 18.58 4 20 5.42z"></path>
                    </svg>
                    <div id="VanillaInnerSmallGallery${this.templateId}">
                        <img id="VanillaGalleryTemplate${this.templateId}CurrentImage"/>
                        <video id="VanillaGalleryTemplate${this.templateId}CurrentVideo" controls></video>
                    </div>
                    <nav id="VanillaGalleryTemplate${this.templateId}Nav"></nav>
                    <section id="VanillaGalleryTemplate${this.templateId}NextButton"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg></section>
                    <section id="VanillaGalleryTemplate${this.templateId}PrevButton"><svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg></section>
                    <div id="VanillaGalleryTemplate${this.templateId}EmptyMessage" class="vanilla-gallery-template-empty-message">
                        <span>${ VanillaGalleryTemplate.emptyMessage }</span>
                    </div>
                    <div id="VanillaGalleryTemplate${this.templateId}PlaceHolder" class="vanilla-gallery-template-placeholder">
                        <div class="vanilla-gallery-template-progress loader-dual-ring"><div></div><div></div><div></div></div>
                    </div>
                </div>
            </div>
        `;

        this.style = "display: none !important";

        this.change();

        this.setEvents();
    }

    setEvents() {
        let VanillaGalleryTemplateNextButton = document.getElementById("VanillaGalleryTemplate" + this.templateId + "NextButton");
        if(VanillaGalleryTemplateNextButton != null) {
            VanillaGalleryTemplateNextButton.addEventListener('click', () => { if(!this.changing) this.currentIndex++ });
        }

        let VanillaGalleryTemplatePrevButton = document.getElementById("VanillaGalleryTemplate" + this.templateId + "PrevButton");
        if(VanillaGalleryTemplatePrevButton != null) {
            VanillaGalleryTemplatePrevButton.addEventListener('click', () => { if(!this.changing) this.currentIndex-- });
        }

        let VanillaGalleryTemplateRemoveButton = document.getElementById("VanillaGalleryTemplate" + this.templateId + "RemoveButton");
        if(VanillaGalleryTemplateRemoveButton != null) {
            VanillaGalleryTemplateRemoveButton.addEventListener('click', () => {
                if(! this.canRemove) return;

                this.remove(this.currentIndex);
            });
        }

        let VanillaGalleryTemplateExitButton = document.getElementById("VanillaGalleryTemplate" + this.templateId + "ExitButton");
        if(VanillaGalleryTemplateExitButton != null) {
            VanillaGalleryTemplateExitButton.addEventListener('click', () => {
                this.close();
            });
        }
    }

    open(index = null) {
        let vanillaGalleryTemplate = document.getElementById('VanillaGalleryTemplate' + this.templateId);
        if(vanillaGalleryTemplate == null) document.body.appendChild(this);
        this.style = "display: block !important";
        if(index != null) this.currentIndex = index;
    }

    close() {
        this.style = "display: none !important";
        this.currentIndex = 0;
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

        let imagesMaxLength = ( Array.isArray(this.images) ? this.images.length : 0 );
        let videosMaxLength = ( Array.isArray(this.videos) ? this.videos.length : 0 );
        let maxIndex = imagesMaxLength + videosMaxLength - 1;

        let valueIsInRange = ( value <= maxIndex && value > -1);

        value = ( valueIsInRange ? value : 0 );

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

        let VanillaGalleryTemplateCurrentImage = document.getElementById("VanillaGalleryTemplate" + this.templateId + "CurrentImage");
        let VanillaGalleryTemplateCurrentVideo = document.getElementById("VanillaGalleryTemplate" + this.templateId + "CurrentVideo");

        if(this.images == null || this.currentIndex >= this.images.length) {
            VanillaGalleryTemplateCurrentImage.setAttribute("style", "display: none !important;");
            
            let currentVideoIndex = this.currentIndex - ( this.images != null ? this.images.length : 0 );

            if(this.videos == null || currentVideoIndex > this.videos.length-1) {
                VanillaGalleryTemplateCurrentVideo.setAttribute("style", "display: none !important;");
                this.stopPlaceHolder();
                this.changing = false;
                return;
            }

            VanillaGalleryTemplateCurrentVideo.setAttribute("style", "display: block !important;");
            VanillaGalleryTemplateCurrentVideo.src = this.videos[currentVideoIndex];
            VanillaGalleryTemplateCurrentVideo.addEventListener('loadedmetadata', () => {
                this.stopPlaceHolder();
                this.changing = false;
            });
            return;
        }

        VanillaGalleryTemplateCurrentVideo.setAttribute("style", "display: none !important;");
        VanillaGalleryTemplateCurrentVideo.src = "";
        VanillaGalleryTemplateCurrentImage.setAttribute("style", "display: block !important;");
        VanillaGalleryTemplateCurrentImage.src = this.images[this.currentIndex];
        VanillaGalleryTemplateCurrentImage.addEventListener('load', () => {
            this.stopPlaceHolder();
            this.changing = false;
        });
    }

    resetNav(blobsCount) {

        let VanillaGalleryTemplateNav = document.getElementById("VanillaGalleryTemplate" + this.templateId + "Nav");

        if(VanillaGalleryTemplateNav == null) return;
        if(blobsCount <= 1) {
            VanillaGalleryTemplateNav.style = "";
            return;
        }
        VanillaGalleryTemplateNav.style = "display: block !important;";
        if(VanillaGalleryTemplateNav.children.length > blobsCount) {
            let extraSpan = VanillaGalleryTemplateNav.children.length-blobsCount;
            for(let i = 0; i < extraSpan; i++) {
                VanillaGalleryTemplateNav.removeChild(VanillaGalleryTemplateNav.children[i]);
            }
        }
        if(VanillaGalleryTemplateNav.children.length < blobsCount) {
            let neededSpan = blobsCount-VanillaGalleryTemplateNav.children.length;
            for(let i = 0; i < neededSpan; i++) {
                let span = document.createElement('span');
                VanillaGalleryTemplateNav.appendChild(span);
            }
        }

        let selected = document.querySelectorAll('.vanilla-gallery-template-selected-nav-span');

        selected.forEach((element) => {
            element.setAttribute("class", "");
        });

        if(VanillaGalleryTemplateNav.children >= this.currentIndex) return;

        VanillaGalleryTemplateNav.children[this.currentIndex].setAttribute('class', 'vanilla-gallery-template-selected-nav-span');
        
        for(let i = 0; i < VanillaGalleryTemplateNav.children.length; i++) {
            if(i == this.currentIndex) continue;
            VanillaGalleryTemplateNav.children[i].addEventListener('click', () => {
                if(!this.changing) this.currentIndex = i;
            });
        }
    }

    resetNextAndPrevButtonDisplay(blobsCount) {
        let VanillaGalleryTemplateNextButton = document.getElementById("VanillaGalleryTemplate" + this.templateId + "NextButton");
        let VanillaGalleryTemplatePrevButton = document.getElementById("VanillaGalleryTemplate" + this.templateId + "PrevButton");

        if(VanillaGalleryTemplateNextButton == null || VanillaGalleryTemplatePrevButton == null) return;
        if(blobsCount <= 1) {
            VanillaGalleryTemplateNextButton.style = "";
            VanillaGalleryTemplatePrevButton.style = "";
            return;
        }
        VanillaGalleryTemplateNextButton.style = "display: block !important;";
        if(this.currentIndex != 0) {
            VanillaGalleryTemplatePrevButton.style = "display: block !important;";
        }

        if(this.currentIndex == 0) {
            VanillaGalleryTemplatePrevButton.style = "";
        }

        if(this.currentIndex >= blobsCount-1) {
            VanillaGalleryTemplateNextButton.style = "";
            return;
        }
        VanillaGalleryTemplateNextButton.style = "display: block !important;";
    }

    startPlaceHolder() {
        let VanillaGalleryTemplatePlaceHolder = document.getElementById("VanillaGalleryTemplate" + this.templateId + "PlaceHolder");
        if(VanillaGalleryTemplatePlaceHolder != null) VanillaGalleryTemplatePlaceHolder.setAttribute("style", "display: block !important;");
    }

    stopPlaceHolder() {
        setTimeout(() => {
            let VanillaGalleryTemplatePlaceHolder = document.getElementById("VanillaGalleryTemplate" + this.templateId + "PlaceHolder");
            if(VanillaGalleryTemplatePlaceHolder != null) VanillaGalleryTemplatePlaceHolder.setAttribute("style", "");
        }, 300);
    }

    checkIfGalleryIsEmpty(blobsCount) {
        let VanillaGalleryTemplateEmptyMessage = document.getElementById("VanillaGalleryTemplate" + this.templateId + "EmptyMessage");
        if(VanillaGalleryTemplateEmptyMessage == null) return;
        if(blobsCount == 0) {
            VanillaGalleryTemplateEmptyMessage.setAttribute("style", "display: block !important;");
            return;
        }
        VanillaGalleryTemplateEmptyMessage.setAttribute("style", "");
    }
    
    checkIfCanRemove(blobsCount) {
        let VanillaGalleryTemplateRemoveButton = document.getElementById("VanillaGalleryTemplate" + this.templateId + "RemoveButton");
        if(VanillaGalleryTemplateRemoveButton == null) return;
        if(blobsCount == 0 || ! this.canRemove) {
            VanillaGalleryTemplateRemoveButton.setAttribute("style", "");
            return;
        }
        VanillaGalleryTemplateRemoveButton.setAttribute("style", "display: block !important;");
    }

}

window.customElements.define('vanilla-gallery-template', VanillaGalleryTemplate);