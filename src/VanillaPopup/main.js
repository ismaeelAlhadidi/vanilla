import "./style/main.scss";

import Alert from "./PopupsModules/VanillaAlert.js";

import Confirm from "./PopupsModules/VanillaConfirm.js";
import VanillaLikes from "./PopupsModules/VanillaLikes";


export default class VanillaPopup {


    following(userId, componentType, title, list, autoFetch = false) {

        if(! autoFetch && ! Array.isArray(list)) return;

        if(! autoFetch && list.length == 0) return;

        let likes = new VanillaLikes(userId, componentType, title, list, 'following', autoFetch);

        likes.open();
    }

    follower(userId, componentType, title, list, autoFetch = false) {

        if(! autoFetch && ! Array.isArray(list)) return;

        if(! autoFetch && list.length == 0) return;

        let likes = new VanillaLikes(userId, componentType, title, list, 'follower', autoFetch);

        likes.open();
    }

    likes(componentId, componentType, title, list, autoFetch = false) {

        if(! autoFetch && ! Array.isArray(list)) return;

        if(! autoFetch && list.length == 0) return;

        let likes = new VanillaLikes(componentId, componentType, title, list, 'likes', autoFetch);

        likes.open();
    }

    alert(title, message, buttonText) {

        return new Promise((resolve) => {

            if(this.alertTemplate == null) this.alertTemplate = document.getElementById("VanillaPopupAlert");

            if(this.alertTemplate == null) this.alertTemplate = this.createAlert ();

            this.alertTemplate.open(title, message, buttonText, resolve);
        });
    }

    confirm(title, message, yestButtonText, noButtonText) {

        return new Promise((resolve) => {

            if(this.confirmTemplate == null) this.confirmTemplate = document.getElementById("VanillaPopupConfirm");

            if(this.confirmTemplate == null) this.confirmTemplate = this.createConfirm ();

            this.confirmTemplate.open(title, message, yestButtonText, noButtonText, resolve);
        });
    }

    createAlert() {
        let alert = new Alert();
        alert.setAttribute('id', 'VanillaPopupAlert');
        return alert;
    }

    createConfirm() {
        let confirm = new Confirm();
        confirm.setAttribute('id', 'VanillaPopupConfirm');
        return confirm;
    }
}