import "./../style/notification.scss";

export default class VanillaNotificationPlaceHolder extends HTMLElement {

    constructor () {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<div class="vanilla-notification vanilla-notification-place-holder">
            <div><section></section></div>
            <div>
                <section><section></section><section></section></section>
                <div><span></span></dvi>
            </div>
        </div>`;
    }


}

window.customElements.define('vanilla-notification-place-holder', VanillaNotificationPlaceHolder);