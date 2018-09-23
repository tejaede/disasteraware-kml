
var NumberInput = module.exports = function NumberInput() {};

NumberInput.withElement = function (element) {
    var input = new NumberInput();
    input.element = element;
    return input;
};


Object.defineProperties(NumberInput.prototype, {

    _defaultValue: {
        value: 50
    },

    value: {
        get: function () {
            return this.element && this.element.value || this._defaultValue;
        }
    },

    isValid: {
        get: function () {
            return !!this.value;
        }
    }

});