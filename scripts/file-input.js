
var Promise = require("scripts/promise").Promise;

var FileInput = module.exports = function FileInput() {};

FileInput.withElement = function (element) {
    var input = new FileInput();
    input.element = element;
    return input;
};


Object.defineProperties(FileInput.prototype, {

    asDataURL: {
        value: function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                if (self.file) {
                    var reader = new FileReader();
                
                    reader.onload = function(e) {
                        resolve(e.target.result);
                    };

                    reader.onerror = function(e) {
                        reject(e);
                    };
                
                    reader.readAsDataURL(self.file);
                } else {
                    reject(new Error("FileInput does not have a file"));
                }
            });
        }
    },

    asText: {
        value: function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                if (self.file) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        resolve(e.target.result);
                    };

                    reader.onerror = function(e) {
                        reject(e);
                    };
                
                    reader.readAsText(self.file);
                } else {
                    reject(new Error("FileInput does not have a file"));
                }
            });
        }
    },

    _checkmark: {
        get: function () {
            if (!this.__checkmark) {
                this.__checkmark = this.element.previousElementSibling.querySelector(".checkmark");
            }
            return this.__checkmark;
        }
    },

    _onFileChange: {
        value: function (event) {
            if (this.element.files[0]) {
                this._checkmark.style.display = "block";
            } else {
                this._checkmark.style.display = "none";
            }
        }
    },

    _fileChangeListener: {
        get: function () {
            if (!this.__fileChangeListener) {
                this.__fileChangeListener = this._onFileChange.bind(this);
            }
            return this.__fileChangeListener;
        }
    },

    element: {
        get: function () {
            return this._element;
        },
        set: function (value) {
            if (this._element) {
                this._element.removeEventListener("change", this._fileChangeListener);
            }
            this._element = value;
            if (value) {
                this._element.addEventListener("change", this._fileChangeListener);
            }
        }
    },

    file: {
        get: function () {
            return this.element && this.element.files[0] || null;
        }
    },

    isValid: {
        get: function () {
            return !!this.file;
        }
    }

});