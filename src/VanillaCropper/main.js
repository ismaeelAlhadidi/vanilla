import "./main.scss";

export default class VanillaCropper extends HTMLElement {

    static saveButtonText = "save";
    static exitButtonText = "exit";
    static browserNotSupportCanvasMassege = "your browser not support canvas";
    static defaultResizeAreaBorder = 20;
    static resizeUnit = 2;
    static minimamImageWidth = 70;
    static tryingLength = 2;
    static timeOfChangeNewImageAfterChangeSelectorBox = 250;
    static newImagePlaceholder = "";

    static getLengthButweenTwoPoints(p1, p2) {
        return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
    }

    constructor () {
        super();
        this._image = null;
        this._targetWidth = null;
        this._targetHeight = null;
        this._targetRatio = null;
        this._heightGrothUnit = null;
        this._widthGrothUnit = null;

        this._vanillaCropperSelectorBox = null;
        this._vanillaCropperSelectorArea = null;
        this._selectorBoxLeft = null;
        this._selectorBoxTop = null;
        this._vanillaCropperMainImage = null;
        this._vanillaCropperNewImage = null;
        this._vanillaCropperPlaceHolder = null;
        this.lastNewImage = setTimeout(function(){}, VanillaCropper.timeOfChangeNewImageAfterChangeSelectorBox);

        this._saveCallBack = function() {};
        this._exitCallBack = function() {};
        this._errorCallBack = function() {};
    }

    // this method call when element connected of documents 
    connectedCallback() {
        // set html code of this component
        this.innerHTML = `
            <div id="vanillaCropperTemplate" class="vanilla-cropper">
                <div>
                    <div class="main-image-outer-container">
                        <div class="main-image-inner-container">
                            <canvas id="vanillaCropperMainImage">${VanillaCropper.browserNotSupportCanvasMassege}</canvas>
                            <div id="vanillaCropperSelectorArea" class="selector-area">
                                <div class="selector-area-placeholder"></div>
                                <div id="vanillaCropperSelectorBox" class="box" style="width: 150px;height: 150px; top:50%; left: 50%; transform: translate(-50%, -50%);">
                                    <div class="resize-area" 
                                        style="width: ${VanillaCropper.defaultResizeAreaBorder}px;
                                            height: ${VanillaCropper.defaultResizeAreaBorder}px">
                                    </div>
                                    <div class="resize-area" 
                                        style="width: ${VanillaCropper.defaultResizeAreaBorder}px;
                                            height: ${VanillaCropper.defaultResizeAreaBorder}px">
                                    </div>
                                    <div class="resize-area" 
                                        style="width: ${VanillaCropper.defaultResizeAreaBorder}px;
                                            height: ${VanillaCropper.defaultResizeAreaBorder}px">
                                    </div>
                                    <div class="resize-area" 
                                        style="width: ${VanillaCropper.defaultResizeAreaBorder}px;
                                            height: ${VanillaCropper.defaultResizeAreaBorder}px">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="main-image-buttons">
                            <button id="vanillaCropperMainImageSaveButton">${VanillaCropper.saveButtonText}</button>
                            <button id="vanillaCropperMainImageExitButton">${VanillaCropper.exitButtonText}</button>
                        </div>
                    </div>
                    <div class="new-image-outer-container">
                        <img id="vanillaCropperNewImage" src="${VanillaCropper.newImagePlaceholder}"/>
                        <div class="new-image-buttons">
                            <button id="vanillaCropperNewImageSaveButton">${VanillaCropper.saveButtonText}</button>
                            <button id="vanillaCropperNewImageExitButton">${VanillaCropper.exitButtonText}</button>
                        </div>
                    </div>
                    <div id="vanillaCropperPlaceHolder" class="vanilla-cropper-placeholder">
                        <div class="vanilla-cropper-progress loader-ring"><div></div><div></div><div></div></div>
                    </div>
                </div>
            </div>
        `;

        // call setEvents method to set events of this component
        this.setEvents();
    }

    setEvents() {
        let vanillaCropperSelectorBox = this.vanillaCropperSelectorBox;
        let vanillaCropperSelectorArea = this.vanillaCropperSelectorArea;
        
        let eventType = null , clickPoint = {
            x: null,
            y: null
        }, lastCurrent = {
            x: null,
            y: null
        };

        const tempThis = this;
        let selectedHandler = null;

        let resizeHandlar = function (e, eventType, area) {
            if(clickPoint.x == null) return;
            if(clickPoint.y == null) return;
            let currentX = null;
            let currentY = null;
            switch(eventType) {
                case "mouse":
                    currentX = e.clientX;
                    currentY = e.clientY;
                    break;
                case "touch":
                    currentX = e.touches.item(0).clientX;
                    currentY = e.touches.item(0).clientY;
                    break;
                default:
                    return;
            }
            let matchPoint = {
                x: null,
                y: null
            };
            /* ############################ make match relative to window ?? */
            let tempV = 0;
            let tempH = 0;
            switch(area) {
                case "TopLeft":
                    matchPoint.x = vanillaCropperSelectorArea.getBoundingClientRect().x;
                    matchPoint.y = vanillaCropperSelectorArea.getBoundingClientRect().y;

                    tempV = vanillaCropperSelectorBox.getBoundingClientRect().y - vanillaCropperSelectorArea.getBoundingClientRect().y + vanillaCropperSelectorBox.getBoundingClientRect().height;
                    tempH = vanillaCropperSelectorBox.getBoundingClientRect().x - vanillaCropperSelectorArea.getBoundingClientRect().x + vanillaCropperSelectorBox.getBoundingClientRect().width;
                    break;
                case "TopRight":
                    matchPoint.x = vanillaCropperSelectorArea.getBoundingClientRect().x
                        + vanillaCropperSelectorArea.getBoundingClientRect().width;
                    matchPoint.y = vanillaCropperSelectorArea.getBoundingClientRect().y;

                    tempV = vanillaCropperSelectorBox.getBoundingClientRect().y - vanillaCropperSelectorArea.getBoundingClientRect().y + vanillaCropperSelectorBox.getBoundingClientRect().height;
                    tempH = vanillaCropperSelectorBox.getBoundingClientRect().x - vanillaCropperSelectorArea.getBoundingClientRect().x;
                    break;
                case "BottomLeft":
                    matchPoint.x = vanillaCropperSelectorArea.getBoundingClientRect().x;
                    matchPoint.y = vanillaCropperSelectorArea.getBoundingClientRect().y
                        + vanillaCropperSelectorArea.getBoundingClientRect().height;
                    
                    tempV = vanillaCropperSelectorBox.getBoundingClientRect().y - vanillaCropperSelectorArea.getBoundingClientRect().y;
                    tempH = vanillaCropperSelectorBox.getBoundingClientRect().x - vanillaCropperSelectorArea.getBoundingClientRect().x + vanillaCropperSelectorBox.getBoundingClientRect().width;
                    break;
                case "BottomRight":
                    matchPoint.x = vanillaCropperSelectorArea.getBoundingClientRect().x
                        + vanillaCropperSelectorArea.getBoundingClientRect().width;
                    matchPoint.y = vanillaCropperSelectorArea.getBoundingClientRect().y
                        + vanillaCropperSelectorArea.getBoundingClientRect().height;
                    
                    tempV = vanillaCropperSelectorBox.getBoundingClientRect().y - vanillaCropperSelectorArea.getBoundingClientRect().y;
                    tempH = vanillaCropperSelectorBox.getBoundingClientRect().x - vanillaCropperSelectorArea.getBoundingClientRect().x;
                    break;
                default: 
                    return;
            }
            
            if(tempThis.heightGrothUnit == null || tempThis.widthGrothUnit == null || tempThis.targetHeight == null || tempThis.targetWidth == null) return;
            
            let lengthButweenMatchAndCurrentPoints = VanillaCropper.getLengthButweenTwoPoints(matchPoint, { x: currentX, y: currentY });
            let lengthButweenMatchAndLastCurrentPoints = VanillaCropper.getLengthButweenTwoPoints(matchPoint, lastCurrent);

            let newHeight, newWidth;

            if(lengthButweenMatchAndCurrentPoints > lengthButweenMatchAndLastCurrentPoints) {
                if(tempThis.targetHeight <= 0) return;
                if(tempThis.targetWidth <= VanillaCropper.minimamImageWidth) return;

                newHeight = tempThis.targetHeight - tempThis.heightGrothUnit;
                newWidth = tempThis.targetWidth - tempThis.widthGrothUnit;

            } else if (lengthButweenMatchAndCurrentPoints < lengthButweenMatchAndLastCurrentPoints) {                
                if(tempThis.targetHeight >= vanillaCropperSelectorArea.getBoundingClientRect().height) return;
                if(tempThis.targetWidth >= vanillaCropperSelectorArea.getBoundingClientRect().width) return;

                newHeight = tempThis.targetHeight + tempThis.heightGrothUnit;
                newWidth = tempThis.targetWidth + tempThis.widthGrothUnit;

            } else {
                lastCurrent.x = currentX;
                lastCurrent.y = currentY;
                return;
            }

            let tempTop, tempLeft;
            switch(area) {
                case "TopLeft":
                    tempTop = tempV - newHeight;
                    tempLeft = tempH - newWidth;
                    break;
                case "TopRight":
                    tempTop = tempV - newHeight;
                    tempLeft = tempH;
                    break;
                case "BottomLeft":
                    tempTop = tempV;
                    tempLeft = tempH - newWidth;
                    break;
                case "BottomRight":
                    tempTop = tempV;
                    tempLeft = tempH;
                    break;
            }
            let isInSelectorArea = tempTop >= 0 && tempLeft >= 0 && ( tempTop + newHeight ) <= vanillaCropperSelectorArea.getBoundingClientRect().height 
                && ( tempLeft + newWidth ) <= vanillaCropperSelectorArea.getBoundingClientRect().width;
            if(isInSelectorArea) {
                tempThis.targetHeight = newHeight;
                tempThis.targetWidth = newWidth;
                vanillaCropperSelectorBox.style.transform = "unset";
                vanillaCropperSelectorBox.style.top = tempTop + "px";
                vanillaCropperSelectorBox.style.left = tempLeft + "px";
            }
            

            lastCurrent.x = currentX;
            lastCurrent.y = currentY;
        };

        let translateHandlar = function (e, eventType, centerOfXTranslate, centerOfYTranslate) {
            if(clickPoint.x == null) return;
            if(clickPoint.y == null) return;
            let currentX = null;
            let currentY = null;
            switch(eventType) {
                case "mouse":
                    currentX = e.clientX;
                    currentY = e.clientY;
                    break;
                case "touch":
                    currentX = e.touches.item(0).clientX;
                    currentY = e.touches.item(0).clientY;
                    break;
                default:
                    return;
            }
            
            let selectorBoxNewXBeforeTranslate = ( currentX - vanillaCropperSelectorArea.getBoundingClientRect().x );
            let selectorBoxNewYBeforeTranslate = ( currentY - vanillaCropperSelectorArea.getBoundingClientRect().y );


            let HorizontalTransleted = ( centerOfXTranslate/100 * vanillaCropperSelectorBox.getBoundingClientRect().width );
            let VerticalTransleted = ( centerOfYTranslate/100 * vanillaCropperSelectorBox.getBoundingClientRect().height );

            let selectorBoxNewX = selectorBoxNewXBeforeTranslate - HorizontalTransleted;
            let selectorBoxNewY = selectorBoxNewYBeforeTranslate - VerticalTransleted;

            /*
            let hasHorizontalArea = selectorBoxNewX >= 0 && ( selectorBoxNewX + vanillaCropperSelectorBox.getBoundingClientRect().width ) <= vanillaCropperSelectorArea.getBoundingClientRect().width;
            let hasVerticalArea = selectorBoxNewY >= 0 && ( selectorBoxNewY + vanillaCropperSelectorBox.getBoundingClientRect().height ) <= vanillaCropperSelectorArea.getBoundingClientRect().height;
            */
            

            /*
            if(tempThis.inSelectorArea({ x: currentX, y: currentY })) {
                tempThis.selectorBoxLeft = selectorBoxNewXBeforeTranslate;
                tempThis.selectorBoxTop = selectorBoxNewYBeforeTranslate;

                lastCurrent.x = currentX;
                lastCurrent.y = currentY;
                return;
            }
            */

            if(selectorBoxNewX < 0) 
                tempThis.selectorBoxLeft = 0 + HorizontalTransleted;
            else if(selectorBoxNewX > vanillaCropperSelectorArea.getBoundingClientRect().width - vanillaCropperSelectorBox.getBoundingClientRect().width) 
                tempThis.selectorBoxLeft = vanillaCropperSelectorArea.getBoundingClientRect().width - HorizontalTransleted;
            else
                tempThis.selectorBoxLeft = selectorBoxNewXBeforeTranslate;

            if(selectorBoxNewY < 0) 
                tempThis.selectorBoxTop = 0 + VerticalTransleted;
            else if(selectorBoxNewY > vanillaCropperSelectorArea.getBoundingClientRect().height - vanillaCropperSelectorBox.getBoundingClientRect().height) 
                tempThis.selectorBoxTop = vanillaCropperSelectorArea.getBoundingClientRect().height - VerticalTransleted;
            else
                tempThis.selectorBoxTop = selectorBoxNewYBeforeTranslate;
                        
            // change left 
            lastCurrent.x = currentX;
            lastCurrent.y = currentY;
        };

        let ActiveEventHandlar = function (e) {
            if(clickPoint.x == null) return;
            if(clickPoint.y == null) return;
            let currentX = null;
            let currentY = null;
            switch(eventType) {
                case "mouse":
                    currentX = e.clientX;
                    currentY = e.clientY;
                    break;
                case "touch":
                    currentX = e.touches.item(0).clientX;
                    currentY = e.touches.item(0).clientY;
                    break;
                default:
                    return;
            }
            
            let isClickInTopLeftResizeAreaBorder = ( 
                    ( vanillaCropperSelectorBox.getBoundingClientRect().y 
                    + VanillaCropper.defaultResizeAreaBorder ) > clickPoint.y
                ) && (
                    ( vanillaCropperSelectorBox.getBoundingClientRect().x
                    + VanillaCropper.defaultResizeAreaBorder ) > clickPoint.x
                );
            
            let isClickInTopRightResizeAreaBorder = ( 
                    ( vanillaCropperSelectorBox.getBoundingClientRect().y 
                    + VanillaCropper.defaultResizeAreaBorder ) > clickPoint.y
                ) && (
                    ( vanillaCropperSelectorBox.getBoundingClientRect().x
                    + vanillaCropperSelectorBox.getBoundingClientRect().width
                    - VanillaCropper.defaultResizeAreaBorder ) < clickPoint.x
                ) ;

            let isClickInBottomLeftResizeAreaBorder = (
                    ( vanillaCropperSelectorBox.getBoundingClientRect().y 
                    + vanillaCropperSelectorBox.getBoundingClientRect().height
                    - VanillaCropper.defaultResizeAreaBorder ) < clickPoint.y
                ) && (
                    ( vanillaCropperSelectorBox.getBoundingClientRect().x
                    + VanillaCropper.defaultResizeAreaBorder ) > clickPoint.x
                );

            let isClickInBottomRightResizeAreaBorder = (
                    ( vanillaCropperSelectorBox.getBoundingClientRect().y 
                    + vanillaCropperSelectorBox.getBoundingClientRect().height
                    - VanillaCropper.defaultResizeAreaBorder ) < clickPoint.y
                ) && (
                    ( vanillaCropperSelectorBox.getBoundingClientRect().x
                    + vanillaCropperSelectorBox.getBoundingClientRect().width
                    - VanillaCropper.defaultResizeAreaBorder ) < clickPoint.x
                );

            if(lastCurrent.x == null || lastCurrent.y == null) {
                lastCurrent.x = currentX;
                lastCurrent.y = currentY;
                return;
            }
            if(isClickInTopLeftResizeAreaBorder) {
                selectedHandler = function (e) {
                    resizeHandlar(e, eventType, "TopLeft");
                };
            }
            else if(isClickInTopRightResizeAreaBorder) {
                selectedHandler = function (e) {
                    resizeHandlar(e, eventType, "TopRight");
                };
            }
            else if(isClickInBottomLeftResizeAreaBorder) {
                selectedHandler = function (e) {
                    resizeHandlar(e, eventType, "BottomLeft");
                };
            }
            else if(isClickInBottomRightResizeAreaBorder) {
                selectedHandler = function (e) {
                    resizeHandlar(e, eventType, "BottomRight");
                };
            }
            else {
                /*
                let tempCenterOfXTranslate = ( clickPoint.x - vanillaCropperSelectorBox.getBoundingClientRect().x ) 
                    / vanillaCropperSelectorBox.getBoundingClientRect().width * 100;
                let tempCenterOfYTranslate = ( clickPoint.y - vanillaCropperSelectorBox.getBoundingClientRect().y ) 
                    / vanillaCropperSelectorBox.getBoundingClientRect().height * 100;

                let tempH = vanillaCropperSelectorBox.getBoundingClientRect().x - vanillaCropperSelectorArea.getBoundingClientRect().x 
                    + tempCenterOfXTranslate/100 * vanillaCropperSelectorBox.getBoundingClientRect().width;
                let tempV = vanillaCropperSelectorBox.getBoundingClientRect().y - vanillaCropperSelectorArea.getBoundingClientRect().y
                    + tempCenterOfYTranslate/100 * vanillaCropperSelectorBox.getBoundingClientRect().height;
                

                vanillaCropperSelectorBox.style.left = tempH;
                vanillaCropperSelectorBox.style.top = tempV;*/
                vanillaCropperSelectorBox.style.transform = "translate(-" + 50 + "%, -" + 50 + "%)";

                selectedHandler = function (e) {
                    translateHandlar(e, eventType, 50, 50);
                };
            }

            if(selectedHandler == null) return;
            if(eventType == "touch") {
                vanillaCropperSelectorArea.removeEventListener('touchmove', ActiveEventHandlar);
                vanillaCropperSelectorArea.addEventListener('touchmove', selectedHandler);
                return;
            }
            vanillaCropperSelectorArea.removeEventListener('mousemove', ActiveEventHandlar);
            vanillaCropperSelectorArea.addEventListener('mousemove', selectedHandler);
        };

        vanillaCropperSelectorBox.addEventListener('mousedown', function (e) {
            eventType = "mouse";
            clickPoint.x = e.clientX;
            clickPoint.y = e.clientY;
            vanillaCropperSelectorArea.addEventListener('mousemove', ActiveEventHandlar);
        });
        vanillaCropperSelectorBox.addEventListener('mouseup', function () {
            eventType = null;
            clickPoint.x = null;
            clickPoint.y = null;
            vanillaCropperSelectorArea.removeEventListener('mousemove', selectedHandler);
            vanillaCropperSelectorArea.removeEventListener('mousemove', ActiveEventHandlar);
        });
        vanillaCropperSelectorArea.addEventListener('mouseup', function () {
            eventType = null;
            clickPoint.x = null;
            clickPoint.y = null;
            vanillaCropperSelectorArea.removeEventListener('mousemove', selectedHandler);
            vanillaCropperSelectorArea.removeEventListener('mousemove', ActiveEventHandlar);
        });
        


        vanillaCropperSelectorBox.addEventListener('touchstart', function (e) {
            eventType = "touch";
            clickPoint.x = e.touches.item(0).clientX;
            clickPoint.y = e.touches.item(0).clientY;
            vanillaCropperSelectorArea.addEventListener('touchmove', ActiveEventHandlar);
        });
        vanillaCropperSelectorBox.addEventListener('touchend', function () {
            eventType = null;
            clickPoint.x = null;
            clickPoint.y = null;
            vanillaCropperSelectorArea.removeEventListener('touchmove', selectedHandler);
            vanillaCropperSelectorArea.removeEventListener('touchmove', ActiveEventHandlar);
        });
        vanillaCropperSelectorArea.addEventListener('touchend', function () {
            eventType = null;
            clickPoint.x = null;
            clickPoint.y = null;
            vanillaCropperSelectorArea.removeEventListener('touchmove', selectedHandler);
            vanillaCropperSelectorArea.removeEventListener('touchmove', ActiveEventHandlar);
        });

        let vanillaCropperMainImage = this.vanillaCropperMainImage;
        
        vanillaCropperMainImage.width = vanillaCropperSelectorArea.getBoundingClientRect().width;
        vanillaCropperMainImage.height = vanillaCropperSelectorArea.getBoundingClientRect().height;
        
        let vanillaCropperNewImageSaveButton = window.document.getElementById('vanillaCropperNewImageSaveButton');
        let vanillaCropperNewImageExitButton = window.document.getElementById('vanillaCropperNewImageExitButton');
        let vanillaCropperMainImageSaveButton = window.document.getElementById('vanillaCropperMainImageSaveButton');
        let vanillaCropperMainImageExitButton = window.document.getElementById('vanillaCropperMainImageExitButton');
        
        const saveHandler = function () {
            let tempImage = new Image();

            tempImage.onload = function () {
                const image = tempThis.getCroppedImage(tempImage);
                if(image == null) {
                    tempThis.errorHandler();
                    return;
                }
                tempThis.close();
                tempThis.saveCallBack(image);
            };
            tempImage.src = tempThis.vanillaCropperMainImage.toDataURL();
        };

        const exitHandler = function () {
            tempThis.close();
            tempThis.exitCallBack();
        };

        vanillaCropperMainImageSaveButton.addEventListener('click', saveHandler);
        vanillaCropperNewImageSaveButton.addEventListener('click', saveHandler);

        vanillaCropperMainImageExitButton.addEventListener('click', exitHandler);
        vanillaCropperNewImageExitButton.addEventListener('click', exitHandler);

        var notPhone = window.matchMedia("(min-width: 768px)");
        this.notPhoneEvents(notPhone, this);
        notPhone.addListener(() => {
            if(this.image != null) {
                this.reset();
                this.drawingImage();
            }
            this.notPhoneEvents(notPhone, this);
        });
    }

    notPhoneEvents (notPhone, tempThis) {
        if(notPhone.matches) {
            tempThis.changeNewImage();
            return;
        }
    }

    changeNewImage() {
        let tempImage = new Image();
        const tempThis = this;
        tempImage.onload = () => {
            const imageSrc = tempThis.getCroppedImageSrc(tempImage);
            tempThis.vanillaCropperNewImage.src = imageSrc;
            this.vanillaCropperNewImage.setAttribute("class", "");
            tempThis.vanillaCropperNewImage.style = "";
        };
        tempImage.src = tempThis.vanillaCropperMainImage.toDataURL();
    }

    start(image, targetWidth, targetHeight, saveCallBack, exitCallBack, errorCallBack) {
        try {
            if(! this.isConnected ) {
                let tempComponent = window.document.getElementById("vanillaCropperTemplate");
                if(tempComponent != null) {
                    window.document.body.removeChild(tempComponent.parentElement);
                    console.warn("not recommended using multiple object of VanillaCropper in same page !!");
                }
                window.document.body.appendChild(this);
            }

            this.startPlaceholderProgress();

            this.targetWidth = targetWidth;
            this.targetHeight = targetHeight;

            this.targetRatio = ( this.targetWidth > this.targetHeight )
                ? ( this.targetHeight / this.targetWidth ) 
                : ( this.targetWidth / this.targetHeight );

            this.heightGrothUnit = ( this.targetHeight > this.targetWidth ? VanillaCropper.resizeUnit : VanillaCropper.resizeUnit * this.targetRatio );
            this.widthGrothUnit = ( this.targetWidth > this.targetHeight ? VanillaCropper.resizeUnit : VanillaCropper.resizeUnit * this.targetRatio );

            this.saveCallBack = saveCallBack;
            this.exitCallBack = exitCallBack;
            this.errorCallBack = errorCallBack;
            
            const tempThis = this;
            tempThis.open();
            tempThis.setMainImageSize();
            tempThis.image = image;
            setTimeout(function () {
                tempThis.endPlaceholderProgress();
            }, 500);
        } catch (e) {
            this.close();
            errorCallBack();
        }
    }
    
    open() {
        this.style.display = "block";
        window.document.body.style.overflow = "hidden";
        window.document.body.style.height = "100vh";
        window.document.body.style.width = "100vw";
        window.document.body.style.margin = "0px";
        window.document.body.style.position = "fixed";
    }
    setMainImageSize() {
        this.vanillaCropperMainImage.width = this.vanillaCropperSelectorArea.getBoundingClientRect().width;
        this.vanillaCropperMainImage.height = this.vanillaCropperSelectorArea.getBoundingClientRect().height;
    }
    close() {
        this.style.display = "none";
        window.document.body.style.overflow = "";
        window.document.body.style.height = "";
        window.document.body.style.width = "";
        window.document.body.style.margin = "";
        window.document.body.style.position = "";
        this.reset();
    }
    reset() {
        this.clearImages();
        this.resetSelectorBox();
    }

    startPlaceholderProgress () {
        if(this.vanillaCropperPlaceHolder != null) this.vanillaCropperPlaceHolder.style = "display: block;";
    }
    
    endPlaceholderProgress() {
        if(this.vanillaCropperPlaceHolder != null) this.vanillaCropperPlaceHolder.style = "";
    }

    errorHandler() {
        return this.errorCallBack();
    }

    drawingImage() {
        this.vanillaCropperMainImage.width = this.vanillaCropperSelectorArea.getBoundingClientRect().width;
        this.vanillaCropperMainImage.height = this.vanillaCropperSelectorArea.getBoundingClientRect().height;
        let lengths = this.getCorrectLengthsOfMainImage();
        if(lengths == null) return;
        let width = lengths.width;
        let height = lengths.height;
        let x = (this.vanillaCropperMainImage.getBoundingClientRect().width / 2) - width/2;
        let y = (this.vanillaCropperMainImage.getBoundingClientRect().height / 2) - height/2;
        
        let context = this.vanillaCropperMainImage.getContext('2d');
        context.drawImage(this.image, x, y, width, height);
    }

    getCroppedImage(tempImage) {
        let image = new Image();
        image.src = this.getCroppedImageSrc(tempImage);
        return image;
    }

    getCroppedImageSrc(tempImage) {
        let cropperCanvas = window.document.createElement('canvas');
        let cropperContext = cropperCanvas.getContext('2d');
        cropperCanvas.width = this.targetWidth;
        cropperCanvas.height = this.targetHeight;

        let newX = this.vanillaCropperSelectorBox.getBoundingClientRect().x - this.vanillaCropperMainImage.getBoundingClientRect().x;
        let newY = this.vanillaCropperSelectorBox.getBoundingClientRect().y - this.vanillaCropperMainImage.getBoundingClientRect().y;
        let newWidth = this.vanillaCropperSelectorBox.getBoundingClientRect().width;
        let newHeight = this.vanillaCropperSelectorBox.getBoundingClientRect().height;
        
        cropperContext.drawImage(tempImage, newX, newY, newWidth, newHeight, 0, 0, cropperCanvas.width, cropperCanvas.height);
        return cropperCanvas.toDataURL();
    }

    getCorrectLengthsOfMainImage(newTrying = null) {
        let trying = ( (newTrying == null) ? VanillaCropper.tryingLength : newTrying);
        if(trying < 0.5) return null;  
        let containerWidth = this.vanillaCropperMainImage.getBoundingClientRect().width;
        let containerHeight = this.vanillaCropperMainImage.getBoundingClientRect().height;
        if(this.image.naturalWidth > this.image.naturalHeight) {
            let width;
            for(width = containerWidth; width > 0; width -= trying) {
                let height = width * this.image.naturalHeight / this.image.naturalWidth;
                if(height <= containerHeight) return {width: width, height: height};
            }
        } else {
            let height;
            for(height = containerHeight; height > 0; height -= trying) {
                let width = height * this.image.naturalWidth / this.image.naturalHeight;
                if(width <= containerWidth) return {width: width, height: height};
            }
        }
        return this.getCorrectLengthsOfMainImage(trying / 2);
    }

    clearImages() {
        let context = this.vanillaCropperMainImage.getContext('2d');
        context.clearRect(0, 0, this.vanillaCropperMainImage.width, this.vanillaCropperMainImage.height);
        
        this.vanillaCropperNewImage.src = "";

        vanillaCropperMainImage.width = vanillaCropperSelectorArea.getBoundingClientRect().width;
        vanillaCropperMainImage.height = vanillaCropperSelectorArea.getBoundingClientRect().height;
    }
    resetSelectorBox() {
        this.vanillaCropperSelectorBox.style.left = "50%";
        this.vanillaCropperSelectorBox.style.top = "50%";
        this.vanillaCropperSelectorBox.style.transform = "translate(-50%, -50%)";
    }


    // set and get methods of all custom properties

    get image () { return this._image; }
    set image (value) {
        this._image = value;        
        this.drawingImage();
    }

    get targetWidth () { return this._targetWidth; }
    set targetWidth (value) {
        this._targetWidth = value;
        if(this.vanillaCropperSelectorBox == null) return;
        this.vanillaCropperSelectorBox.style.width = value + "px";

        var notPhone = window.matchMedia("(min-width: 768px)");
        if(notPhone.matches) {
            clearTimeout(this.lastNewImage);
            this.vanillaCropperNewImage.style = "height: " + this.vanillaCropperNewImage.getBoundingClientRect().height + "px";
            this.vanillaCropperNewImage.src = VanillaCropper.newImagePlaceholder;
            this.vanillaCropperNewImage.setAttribute("class", "new-image-placeholder");
            this.lastNewImage = setTimeout(this.changeNewImage.bind(this), VanillaCropper.timeOfChangeNewImageAfterChangeSelectorBox);
        }
    }

    get targetHeight () { return this._targetHeight; }
    set targetHeight (value) {
        this._targetHeight = value;
        if(this.vanillaCropperSelectorBox == null) return;
        this.vanillaCropperSelectorBox.style.height = value + "px";

        var notPhone = window.matchMedia("(min-width: 768px)");
        if(notPhone.matches) {
            clearTimeout(this.lastNewImage);
            this.vanillaCropperNewImage.style = "height: " + this.vanillaCropperNewImage.getBoundingClientRect().height + "px";
            this.vanillaCropperNewImage.src = VanillaCropper.newImagePlaceholder;
            this.vanillaCropperNewImage.setAttribute("class", "new-image-placeholder");
            this.lastNewImage = setTimeout(this.changeNewImage.bind(this), VanillaCropper.timeOfChangeNewImageAfterChangeSelectorBox);
        }
    }

    get targetRatio () { 
        if(this._targetRatio != null) return this._targetRatio; 
        if(this.targetHeight == null || this.targetWidth == null) {
            this._targetRatio = null;
        } else {
            this._targetRatio = ( this.targetWidth > this.targetHeight )
            ? ( this.targetHeight / this.targetWidth ) 
            : ( this.targetWidth / this.targetHeight );
        }
        return this._targetRatio;
    }
    set targetRatio (value) { this._targetRatio = value; }

    get heightGrothUnit () { return this._heightGrothUnit; }
    set heightGrothUnit (value) { this._heightGrothUnit = value; }

    get widthGrothUnit () { return this._widthGrothUnit; }
    set widthGrothUnit (value) { this._widthGrothUnit = value; }
    
    get vanillaCropperSelectorBox () { 
        if(this._vanillaCropperSelectorBox != null) return this._vanillaCropperSelectorBox;
        this._vanillaCropperSelectorBox = window.document.getElementById('vanillaCropperSelectorBox');
        return this._vanillaCropperSelectorBox;
    }
    set vanillaCropperSelectorBox (value) { this._vanillaCropperSelectorBox = value; }

    get vanillaCropperSelectorArea () {
        if(this._vanillaCropperSelectorArea != null) return this._vanillaCropperSelectorArea;
        this._vanillaCropperSelectorArea = window.document.getElementById('vanillaCropperSelectorArea');
        return this._vanillaCropperSelectorArea;
    }
    set vanillaCropperSelectorArea (value) { this._vanillaCropperSelectorArea = value; }

    get vanillaCropperMainImage () { 
        if(this._vanillaCropperMainImage != null) return this._vanillaCropperMainImage; 
        this._vanillaCropperMainImage = window.document.getElementById('vanillaCropperMainImage');
        return this._vanillaCropperMainImage;
    }
    set vanillaCropperMainImage (value) { this._vanillaCropperMainImage = value; }

    get vanillaCropperNewImage () {
        if(this._vanillaCropperNewImage != null) return this._vanillaCropperNewImage; 
        this._vanillaCropperNewImage = window.document.getElementById('vanillaCropperNewImage');
        return this._vanillaCropperNewImage;
    }
    set vanillaCropperNewImage(value) {this._vanillaCropperNewImage = value; }

    get vanillaCropperPlaceHolder () {
        if(this._vanillaCropperPlaceHolder != null) return this._vanillaCropperPlaceHolder; 
        this._vanillaCropperPlaceHolder = window.document.getElementById('vanillaCropperPlaceHolder');
        return this._vanillaCropperPlaceHolder;
    }
    set vanillaCropperPlaceHolder(value) {this._vanillaCropperPlaceHolder = value; }
    


    get selectorBoxLeft () { return this._selectorBoxLeft; }
    set selectorBoxLeft (value) { 
        this._selectorBoxLeft = value; 
        this.vanillaCropperSelectorBox.style.left = value + "px";

        var notPhone = window.matchMedia("(min-width: 768px)");
        if(notPhone.matches) {
            clearTimeout(this.lastNewImage);
            this.vanillaCropperNewImage.style = "height: " + this.vanillaCropperNewImage.getBoundingClientRect().height + "px";
            this.vanillaCropperNewImage.src = VanillaCropper.newImagePlaceholder;
            this.vanillaCropperNewImage.setAttribute("class", "new-image-placeholder");
            this.lastNewImage = setTimeout(this.changeNewImage.bind(this), VanillaCropper.timeOfChangeNewImageAfterChangeSelectorBox);
        }
    }

    get selectorBoxTop () { return this._selectorBoxTop; }
    set selectorBoxTop (value) { 
        this._selectorBoxTop = value; 
        this.vanillaCropperSelectorBox.style.top = value + "px";

        
        var notPhone = window.matchMedia("(min-width: 768px)");
        if(notPhone.matches) {
            clearTimeout(this.lastNewImage);
            this.vanillaCropperNewImage.style = "height: " + this.vanillaCropperNewImage.getBoundingClientRect().height + "px";
            this.vanillaCropperNewImage.src = VanillaCropper.newImagePlaceholder;
            this.vanillaCropperNewImage.setAttribute("class", "new-image-placeholder");
            this.lastNewImage = setTimeout(this.changeNewImage.bind(this), VanillaCropper.timeOfChangeNewImageAfterChangeSelectorBox);
        }
    }

    get saveCallBack () { return this._saveCallBack; }
    set saveCallBack (value) { this._saveCallBack = value; }

    get exitCallBack () { return this._exitCallBack; }
    set exitCallBack (value) { this._exitCallBack = value; }

    get errorCallBack () { return this._errorCallBack; }
    set errorCallBack (value) { this._errorCallBack = value; }
    
}
window.customElements.define('vanilla-cropper', VanillaCropper);