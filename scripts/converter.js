
var Promise = require("scripts/promise").Promise,
    csvToGeojson = require("scripts/csv-to-geojson"),
    geojsonToKml = require("scripts/geojson-to-kml");

var Converter = module.exports = function Converter() {};



Object.defineProperties(Converter.prototype, {

    convert: {
        value: function (csv, asXML, icon) {
            var self = this;
            return csvToGeojson(csv, icon).then(function (geojson) {
                return geojsonToKml(geojson, asXML);
            });
        }
    },
    
    fetchAndConvert: {
        value: function (url, asXML, icon) {
            var self = this;
            return global.application.fetch(url).then(function (csv) {
                return self.convert(csv, asXML, icon);
            });
        }
    }

});