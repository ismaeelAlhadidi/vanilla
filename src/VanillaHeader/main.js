import "./main.scss";

import VanillaList from "./../VanillaList/main";
import VanillaNotifications from "./../VanillaNotifications/main";

export default class VanillaHeader extends HTMLElement {


    static logo = "https://homepages.cae.wisc.edu/~ece533/images/arctichare.png";
    static defaultProfilePicture = "https://homepages.cae.wisc.edu/~ece533/images/airplane.png";
    static profileUrl = "";
    static logoutUrl = "";

    static get observedAttributes() {
        return ['picture', 'notifications', 'categories', 'username', 'logo'];
    }

    constructor (logo = null) {
        super();
        // create two elements //
        this.vanillaCategoriesList = new VanillaList(0, "categories");
        this.vanillaUserList = new VanillaList(1, this.userName, [
            { text: 'view profile', url: VanillaList.profileUrl },
            { text: 'logout', url: VanillaHeader.logoutUrl }
        ]);
        this.vanillaUserList.setAttribute("class", this.vanillaUserList.getAttribute("class") + " vanilla-header-user-list");
        this.vanillaNotifications = new VanillaNotifications();

        this._profilePictureElement = null;

        this._logo = logo;
    }

    connectedCallback() {
        this.innerHTML = `<div id="VanillaHeader" class="vanilla-header">
            <div class="vanilla-container">
                
                <section><img id="VanillaHeaderProfilePicture" src="${ ( this.profilePicture == undefined || this.profilePicture == null ) ? VanillaHeader.defaultProfilePicture : this.profilePicture }"/></section>
                
                <div>
                    <section id="VanillaCategoriesListButton">
                        <div>
                            <svg>
                                <path fill="currentColor" d="M10 10h4v4h-4v-4zm0 11h4v-4h-4v4zm-7-7h4v-4H3v4zm0 7h4v-4H3v4zM3 7h4V3H3v4zm14 7h4v-4h-4v4zm0-11v4h4V3h-4zm-7 4h4V3h-4v4zm7 14h4v-4h-4v4z"></path>
                            </svg>
                        </div>
                        <span>Categories</span>
                    </section>
                    <section id="VanillaNotificationsButton">
                        <div>
                            <svg>
                                <path fill="currentColor" d="M21.4 17L20.7 15.6L5.2 12.2L4 13.1C3 13.9 2.4 14.7 2.2 15.6L2 16.6L21.7 21L21.9 20C22 19.7 22 19.5 22 19.2C22 18.5 21.8 17.8 21.4 17Z"></path>
                                <path fill="currentColor" d="M20.5 8.8C20.8 5.7 18.7 2.8 15.6 2.1C15.1 2 14.6 2 14.2 2C11.6 2 9.19999 3.6 8.29999 6.1L6.29999 11.4L20.1 14.5L20.5 8.8Z"></path>
                                <path fill="currentColor" d="M11 20C11 21.1 11.9 22 13 22C14.1 22 15 21.1 15 20C15 19.8 15 19.7 14.9 19.5L11.4 18.7C11.2 19.1 11 19.5 11 20Z"></path>
                            </svg>
                        </div>
                        <span>Notifications</span>
                    </section>
                </div>

                <div class="vanilla-header-logo"><a><img id="VanillaHeaderLogo" src="${ ( this.logo == null || this.logo == undefined ) ? VanillaHeader.logo : this.logo }"/></a></div>
            </div>
        </div>`;

        this.setAttributes();
        this.setEvents();
    }

    setEvents() {
        let VanillaCategoriesListButton = document.getElementById("VanillaCategoriesListButton");
        let VanillaNotificationsButton = document.getElementById("VanillaNotificationsButton");
        let VanillaHeaderProfilePicture = document.getElementById("VanillaHeaderProfilePicture");

        if(VanillaCategoriesListButton != null) VanillaCategoriesListButton.addEventListener('click', () => {
            if(this.vanillaCategoriesList.isOpend) {

                this.vanillaCategoriesList.close();
                return;
            }
            if(this.vanillaNotifications.isOpend && VanillaNotificationsButton != null) this.vanillaNotifications.close();
            if(this.vanillaUserList.isOpend && VanillaHeaderProfilePicture != null) this.vanillaUserList.close();
            this.vanillaCategoriesList.open();
        });

        if(VanillaHeaderProfilePicture != null) {
            VanillaHeaderProfilePicture.addEventListener('click', () => {
                if(this.vanillaUserList.isOpend) {

                    this.vanillaUserList.close();
                    return;
                }
                if(this.vanillaNotifications.isOpend && VanillaNotificationsButton != null) this.vanillaNotifications.close();
                if(this.vanillaCategoriesList.isOpend && VanillaCategoriesListButton != null) this.vanillaCategoriesList.close();
                this.vanillaUserList.open();
            });
            this._profilePictureElement = VanillaHeaderProfilePicture;
            if ( this._profilePictureElement.src != this.profilePicture ) this.profilePicture = this.profilePicture;
        }

        if(VanillaNotificationsButton != null) VanillaNotificationsButton.addEventListener('click', () => {
            if(this.vanillaNotifications.isOpend) {

                this.vanillaNotifications.close();
                return;
            }
            if(this.vanillaCategoriesList.isOpend && VanillaCategoriesListButton != null) this.vanillaCategoriesList.close();
            if(this.vanillaUserList.isOpend && VanillaHeaderProfilePicture != null) this.vanillaUserList.close();
            this.vanillaNotifications.open();
        });
    }

    setAttributes () {
        if(this.getAttribute('picture') != null && this.getAttribute('picture') != undefined){
            this.profilePicture = this.getAttribute('picture');
        }
        if(this.getAttribute('notifications') != null && this.getAttribute('notifications') != undefined){
            this.notifications = this.getAttribute('notifications');
        }
        if(this.getAttribute('categories') != null && this.getAttribute('categories') != undefined){
            this.categories = this.getAttribute('categories');
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name == "picture") {
            this.profilePicture = newValue;
        }
        if(name == "notifications") {
            this.notifications = newValue;
        }
        if(name == "categories") {
            this.categories = newValue;
        }
        if(name == "username") {
            this.userName = newValue;
        }
        if(name == "logo") {
            this.logo = newValue;
        }
    }

    get profilePicture() { return this._profilePicture; }
    set profilePicture(value) {
        if(value == null || value == undefined) return;

        let profilePictureElement = this.profilePictureElement;

        console.log(profilePictureElement);

        if(profilePictureElement != null) profilePictureElement.src = value;

        this._profilePicture = value;
    }

    get userName() { return this._userName; }
    set userName(value) {
        if(value == null || value == undefined) return;
        this.vanillaUserList.title = value;
        this._userName = value;
    }

    get notifications() { return this.vanillaNotifications.notifications.values(); }
    set notifications(value) {
        let valueAfterParsing = null;
        try {
            valueAfterParsing = JSON.parse(value);
        } catch {

            return;
        }
        if(! Array.isArray(valueAfterParsing)) return;

        this.vanillaNotifications.pushAll(valueAfterParsing);
    }

    get categories() { return this.vanillaCategoriesList.list; }
    set categories(value) {

        let valueAfterParsing = null;

        try {

            valueAfterParsing = JSON.parse(value);

        } catch {

            return;
        }

        if(! Array.isArray(valueAfterParsing)) return;

        this.vanillaCategoriesList.list = valueAfterParsing;
    }

    get profilePictureElement() {

        if(this._profilePictureElement == null) {

            if(this.children.length < 1) return null;

            if(this.children[0].children.length < 1) return null;

            if(this.children[0].children[0].children.length < 1) return null;

            if(this.children[0].children[0].children[0].children.length < 1) return null;

            this._profilePictureElement = this.children[0].children[0].children[0].children[0];
        }


        return this._profilePictureElement;
    }


    get logo () { return this._logo; }
    set logo (value) {

        let VanillaHeaderLogo = document.getElementById('VanillaHeaderLogo');

        if(VanillaHeaderLogo != null) VanillaHeaderLogo.src = value;

        this._logo = value;
    }
}

window.customElements.define('vanilla-header', VanillaHeader);