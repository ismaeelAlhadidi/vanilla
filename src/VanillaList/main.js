import "./main.scss";


export default class VanillaList extends HTMLElement {

    constructor (id, title, list = null) {
        super();
        this._title = title;
        this.id = id;
        this._list = list;
    }

    connectedCallback() {
        this.innerHTML = `<div id="VanillaList${ this.id }" class="vanilla-list">
            <header>
                <span id="VanillaList${ this.id }Title">${ this.title }</span>
                <svg id="VanillaList${ this.id }ExitButton" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="exit-icon">
                    <path d="M13.42 12L20 18.58 18.58 20 12 13.42 5.42 20 4 18.58 10.58 12 4 5.42 5.42 4 12 10.58 18.58 4 20 5.42z"></path>
                </svg>
            </header>
            <main id="VanillaList${ this.id }InnerTemplate">
            </main>
        </div>`;

        this.style = "display: none !important;";

        let exitButton = document.getElementById(`VanillaList${ this.id }ExitButton`);
        if(exitButton != null) {
            exitButton.addEventListener('click', () => { this.close() })
        }

        this.setList();
    }

    add(text, url) {

        if(! Array.isArray(this.list)) {
            
            this.list = [{text, url}];
            return;
        }

        if(! this.isConnected) {

            document.body.appendChild(this);
        }

        let VanillaListInnerTemplate = document.getElementById(`VanillaList${ this.id }InnerTemplate`);
        
        if(VanillaListInnerTemplate == null) return;

        VanillaListInnerTemplate.appendChild(this.createListElement(text, url));

        this.list.push({ text, url });
    }

    open() {

        let VanillaList = document.getElementById(`VanillaList${ this.id }`);

        if(VanillaList == null) document.body.appendChild(this);

        this.style = "";
        this.isOpend = true;
    }

    close() {
        this.style = "display: none !important;";
        this.isOpend = false;
    }

    createListElement(text, url) {
        let div = document.createElement('div');
        div.innerHTML = `<a href="${ url }">${ text }</a>`;

        return div;
    }

    setList () {
        if(! Array.isArray(this.list)) return;

        let VanillaListInnerTemplate = document.getElementById(`VanillaList${ this.id }InnerTemplate`);

        let parent = document.getElementById(`VanillaList${ this.id }`);

        if(parent == null) return;

        if(VanillaListInnerTemplate != null) {
            parent.removeChild(VanillaListInnerTemplate);
        }

        VanillaListInnerTemplate = document.createElement('main');
        VanillaListInnerTemplate.setAttribute('id', `VanillaList${ this.id }InnerTemplate`);

        parent.appendChild(VanillaListInnerTemplate);

        for(let i = 0; i < this.list.length; i++) {
            VanillaListInnerTemplate.appendChild(this.createListElement(this.list[i].text, this.list[i].url));
        }
        
    }

    get title () { return this._title; }
    set title (value) {
        let VanillaListTitle = document.getElementById(`VanillaList${ this.id }Title`);
        if(VanillaListTitle != null) VanillaListTitle.textContent = value;

        this._title = value;
    }

    get list() { return this._list; }
    set list(value) {
        this._list = value;
        this.setList();
    }
}

window.customElements.define('vanilla-list', VanillaList);
