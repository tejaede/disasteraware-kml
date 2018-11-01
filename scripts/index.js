var FileInput = require("scripts/file-input"),
    NumberInput = require("scripts/number-input"),
    TextInput = require("scripts/text-input"),
    KmlDocument = require("scripts/kml-document"),
    Image = require("scripts/image");

var Main = module.exports = function Main() {
    
    var submitButton = document.getElementById("submit");
    if (submitButton) {
        submitButton.addEventListener("click", this.onSubmit.bind(this));
    }
    this.inputs;
};


Object.defineProperties(Main.prototype, {

    
    

    fetch: {
        value: function (url) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        resolve(xhr.responseText);
                    }
                };
                xhr.onerror = function (error) {
                    reject(error);
                };
                xhr.send(null);
            });
        }
    },

    _iconUrl: {
        value: function () {
            var iconInput = document.getElementById("icon");
            
            return FileInput.withElement(iconInput).asDataURL();

        }
    },

    _csv: {
        value: function () {
            var iconInput = document.getElementById("csv");
            
            return FileInput.withElement(iconInput).asText();

        }
    },

    fileInputs: {
        get: function () {
            if (!this._fileInputs) {
                var elements = Array.from(document.querySelectorAll("input[type='file']"));
                this._fileInputs = elements.map(function (element) {
                    return FileInput.withElement(element);
                });
            }
            return this._fileInputs;
        }
    },

    _csvInput: {
        get: function () { 
            if (!this.__csvInput) {
                this.__csvInput = FileInput.withElement(document.getElementById("csv"));
            }
            return this.__csvInput;
        }
    },

    _iconInput: {
        get: function () { 
            if (!this.__iconInput) {
                this.__iconInput = FileInput.withElement(document.getElementById("icon"));
            }
            return this.__iconInput;
        }
    },

    _nameInput: {
        get: function () { 
            if (!this.__nameInput) {
                this.__nameInput = TextInput.withElement(document.getElementById("name"));
            }
            return this.__nameInput;
        }
    },

    _descriptionInput: {
        get: function () { 
            if (!this.__descriptionInput) {
                this.__descriptionInput = TextInput.withElement(document.getElementById("description"));
            }
            return this.__descriptionInput;
        }
    },

    _widthInput: {
        get: function () { 
            if (!this.__widthInput) {
                this.__widthInput = NumberInput.withElement(document.getElementById("width"));
            }
            return this.__widthInput;
        }
    },

    _heightInput: {
        get: function () { 
            if (!this.__heightInput) {
                this.__heightInput = NumberInput.withElement(document.getElementById("height"));
            }
            return this.__heightInput;
        }
    },

    inputs: {
        get: function () {
            if (!this._inputs) {
                this._inputs = [this._csvInput, this._iconInput, this._nameInput, this._descriptionInput, this._widthInput, this._heightInput];
            }
            return this._inputs;
        }
    },

    canGenerateKML: {
        get: function () {
            return this.inputs.filter(function (input) {
                return !input.isValid;
            }).length === 0;
        }
    },

    onSubmit: {
        value: function (e) {
            e.stopPropagation();
            if (this.canGenerateKML) {
                this._generateKMLWithDocument();
            } else {
                console.warn("Required fields are missing");
            }
        }
    },

    _generateKMLWithDocument: {
        value: function () {
            var self = this,
                name = this._nameInput.value,
                description = this._descriptionInput.value,
                height = this._heightInput.value,
                width = this._widthInput.value,
                doc;

            console.log("_generateKMLWithDocument");
            
            return this._csv().then(function (csv) {
                doc = KmlDocument.withCSV(csv);
                doc.name = name;
                doc.description = description;
                return self._iconUrl();
            }).then(function (icon) {
                doc.icon = Image.withSource(icon);
                doc.iconSize = {height: height, width: width};
                return doc.saveToFile();
            });
        }
    },

});

global.application = new Main();