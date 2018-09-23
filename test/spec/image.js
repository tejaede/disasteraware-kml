var Image = require("disasteraware-kml/scripts/image");

describe("Image", function () {
    var src = "../assets/images/marker-512.png",
        body = document.querySelector("body"),
        image;

    function imageWithSrc(url) {
        var img = document.createElement("img");
        img.setAttribute("src", url);
        img.style.display = "none";
        return img;
    }

    it ("can get dataURL with default size", function (done) {
        var height = 512, //Original height of image
            width = 512; //Original height of image
            
        image = Image.withSource(src);
        image.toDataURL().then(function (dataURL) {
            expect(typeof dataURL).toBe("string");
            var testImage = imageWithSrc(dataURL);
            testImage.onload = function () {
                expect(testImage.height).toBe(height);
                expect(testImage.width).toBe(width);
                done();
            };
            body.appendChild(testImage);
        });
    });

    it ("can get dataURL with defined size", function (done) {
        var height = 32,
            width = 32;
        image = Image.withSource(src);
        image.toDataURL({width: width, height: height}).then(function (dataURL) {
            expect(typeof dataURL).toBe("string");
            var testImage = imageWithSrc(dataURL);
            testImage.onload = function () {
                expect(testImage.height).toBe(height);
                expect(testImage.width).toBe(width);
                done();
            };
            body.appendChild(testImage);
        });
    });
});