import "./../style/like.scss";

export default class VanillaItemPlaceHolder extends HTMLElement {

    constructor () {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="vanilla-like vanilla-item-placeholder">
                <div><section></section></div>
                <div><span></span><span></span></div>
                <div><button></button></div>
            </div>
        `;
    }
} 

window.customElements.define('vanilla-item-placeholder', VanillaItemPlaceHolder);