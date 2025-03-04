var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { FortuneImageBase } from "./FortuneBase";
import { FromEMF, ToContext2D } from "../common/emf";
var ImageList = (function () {
    function ImageList(files) {
        if (files == null) {
            return;
        }
        this.images = {};
        for (var fileKey in files) {
            if (fileKey.indexOf("xl/media/") > -1) {
                var fileNameArr = fileKey.split(".");
                var suffix = fileNameArr[fileNameArr.length - 1].toLowerCase();
                if (suffix in
                    { png: 1, jpeg: 1, jpg: 1, gif: 1, bmp: 1, tif: 1, webp: 1, emf: 1 }) {
                    if (suffix == "emf") {
                        var pNum = 0;
                        var scale = 1;
                        var wrt = new ToContext2D(pNum, scale);
                        var inp, out, stt;
                        FromEMF.K = [];
                        inp = FromEMF.C;
                        out = FromEMF.K;
                        stt = 4;
                        for (var p in inp)
                            out[inp[p]] = p.slice(stt);
                        FromEMF.Parse(files[fileKey], wrt);
                        this.images[fileKey] = wrt.canvas.toDataURL("image/png");
                    }
                    else {
                        this.images[fileKey] = files[fileKey];
                    }
                }
            }
        }
    }
    ImageList.prototype.getImageByName = function (pathName) {
        if (pathName in this.images) {
            var base64 = this.images[pathName];
            return new Image(pathName, base64);
        }
        return null;
    };
    return ImageList;
}());
export { ImageList };
var Image = (function (_super) {
    __extends(Image, _super);
    function Image(pathName, base64) {
        var _this = _super.call(this) || this;
        _this.src = base64;
        return _this;
    }
    Image.prototype.setDefault = function () { };
    return Image;
}(FortuneImageBase));
