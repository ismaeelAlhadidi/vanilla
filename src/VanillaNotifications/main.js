import "./style/main.scss";
import VanillaNotification from "./Child/VanillaNotification";

export default class VanillaNotifications extends HTMLElement {

    static title = "Notifications";

    constructor () {
        super();

        this.notifications = new Map();

        this.unReadedCount = 0;
    }

    connectedCallback() {
        this.innerHTML = `<div id="VanillaNotifications" class="vanilla-notifications">
            <header><span>${ VanillaNotifications.title }</span></header>
            <main id="VanillaInnerNotificationsTemplate"></main>
        </div>`;
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
    }

    newNotificationsCount() {

        return this.unReadedCount;
    }
}
window.customElements.define('vanilla-notifications', VanillaNotifications);