var Promise = require("scripts/promise").Promise,
    csvToGeojson = require("csv2geojson"),
    Image = require("scripts/image");



//TODO Support single field with coordinates (can probably for csv2geojson)
var DEFAULT_OPTIONS = {
    delimiter: ','
};



module.exports = function toGeoJSON(csv, icon) {
    var self = this;
    return new Promise(function (resolve, reject) {
        csvToGeojson.csv2geojson(csv, DEFAULT_OPTIONS, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    }).then(function (data) {
        if (icon) {
            return Promise.all(data.features.map(function (feature) {
                return addStyle(feature, icon);
            })).then(function () {
                return data;
            });
        } else {
            return data;
        }
    });
};

function addStyle(feature, icon) {
    var url = icon.url,
        size = icon.size,
        image = Image.withSource(url);

    return image.toDataURL(size).then(function (url) {
        feature.properties["marker-symbol"] = url;
        return feature;
    });
};