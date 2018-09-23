var Promise = require("scripts/promise").Promise;


var Image = module.exports = function Image() {};

Image.withSource = function (src) {
    var image = new Image();
    image.source = src;
    return image;
};



Object.defineProperties(Image.prototype, {

    _canvas: {
        get: function () {
            if (!this.__canvas) {
                this.__canvas = document.createElement("canvas");
            }
            return this.__canvas;
        }
    },

    element: {
        get: function () {
            if (!this._element) {
                this._element = document.createElement("img");
                this._element.style.display = "none";
            }
            return this._element;
        }
    },

    loadPromise: {
        get: function () {
            if (!this._loadPromise) {
                var self = this;
                this._loadPromise = new Promise(function (resolve, reject) {
                    self.element.onload = resolve;
                    self.element.onerror = reject;
                    self.element.setAttribute("src", self.source);
                    if (!self.element.parentNode) {
                        document.querySelector("body").appendChild(self.element);
                    }
                });
            }
            return this._loadPromise;
        }
    },

    toDataURL: {
        value: function (sizeOptions) {
            sizeOptions = sizeOptions || {};
            var self = this,
                canvas = self._canvas,
                width = sizeOptions.width,
                height = sizeOptions.height,
                scale = sizeOptions.scale || 1,
                context;
            return self.loadPromise.then(function () {
                context = canvas.getContext("2d");
                if (!width || !height) {
                    width = self.element.width;
                    height = self.element.height;
                }
                width = width * scale;
                height = height * scale;
                canvas.width = width;
                canvas.height = height;
                context.drawImage(self.element, 0, 0, width, height);
                return canvas.toDataURL();
            });
        }
    },

    source: {
        value: undefined,
        writable: true
    }

});

Image.defaultImage = Image.withSource("../assets/images/marker-512.png");