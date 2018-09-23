
var TextInput = module.exports = function TextInput() {};

TextInput.withElement = function (element) {
    var input = new TextInput();
    input.element = element;
    return input;
};


Object.defineProperties(TextInput.prototype, {

    
    value: {
        get: function () {
            return this.element && this.element.value || "";
        }
    },

    isValid: {
        get: function () {
            return !!this.value;
        }
    }

});