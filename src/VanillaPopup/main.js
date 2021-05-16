import "./style/main.scss";

import Alert from "./PopupsModules/VanillaAlert.js";

import Confirm from "./PopupsModules/VanillaConfirm.js";


export default class VanillaPopup {

    alert(title, message, buttonText) {

        return new Promise((resolve) => {

            if(this.alertTemplate == null) this.alertTemplate = document.getElementById("VanillaPopupAlert");

            if(this.alertTemplate == null) this.alertTemplate = this.createAlert();

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

        return new Alert();
    }

    createConfirm() {

        return new Confirm();
    }
}