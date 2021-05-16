import "./../style/confirm.scss";

export default class VanillaConfirm extends HTMLElement {

    static defaultZIndex = 10;

    constructor (title = "title", message = "message", yesButtonText = "YES", noButtonText = "NO", resultHandler = null) {
        super();
        this._title = title;
        this._message = message;
        this._yesButtonText = yesButtonText;
        this._noButtonText = noButtonText;
        this._resultHandler = resultHandler;
        this._trueResultCallBack = null;
        this._falseResultCallBack = null;
    }

    connectedCallback() {

        this.innerHTML = `
            <div id="VanillaConfirm" class="vanilla-center-pop-up vanilla-confirm" style="z-index: ${ VanillaConfirm.defaultZIndex };">
                <div>
                    <header>
                        <div><span id="VanillaConfirmTitle">${ this.title }</span></div>
                    </header>
                    <main>
                        <p id="VanillaConfirmMessage">${ this.message }</p>
                    </main>
                    <footer>
                        <button id="VanillaConfirmYesButton">${ this.yesButtonText }</button>
                        <button id="VanillaConfirmNoButton">${ this.noButtonText }</button>
                    </footer>
                </div>
            </div>
        `;

        let yesButton = document.getElementById('VanillaConfirmYesButton');
        let noButton = document.getElementById('VanillaConfirmNoButton');

        if(yesButton != null) {
            yesButton.addEventListener('click', () => {
                this.close();
            });
        }

        if(noButton != null) {
            noButton.addEventListener('click', () => {
                this.close();
            });
        }
       
        this.resultHandler = this._resultHandler;
    }

    open(title = null, message = null, yesButtonText = null, noButtonText = null, resultHandler = null) {

        if(title != null) this.title = title;
        if(message != null) this.message = message;
        if(yesButtonText != null) this.yesButtonText = yesButtonText;
        if(noButtonText != null) this.noButtonText = noButtonText;
        if(resultHandler != null) {
            this._trueResultCallBack = null;
            this._falseResultCallBack = null;
            this.resultHandler = resultHandler;
        }

        let VanillaConfirm = document.getElementById('VanillaConfirm');
        if(VanillaConfirm == null) document.body.appendChild(this);
        this.style = "display: block !important;";
    }

    close() {

        this.style = "display: none !important;";
    }

    get title () { return this._title; }
    set title (value) {
        let title = document.getElementById('VanillaConfirmTitle');
        if(title != null) title.textContent = value;
        this._title = value;
    }

    get message () { return this._message; }
    set message (value) {
        let message = document.getElementById('VanillaConfirmMessage');
        if(message != null) message.textContent = value;
        this._message = value;
    }

    get yesButtonText () { return this._yesButtonText; }
    set yesButtonText (value) {
        let yesButton = document.getElementById('VanillaConfirmYesButton');
        if(yesButton != null) yesButton.textContent = value;
        this._yesButtonText = value;
    }

    get noButtonText () { return this._noButtonText; }
    set noButtonText (value) {
        let noButton = document.getElementById('VanillaConfirmNOButton');
        if(noButton != null) noButton.textContent = value;
        this._noButtonText = value;
    }

    get resultHandler () { return this._resultHandler; }
    set resultHandler (value) {

        let yesButton = document.getElementById('VanillaConfirmYesButton');
        let noButton = document.getElementById('VanillaConfirmNoButton');

        this._resultHandler = value;

        if(this.trueResultCallBack != null){
            yesButton.removeEventListener('click', this.trueResultCallBack);
        }

        if(this.falseResultCallBack != null) {
            noButton.removeEventListener('click', this.falseResultCallBack);
        }

        this.trueResultCallBack = () => {
            this.resultHandler(true);
        };

        this.falseResultCallBack = () => {
            this.resultHandler(false);
        };

        if(yesButton != null) {

            yesButton.addEventListener('click', this.trueResultCallBack);
        }

        if(noButton != null) {

            noButton.addEventListener('click', this.falseResultCallBack);
        }
    }

    get trueResultCallBack () { return this._trueResultCallBack; }
    set trueResultCallBack (value) { this._trueResultCallBack = value; }

    get falseResultCallBack () { return this._falseResultCallBack; }
    set falseResultCallBack (value) { this._falseResultCallBack = value; }

}

window.customElements.define('vanilla-confirm', VanillaConfirm);