import "./main.scss";

import VanillaSmallGallery from "../VanillaSmallGallery/main";
import VanillaCropper from "../VanillaCropper/main";
import VanillaPopup from "../VanillaPopup/main";

export default class VanillaAddPostTemplate extends HTMLElement {

    static title = "Add post";
    static addImageButtonText = "Add Image";
    static addVideoButtonText = "Add Video";
    static postButtonText = "POST";
    static contentPlaceHolder = "what are you thinking about ? What is your comment on these drawings ? What do you think about your drawing ?";
    static imageWidth = 300;
    static imageHeight = 350;
    static maxVideosDuration = 60;

    constructor (imagesMaxCount = 1, videosMaxCount = 1, categories = null, cropp = true, templateId = 0) {
        super();
        this.vanillaPopup = new VanillaPopup();
        this.vanillaCropper = new VanillaCropper();
        this.imagesMaxCount = imagesMaxCount;
        this.videosMaxCount = videosMaxCount;
        this.categories = categories;
        this.cropp = cropp;
        this.templateId = templateId;

        this.gallery = new VanillaSmallGallery('100%', '100%', null, null, true, templateId);
        this.gallery.style = `width: ${VanillaAddPostTemplate.imageWidth}px; height: ${VanillaAddPostTemplate.imageHeight}px`;
    }

    connectedCallback() {

        this.innerHTML = `
            <div id="VanillaAddPostTemplate${this.templateId}" class="vanilla-add-post-template">
                <div>
                    <header>
                        <span>${ VanillaAddPostTemplate.title }</span>
                        <svg id="VanillaAddPostTemplate${this.templateId}ExitButton" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="exit-icon">
                            <path d="M13.42 12L20 18.58 18.58 20 12 13.42 5.42 20 4 18.58 10.58 12 4 5.42 5.42 4 12 10.58 18.58 4 20 5.42z"></path>
                        </svg>
                    </header>
                    <div id="outerVanillaSmallGallery${this.templateId}">
                        <div><button id="VanillaAddPostTemplate${this.templateId}AddImageButton">${ VanillaAddPostTemplate.addImageButtonText }</button><button id="VanillaAddPostTemplate${this.templateId}AddVideoButton">${ VanillaAddPostTemplate.addVideoButtonText }</button></div>
                    </div>
                    <div>
                        <section><textarea id="VanillaAddPostTemplate${this.templateId}Content" placeholder="${ VanillaAddPostTemplate.contentPlaceHolder }"></textarea></section>
                        <section><select id="VanillaAddPostTemplate${this.templateId}Categories"></select></section>
                        <section><button id="VanillaAddPostTemplate${this.templateId}PostButton">${ VanillaAddPostTemplate.postButtonText }</button></section>
                    </div>
                </div>
                <input id="VanillaAddPostTemplate${this.templateId}Images" type="file" accept="image/*" />
                <input id="VanillaAddPostTemplate${this.templateId}Videos" type="file" accept="video/*" />
            </div>
        `;

        this.style = "display: none !important;";

        let outerVanillaSmallGallery = document.getElementById("outerVanillaSmallGallery" + this.templateId);
        if(outerVanillaSmallGallery != null) {
            if(outerVanillaSmallGallery.children.length > 0) {

                outerVanillaSmallGallery.insertBefore(this.gallery, outerVanillaSmallGallery.children[0]);

            } else outerVanillaSmallGallery.appendChild(this.gallery);
        }

        this.setEvents();

        this.reset();
    }

    setEvents() {

        let VanillaAddPostTemplateExitButton = document.getElementById("VanillaAddPostTemplate" + this.templateId + "ExitButton");

        if(VanillaAddPostTemplateExitButton != null) {
            VanillaAddPostTemplateExitButton.addEventListener('click', () => {
                this.vanillaPopup.confirm("exit add post template", "Do you wan't to close this template ?").then((result) => {
                    if(result) {
                        this.close();
                        this.exitWithoutPostCallBack();
                    }
                });
            });
        }

        let VanillaAddPostTemplateAddImageButton = document.getElementById("VanillaAddPostTemplate" + this.templateId + "AddImageButton");
        let VanillaAddPostTemplateImages = document.getElementById("VanillaAddPostTemplate" + this.templateId + "Images");

        if(VanillaAddPostTemplateAddImageButton != null && VanillaAddPostTemplateImages != null) {
            VanillaAddPostTemplateAddImageButton.addEventListener('click', () => {
                if(this.imagesMaxCount <= ( this.gallery.images != null ? this.gallery.images.length : 0 )) {
                    this.vanillaPopup.alert("", this.imagesMaxCount + ` is max number of images you can upload in one post ! 
                    you can add many posts`, "ok");
                    return;
                }
                VanillaAddPostTemplateImages.click();
            });
            VanillaAddPostTemplateImages.addEventListener('change', (event) => {

                if(! event.target.files[0]) return;

                let fileReader = new FileReader();
                if(! this.cropp) {
                    this.loadFileReader(fileReader, event.target.files[0]).then((event) => {
                        this.gallery.addImage(event.target.result);
                    });
                    return;
                }
                this.loadFileReader(fileReader, event.target.files[0]).then((event) => {
                    let image = new Image();
                    return this.loadImage(image, event.target.result);
                }).then((event) => {
                    this.vanillaCropper.start(event.target, VanillaAddPostTemplate.imageWidth, VanillaAddPostTemplate.imageHeight, 
                        ( cropedImage ) => {
                            this.gallery.addImage(cropedImage.src);
                        },
                        null,
                        () => {
                            this.vanillaPopup.alert("error in crop image", "crop failed please try agin !", "ok");
                        }
                    );
                }).catch( () => {
                    this.vanillaPopup.alert("error in select image", "select image failed please try agin !", "ok");
                });
            });
        }

        let VanillaAddPostTemplateAddVideoButton = document.getElementById("VanillaAddPostTemplate" + this.templateId + "AddVideoButton");
        let VanillaAddPostTemplateVideos = document.getElementById("VanillaAddPostTemplate" + this.templateId + "Videos");

        if(VanillaAddPostTemplateAddVideoButton != null && VanillaAddPostTemplateVideos != null) {
            VanillaAddPostTemplateAddVideoButton.addEventListener('click', () => {
                if(this.videosMaxCount <= ( this.gallery.videos != null ? this.gallery.videos.length : 0 )) {
                    this.vanillaPopup.alert("", this.videosMaxCount + ` is max number of videos you can upload in one post ! 
                    you can add many posts`, "ok");
                    return;
                }
                VanillaAddPostTemplateVideos.click();
            });
            VanillaAddPostTemplateVideos.addEventListener('change', (event) => {
                
                if(! event.target.files[0]) return;

                let fileReader = new FileReader();
                this.loadFileReader(fileReader, event.target.files[0]).then((event) => {

                    var video = document.createElement('video');
                    video.setAttribute("preload", "metadata");
                    video.src = event.target.result;
                    video.addEventListener('loadedmetadata', () => {

                        if(video.duration > VanillaAddPostTemplate.maxVideosDuration) {

                            this.vanillaPopup.alert("", VanillaAddPostTemplate.maxVideosDuration + " seconds is max duration of video ! please select another video or separate it");

                            return;
                        }

                        this.gallery.addVideo(event.target.result);
                    });
                });
            });
        }

        let VanillaAddPostTemplatePostButton = document.getElementById("VanillaAddPostTemplate" + this.templateId + "PostButton");
        if(VanillaAddPostTemplatePostButton != null) {
            VanillaAddPostTemplatePostButton.addEventListener('click', () => {
                
                if( ( ! Array.isArray(this.gallery.images) ? true : this.gallery.images.length < 1 ) &&
                    ( ! Array.isArray(this.gallery.videos) ? true : this.gallery.videos.length < 1 ) ) {
                    
                    this.vanillaPopup.alert("", ` you must upload one or more images or videos with post !`, "ok");
                    return;
                }

                let content = "";
                let VanillaAddPostTemplateContent = document.getElementById("VanillaAddPostTemplate" + this.templateId + "Content");
                if(VanillaAddPostTemplateContent != null) content = VanillaAddPostTemplateContent.textContent;

                let category = null;
                if(Array.isArray(this.categories)) {
                    let VanillaAddPostTemplateCategories = document.getElementById("VanillaAddPostTemplate" + this.templateId + "Categories");
                    if(VanillaAddPostTemplateCategories != null) {
                        category = VanillaAddPostTemplateCategories.value;
                    }
                }

                this.close();
                this.postCallBack(this.gallery.images, this.gallery.videos, content, category);
            });
        }
    }

    reset() {

        let VanillaAddPostTemplateCategories = document.getElementById("VanillaAddPostTemplate" + this.templateId + "Categories");
        if(VanillaAddPostTemplateCategories != null) {
            if(! Array.isArray(this.categories)) {
                VanillaAddPostTemplateCategories.style = "display: none !important;";
                return;
            }
            if(VanillaAddPostTemplateCategories.children.length > 0) {
                while(VanillaAddPostTemplateCategories.children.length > 0) {
                    VanillaAddPostTemplateCategories.removeChild(VanillaAddPostTemplateCategories.children[0]);
                }
            }
            for(let i = 0; i < this.categories.length; i++) {
                let option = document.createElement("option");
                option.value = this.categories[i];
                option.textContent = this.categories[i];
                VanillaAddPostTemplateCategories.appendChild(option);
            }
        }

        let VanillaAddPostTemplateContent = document.getElementById("VanillaAddPostTemplate" + this.templateId + "Content");
        if(VanillaAddPostTemplateContent != null) {
            VanillaAddPostTemplateContent.textContent = "";
        }

        this.gallery.clear();
    }
    
    open() {        
        let vanillaAddPostTemplate = document.getElementById("VanillaAddPostTemplate" + this.templateId);
        if(vanillaAddPostTemplate == null) {
            document.body.appendChild(this);
        }
        this.reset();
        this.style = "display: block !importent;";

        return new Promise((resolve, reject) => {

            this.postCallBack = resolve;

            this.exitWithoutPostCallBack = reject;
        });
    }

    close() {
        this.style = "display: none !important;";
    }

    loadImage(image, src) {

        return new Promise((resolve) => {
            image.addEventListener('load', resolve);
            image.src = src;
        });
    }

    loadFileReader(fileReader, file) {

        return new Promise((resolve) => {
            fileReader.readAsDataURL(file);
            fileReader.addEventListener('load', resolve);
        });
    }
}

window.customElements.define('vanilla-add-post-template', VanillaAddPostTemplate);