var Promise = require("scripts/promise").Promise,
    csvToGeojson = require("csv2geojson"),
    Image = require("scripts/image");



//TODO Support single field with coordinates (can probably for csv2geojson)
var DEFAULT_OPTIONS = {
    delimiter: ','
};


function parseQueryParameters (query) {
    var parameters = {},
        string = query.replace(/\+/g, " "),
        pattern = /([^&=]+)=?([^&]*)/g,
        match;
    while (match = pattern.exec(string)) {
        parameters[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    return parameters;
}

var parameters = parseQueryParameters(window.location.search.substring(1));

var DEFAULT_MAX_CELL_COUNT = Infinity,
    DEFAULT_MAX_FEATURE_COUNT = 50000,
    MAX_CELL_COUNT = isNaN(parameters.cellLimit) ? DEFAULT_MAX_CELL_COUNT : parseInt(parameters.cellLimit),
    MAX_FEATURE_COUNT = isNaN(parameters.featureLimit) ? DEFAULT_MAX_FEATURE_COUNT : parseInt(parameters.featureLimit);

function calcuateMaxFeatureCount(propertyCount, maxFeatureCount, maxCellCount) {
    var featureCountForCellCount = featureCountForPropertyAndCellCount(propertyCount, maxCellCount || MAX_CELL_COUNT);
    maxFeatureCount = maxFeatureCount || MAX_FEATURE_COUNT;
    
    return Math.min(maxFeatureCount, featureCountForCellCount);
}


//Convert cell count to a per-feature count
function featureCountForPropertyAndCellCount(propertyCount, cellCount) {
    return Math.floor(cellCount / propertyCount);
}

        

function pruneFeatures(features, maxCellCount, maxFeatureCount) {
    var properties = features[0].properties,
        propertyCount = Object.keys(properties).length,
        featureCount = features.length,
        limit = calcuateMaxFeatureCount(propertyCount, maxFeatureCount, maxCellCount);

    console.log("Total Cell Count", propertyCount * featureCount);

    if (featureCount > limit) {
        features = features.slice(0, limit);
    }

    console.log("Pruned Cell Count", propertyCount * features.length);

    return features;
}



function toGeoJSON(csv, icon) {
    var self = this;
    return new Promise(function (resolve, reject) {
        csvToGeojson.csv2geojson(csv, DEFAULT_OPTIONS, function (err, data) {
            console.warn("Errors converting csv to geojson", err);
            data.features = pruneFeatures(data.features);
            resolve(data);
        });
    }).then(function (data) {
        if (icon) {
            return dataURLForIcon(icon).then(function (url) {
                data.features.forEach(function (feature) {
                    deleteUndefinedProperties(feature.properties);
                    feature.properties["marker-symbol"] = url;
                });
                return data;
            });
        } else {
            return data;
        }
    });
};

module.exports = {
    convert: toGeoJSON,
    prune: pruneFeatures
};

function deleteUndefinedProperties(properties) {
    var keys = Object.keys(properties);
    keys.forEach(function (key) {
        if (properties[key] === undefined) {
            delete properties[key];
        }
    });
}

var iconToDataURL = new Map();
function dataURLForIcon(icon) {
    var image;
    if (!iconToDataURL.has(icon)) {
        image = Image.withSource(icon.url);
        iconToDataURL.set(icon, image.toDataURL(icon.size));
    }
    return iconToDataURL.get(icon);
}