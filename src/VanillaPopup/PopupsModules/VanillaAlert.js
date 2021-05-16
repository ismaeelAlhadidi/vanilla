import "./../style/main.scss";

export default class VanillaAlert extends HTMLElement {

    static defaultZIndex = 10;

    constructor (title = "title", message = "message", okButtonText = "Ok", okButtonClickHandler = null) {
        super();
        this._title = title;
        this._message = message;
        this._okButtonText = okButtonText;
        this._okButtonClickHandler = okButtonClickHandler;
    }

    connectedCallback() {

        this.innerHTML = `
            <div id="VanillaAlert" class="vanilla-center-pop-up vanilla-alert" style="z-index:${ VanillaAlert.defaultZIndex };">
                <div>
                    <header>
                        <div><span id="VanillaAlertTitle">${ this.title }</span></div>
                    </header>
                    <main>
                        <p id="VanillaAlertMessage">${ this.message }</p>
                    </main>
                    <footer>
                        <button id="VanillaAlertOkButton">${ this.okButtonText }</button>
                    </footer>
                </div>
            </div>
        `;
        let okButton = document.getElementById('VanillaAlertOkButton');

        if(okButton != null) {

            if(this.okButtonClickHandler != null) {

                okButton.addEventListener('click', this.okButtonClickHandler);
            }
            okButton.addEventListener('click', () => {

                this.close();
            });
        }
    }

    open(title = null, message = null, okButtonText = null, okButtonClickHandler = null) {

        if(title != null) this.title = title;
        if(message != null) this.message = message;
        if(okButtonText != null) this.okButtonText = okButtonText;
        if(okButtonClickHandler != null) this.okButtonClickHandler = okButtonClickHandler;
        let VanillaAlert = document.getElementById('VanillaAlert');
        if(VanillaAlert == null) document.body.appendChild(this);
        this.style = "display: block !important;";
    }

    close() {

        this.style = "display: none !important;";
    }

    get title () { return this._title; }
    set title (value) {
        let title = document.getElementById('VanillaAlertTitle');
        if(title != null) title.textContent = value;
        this._title = value;
    }

    get message () { return this._message; }
    set message (value) {
        let message = document.getElementById('VanillaAlertMessage');
        if(message != null) message.textContent = value;
        this._message = value;
    }

    get okButtonText () { return this._okButtonText; }
    set okButtonText (value) {
        let okButton = document.getElementById('VanillaAlertOkButton');
        if(okButton != null) okButton.textContent = value;
        this._okButtonText = value;
    }
    
    get okButtonClickHandler () { return this._okButtonClickHandler; }
    set okButtonClickHandler (value) {
        let okButton = document.getElementById('VanillaAlertOkButton');
        if(okButton != null) {
            if(this._okButtonClickHandler != null) okButton.removeEventListener('click', this._okButtonClickHandler);
            this._okButtonClickHandler = value;
            okButton.addEventListener('click', this._okButtonClickHandler);
        }
    }

}

window.customElements.define('vanilla-alert', VanillaAlert);