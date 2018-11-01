var KmlDocument = require("disasteraware-kml/scripts/kml-document"),
    csvToGeojson = require("disasteraware-kml/scripts/csv-to-geojson");

describe("CSV to GeoJSON", function () {
    var src = "../assets/csv/two-columns.csv";

    

    
    describe("feature management", function () {


        it ("can skip with empty limits", function () {
            var features = makeMockFeatures(100, 20),
                featureLimit = false,
                cellLimit = false,
                pruned = csvToGeojson.prune(features, cellLimit, featureLimit);
            expect(pruned.length).toBe(100);
        });

        it ("can skip when below limits", function () {
            var features = makeMockFeatures(100, 20),
                featureLimit = 100,
                cellLimit = 2000,
                pruned = csvToGeojson.prune(features, cellLimit, featureLimit);
            expect(pruned.length).toBe(100);
        });

        it ("can truncate list to feature limit", function () {
            var features = makeMockFeatures(100, 20),
                featureLimit = 50,
                cellLimit = 5000,
                pruned = csvToGeojson.prune(features, cellLimit, featureLimit);
            expect(pruned.length).toBe(50);

            features = makeMockFeatures(100, 20);
            featureLimit = 60;
            cellLimit = 1500;
            pruned = csvToGeojson.prune(features, cellLimit, featureLimit);
            expect(pruned.length).toBe(60); // # of features to reach cell limit
        });

        it ("can truncate list to cell limit", function () {
            var features = makeMockFeatures(100, 20),
                featureLimit = false,
                cellLimit = 1000,
                pruned = csvToGeojson.prune(features, cellLimit, featureLimit);
            expect(pruned.length).toBe(50); // # of features to reach cell limit

            features = makeMockFeatures(100, 20);
            featureLimit = 60;
            cellLimit = 500;
            pruned = csvToGeojson.prune(features, cellLimit, featureLimit);
            expect(pruned.length).toBe(25); // # of features to reach cell limit
        });


        it ("can truncate list to global feature limit", function () {
            var features = makeMockFeatures(10000, 5),
                featureLimit = false,
                cellLimit = false,
                pruned = csvToGeojson.prune(features, cellLimit, featureLimit);
            expect(pruned.length).toBe(10000); // # of features to reach cell limit

        });
    
    });

    function makeMockFeatures(featureCount, propertyCount) {
        var features = [], i;
        for (i = 0; i < featureCount; i++) {
            features.push(makeMockFeature(propertyCount));
        }
        return features;
    }

    function makeMockFeature(propertyCount) {
        var properties = {}, i, factor, key;
        for (i = 0; i < propertyCount; i++) {
            factor = Math.random();
            key = Math.ceil(factor * 10000).toString(16);
            properties[key] = (i * factor).toFixed(4);
        } 
        return {properties:properties};
    }


});