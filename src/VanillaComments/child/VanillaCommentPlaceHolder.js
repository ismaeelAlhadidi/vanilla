import "./../style/comment.scss";

export default class VanillaCommentPlaceHolder extends HTMLElement {

    static maxLines = 5;

    constructor (content = null, random = false) {
        super();
        // TODO: create in paragraph spans[lines] like content


        this.random = random;
    }

    connectedCallback() {
        this.innerHTML =`
        <div class="vanilla-comment vanilla-comment-placeholder">
            <div id="">
                <div><section></section></div>
                <div>
                    <div>
                        <span></span>
                        <span></span>
                    </div>
                    <p class="vanilla-comment-placeholder-content-p">
                        <span></span>
                        <span></span>
                        <span></span>
                    </p>
                </div>
            </div>
        </div>
        `;

        if(! this.random) return;

        this.setRandomCountOfLines();
    }

    setRandomCountOfLines() {

        let p = this.children[0].children[0].children[1].children[1];

        if(p == null) return;

        while(p.children.length > 0) p.removeChild(p.children[0]);

        let randomLines = Math.floor(Math.random() * VanillaCommentPlaceHolder.maxLines-1) + 2;

        let lastSpan = null;

        for(let i = 0; i < randomLines; i++) {
            let span = document.createElement('span');
            p.appendChild(span);
            if(i == randomLines-1) lastSpan = span;
        }

        if(lastSpan == null) return;

        let lastSpanWidth = Math.floor(Math.random() * 60) + 15;

        lastSpan.style = "width: " + lastSpanWidth + "% !important;";
    }
}
window.customElements.define('vanilla-comment-placeholder', VanillaCommentPlaceHolder);