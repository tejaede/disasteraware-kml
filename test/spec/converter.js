var Converter = require("disasteraware-kml/scripts/converter"),
    KmlDocument = require("disasteraware-kml/scripts/kml-document"),
    csvToGeojson = require("scripts/csv-to-geojson");

describe("KML Generation", function () {
    var converter = new Converter(),
        src = "../assets/csv/two-columns.csv";
    // it ("can convert to string", function (done) {
    //     converter.fetchAndConvert(src).then(function (kml) {
    //         expect(typeof kml).toBe("string");
    //         done();
    //     });
    // });

    // it ("can convert to XML", function (done) {
    //     converter.fetchAndConvert(src, true).then(function (kml) {
    //         expect(kml instanceof Node).toBeTruthy();
    //         console.log(kml);
    //         done();
    //     });
    // });

    // it ("can output KML to File", function (done) {
    //     converter.fetchAndConvert(src).then(function (kml) {
    //         expect(typeof kml).toBe("string");
    //         // kmlFile.fromString(kml);
    //         done();
    //     });
    // });
});