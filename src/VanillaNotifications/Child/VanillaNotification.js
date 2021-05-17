import "./../style/notification.scss";

export default class VanillaNotification extends HTMLElement {

    static maxContentSize = 75;

    constructor (id, content, image, time, readed, clickHandler = null) {
        super();
        this.id = id;
        this._content = content;
        this._image = image;
        this._time = time;
        this._readed = readed;
        this._clickHandler = clickHandler;
    }

    connectedCallback() {
        this.innerHTML = `<div id="VanillaNotification${ this.id }" class="vanilla-notification${( this.readed ? "" : " vanilla-notification-not-readed")}">
            <div><img id="VanillaNotification${ this.id }Image" src="${ this.image }"/></div>
            <div>
                <p id="VanillaNotification${ this.id }Content">${ this.transformContent(this.content) }</p>
                <div><span id="VanillaNotification${ this.id }Time">${ this.time }</span></dvi>
            </div>
        </div>`;


        let notificationElement = document.getElementById("VanillaNotification" + this.id);
        if(notificationElement != null) {
            if(this.clickHandler != null) {
                notificationElement.addEventListener('click', this.clickHandler);
            }
            notificationElement.addEventListener('click', () => {
                this.readed = true;
            });
        }
    }

    transformContent(content) {
        if(content.length > VanillaNotification.maxContentSize){

            return content.substring(0, VanillaNotification.maxContentSize-3) + "...";
        }
        return content;
    }

    get content () { return this._content; }
    set content (value) {
        let contentElement = document.getElementById("VanillaNotification" + this.id + "Content");
        if(contentElement != null) contentElement.textContent = this.transformContent(value);
        this._content = value;
    }

    get image () { return this._image; }
    set image (value) {
        let imageElement = document.getElementById("VanillaNotification" + this.id + "Image");
        if(imageElement != null) imageElement.src = value;
        this._image = value;
    }

    get time () { return this._time; }
    set time (value) {
        let timeElement = document.getElementById("VanillaNotification" + this.id + "Time");
        if(timeElement != null) timeElement.textContent = value;
        this._time = value;
    }

    get readed () { return this._readed; }
    set readed (value) {
        let notificationElement = document.getElementById("VanillaNotification" + this.id);
        if(notificationElement != null) notificationElement.setAttribute("class", "vanilla-notification" + ( value ? "" : " vanilla-notification-not-readed" ));
        this._readed = value;
    }

    get clickHandler () { return this._clickHandler; }
    set clickHandler (value) {
        let notificationElement = document.getElementById("VanillaNotification" + this.id);
        if(notificationElement != null) {
            if(this.clickHandler != null) notificationElement.removeEventListener('click', this.clickHandler);
            if(value != null)notificationElement.addEventListener('click', value);
        }
        this._clickHandler = value;
    }

}
window.customElements.define('vanilla-notification', VanillaNotification);