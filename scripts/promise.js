var Promise = require("bluebird");

// Patch "Promise.is" to support native promise
Promise.is = function (obj) {
	return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
};

// Polyfill "Promise.prototypefinally" to support finally
if (Promise.prototype.hasOwnProperty('finally') === false) {
	Promise.prototype['finally'] = function finallyPolyfill(callback) {
		var constructor = this.constructor;
		return this.then(function(value) {
				return constructor.resolve(callback()).then(function() {
					return value;
				});
			}, function(reason) {
				return constructor.resolve(callback()).then(function() {
					throw reason;
				});
			});
	};
}

exports.Promise = Promise;