import "./style/main.scss";
import VanillaNotification from "./child/VanillaNotification";
import VanillaNotificationPlaceHolder from "./child/VanillaNotificationPlaceHolder";

export default class VanillaNotifications extends HTMLElement {

    static title = "Notifications";
    static emptyMessage = "no Notifications now";

    constructor (unReadedChangedCallBack = null) {
        super();

        this.notifications = new Map();

        this._unReadedCount = 0;

        this.unReadedChangedCallBack = unReadedChangedCallBack;

        /* for fetch */
        this.url = null;
        this.page = null;
        this.haveMore = false;
        this.fetching = false;
    }

    connectedCallback() {
        this.innerHTML = `<div id="VanillaNotifications" class="vanilla-notifications">
            <header>
                <span>${ VanillaNotifications.title }</span>
                <svg id="VanillaNotificationsExitButton" viewBox="0 0 24 24" data-supported-dps="24x24" fill="currentColor" class="exit-icon">
                    <path d="M13.42 12L20 18.58 18.58 20 12 13.42 5.42 20 4 18.58 10.58 12 4 5.42 5.42 4 12 10.58 18.58 4 20 5.42z"></path>
                </svg>
            </header>
            <main id="VanillaInnerNotificationsTemplate">
                <div id="VanillNotificationsEmptyMessage" class="empty-message">
                    <span>${ VanillaNotifications.emptyMessage }</span>
                </div>
            </main>
        </div>`;
        this.style = "display: none !important;";

        let exitButton = document.getElementById("VanillaNotificationsExitButton");
        if(exitButton != null) {
            exitButton.addEventListener('click', () => { this.close() })
        }

        let vanillaNotifications = document.getElementById("VanillaNotifications");
        if(vanillaNotifications != null) {
            vanillaNotifications.addEventListener('scroll', this.onScroll);
        }
    }

    push(id, content, image, time, readed, clickHandler) {

        if(this.notifications.has(id)) return;

        let innerNotificationsTemplate = document.getElementById('VanillaInnerNotificationsTemplate');
        if(innerNotificationsTemplate == null) {
            document.body.appendChild(this);
        }
        innerNotificationsTemplate = document.getElementById('VanillaInnerNotificationsTemplate');

        let notification = new VanillaNotification(id, content, image, time, readed, clickHandler);
        
        this.notifications.set(id, notification);

        if(! readed) this.unReadedCount++;

        let emptyMessage = document.getElementById('VanillNotificationsEmptyMessage');
        if(emptyMessage != null) {
            innerNotificationsTemplate.removeChild(emptyMessage);
        }

        if(innerNotificationsTemplate.children.length > 0) {

            innerNotificationsTemplate.insertBefore(notification, innerNotificationsTemplate.firstChild);
            return;
        }
        innerNotificationsTemplate.appendChild(notification);
    }

    pop(id) {
        if(! this.notifications.has(id)) return;

        let innerNotificationsTemplate = document.getElementById('VanillaInnerNotificationsTemplate');

        if(innerNotificationsTemplate == null) return;

        let notification = this.notifications.get(id);

        if(! notification.readed) this.unReadedCount--;
        
        innerNotificationsTemplate.removeChild(notification);

        this.notifications.delete(id);

        if(this.notifications.size == 0) {
            let emptyMessage = document.getElementById('VanillNotificationsEmptyMessage');
            if(emptyMessage == null) {
                innerNotificationsTemplate.appendChild(this.createEmptyMessage());
            }
        }
    }

    size() {
        
        return this.notifications.size;
    }

    clear() {

        let vanillaNotifications = document.getElementById('VanillaNotifications');
        if(vanillaNotifications == null) return;

        let innerNotificationsTemplate = document.getElementById('VanillaInnerNotificationsTemplate');
        if(innerNotificationsTemplate == null) return;
        
        vanillaNotifications.removeChild(innerNotificationsTemplate);

        let newInnerNotificationsTemplate = document.createElement('main');
        newInnerNotificationsTemplate.id = "VanillaInnerNotificationsTemplate";

        vanillaNotifications.appendChild(newInnerNotificationsTemplate);

        this.notifications = new Map();
        this.unReadedCount = 0;

        let emptyMessage = document.getElementById('VanillNotificationsEmptyMessage');
        if(emptyMessage == null) {
            newInnerNotificationsTemplate.appendChild(this.createEmptyMessage());
        }
    }

    newNotificationsCount() {

        return this.unReadedCount;
    }

    open() {
        let vanillaNotifications = document.getElementById('VanillaNotifications');
        if(vanillaNotifications == null) {
            document.body.appendChild(this);
        }
        this.style = "display: block !important;";
        this.isOpend = true;
    }

    close() {
        this.style = "display: none !important;";
        this.removePlaceHolders();
        this.isOpend = false;
    }

    pushAll(data) {
        if(! Array.isArray(data)) return;
        data.forEach(notification => {
            let clickHandler = () => {
                document.location.assign(notification.url);
            };
            this.push(
                notification.id,
                notification.content,
                notification.image,
                notification.time,
                clickHandler
            );
        });
    }

    addPlaceHolders(count = null) {

        let placeHoldersCount = 8;
        let scroll = false;

        if(count != null) placeHoldersCount = count;

        let innerNotificationsTemplate = document.getElementById('VanillaInnerNotificationsTemplate');
        if(innerNotificationsTemplate == null) {
            document.body.appendChild(this);
        }
        innerNotificationsTemplate = document.getElementById('VanillaInnerNotificationsTemplate');

        let emptyMassege = document.getElementById('VanillNotificationsEmptyMessage');
        if(emptyMassege != null) {
            innerNotificationsTemplate.removeChild(emptyMassege);
        }

        if(innerNotificationsTemplate.children.length > 0) {
            scroll = true;
        }

        for(let i = 0; i < placeHoldersCount; i++) {

            innerNotificationsTemplate.appendChild(new VanillaNotificationPlaceHolder());
        }

        if(scroll) {
            let vanillaNotifications = document.getElementById("VanillaNotifications");
            vanillaNotifications.scroll(0, vanillaNotifications.scrollHeight);
        }

    }

    removePlaceHolders() {

        let innerNotificationsTemplate = document.getElementById('VanillaInnerNotificationsTemplate');
        if(innerNotificationsTemplate == null) return;
        let placeHolders = document.querySelectorAll('.vanilla-notification-place-holder');
        placeHolders.forEach((element) => {
            innerNotificationsTemplate.removeChild(element.parentElement);
        });
        if(innerNotificationsTemplate.children.length == 0) {
            let emptyMassege = document.getElementById('VanillNotificationsEmptyMessage');
            if(emptyMassege == null) {
                innerNotificationsTemplate.appendChild(this.createEmptyMessage());
            }
        }
    }

    createEmptyMessage() {
        let div = document.createElement('div');
        div.setAttribute("id", "VanillNotificationsEmptyMessage");
        div.setAttribute("class", "empty-message");
        div.innerHTML = `<span>${ VanillaNotifications.emptyMessage }</span>`;
        return div;
    }

    fetchNotificationsFromApi(url, method, headers, body, multiPage = false, notificationsCountInOneFetch = null) {

        let placeHoldersCount = null;
        if(multiPage) {
            if(this.page == null) {
                this.url = url;
                this.method = method;
                this.headers = headers;
                this.body = body;
                this.page = 0;
                this.haveMore = true;
            }
            if(! this.haveMore) return;
            this.page++;
            url += ( url.lastIndexOf('?') == -1 ? '?' : '&' ) +"page=" + this.page;
            if(notificationsCountInOneFetch != null) this.notificationsCountInOneFetch = notificationsCountInOneFetch;
        }
        if(this.page != 1) placeHoldersCount = 2;
        this.addPlaceHolders(placeHoldersCount);
        fetch(url, {
            method,
            headers,
            body
        }).then((response) => { return response.json(); }).then((result) => {
            if(result.status) {

                this.pushAll(result.data);
                if(result.data.length < this.notificationsCountInOneFetch) {
                    this.haveMore = false;
                }
                this.fetching = false;
            }
            this.removePlaceHolders();
        }).catch(() => {
            this.removePlaceHolders();
        });
    }

    onScroll(event) {
        if(! this.fetching) {
            if(event.target.scrollHeight - ( event.target.offsetHeight + event.target.scrollTop ) < 50) {
                this.fetching = true;
                if(this.haveMore) {
                    this.fetchNotificationsFromApi(this.url, this.method, this.headers, this.body, true);
                }
            }
        }
    }

    get unReadedCount() { return this._unReadedCount; }
    set unReadedCount(value) {
        this._unReadedCount = value;
        if(this.unReadedChangedCallBack != null) this.unReadedChangedCallBack(value);
    }
}
window.customElements.define('vanilla-notifications', VanillaNotifications);