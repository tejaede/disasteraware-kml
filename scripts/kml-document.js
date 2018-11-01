var FileSaver = require("lib/FileSaver.js"),
    csvToGeojson = require("scripts/csv-to-geojson").convert,
    tokml = require("tokml");


var DEFAULT_FILE_NAME = "Assets";
var DEFAULT_OPTIONS = {
        name: 'name',
        description: 'description',
        documentName: DEFAULT_FILE_NAME,
        documentDescription: 'One of the many places you are not I am',
        simplestyle: true
    };

var parser = new DOMParser();
    
function toXML(string) {
    return parser.parseFromString(string,"text/xml");
}

function geojsonToKML(geojson, asXML) {
    var kml = tokml(geojson, DEFAULT_OPTIONS);
    return asXML ? toXML(kml) : kml;
}


var KmlDocument = module.exports = function KmlDocument() {};

KmlDocument.withCSV = function (csv) {
    var kml = new KmlDocument();
    kml.csv = csv;
    return kml;
};

KmlDocument.withURL = function (url) {
    var kml = new KmlDocument();
    kml.url = url;
    return kml;
};


Object.defineProperties(KmlDocument.prototype, {

    icon: {
        value: undefined, //Image
        writable: true 
    },

    iconSize: {
        value: undefined, //{width: height:}
        writable: true  
    },

    iconUrl: {
        value: function () {
            return this.icon ? this.icon.toDataURL(this.iconSize) : Promise.resolve(null);
        }
    },

    name: {
        value: undefined, //String
        writable: true
    },

    description: {
        value: undefined, //String
        writable: true
    },

    csv: {
        get: function () {
            return this._csv;
        },
        set: function (value) {
            this._csv = value;
            this._promise = Promise.resolve(value);
        }
    },

    _promise: {
        value: undefined, //Promise
        writable: true
    },

    url: {
        get: function () {
            return this._url;
        },
        set: function (value) {
            this._url = value;
            this._promise = global.application.fetch(url).then(function (csv) {
                this._csv = csv;
                return csv;
            });
        }
    },

    asText: {
        value: function () {
            var self = this;
            return this._kmlText.catch(function (e) {
                console.error("Failed to convert kml document to text");
                console.error(e);
            });
        }
    },

    _toGeoJSON: {
        value: function () {
            var self = this,
                icon;
            return this.icon.toDataURL().then(function (iconUrl) {
                icon = {
                    url: iconUrl,
                    size: self.iconSize
                };
                return self._promise;
            }).then(function (csv) {
                console.time("KMLDocument._toGeoJSON");
                return csvToGeojson(csv, icon);
            }).catch(function (e) {
                console.error("KMLDocument failed to convert csv to geoJSON");
                console.error(e);
            }).finally(function () {
                console.timeEnd("KMLDocument._toGeoJSON");
            });
        }
    },

    _kmlText: {
        get: function () {
            if (!this.__kmlText) {
                var self = this, options;
                this.__kmlText = this._toGeoJSON().then(function (geojson) {
                    options = self._options();
                    return self._geojsonToKML(geojson, false);
                });
            }
            return this.__kmlText;
        }
    },

    _options: {
        value: function () {
            var options = {},
                keys = Object.keys(DEFAULT_OPTIONS);

            keys.forEach(function (key) {
                options[key] = DEFAULT_OPTIONS[key];
            });
            options.documentName = this.name || options.name;
            options.documentDescription = this.description || options.description;

            return options;
        }
    },

    _geojsonToKML: {
        value: function (geojson) {
            console.time("KMLDocument._geojsonToKML");
            var options = this._options(),
                kml = tokml(geojson, options);
            console.timeEnd("KMLDocument._geojsonToKML");
            return kml;
        }
    },

    asXML: {
        value: function () {
            var self = this;
            return this.asText.then(function (kmlText) {
                return toXML(kml);
            });
        }
    },

    saveToFile: {
        value: function () {
            var self = this;
            return this.asText().then(function (kmlString) {
                var blob = new Blob([kmlString], {type: "text/plain;charset=utf-8"});
                fileName = (self.name || DEFAULT_FILE_NAME) + ".kml";
                FileSaver.saveAs(blob, fileName);
                return null;
            });
        }
    }

});
