
import VanillaCommentPlaceHolder from "./VanillaCommentPlaceHolder";


export default class VanillaReplyPlaceHolder extends VanillaCommentPlaceHolder {

    constructor(content = null, random = false) {
        super(content, random);
    }

    connectedCallback() {
        super.connectedCallback();

        this.setAttribute('class', 'vanilla-replay-placeholder');
    }
}

window.customElements.define('vanilla-replay-placeholder', VanillaReplyPlaceHolder);