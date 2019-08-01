"use strict";
var AHttp = (function () {
    function AHttp() {
    }
    AHttp.prototype.getXmlHttp = function () {
        var xmlhttp;
        if (window['XMLHttpRequest']) {
            //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
            xmlhttp = new XMLHttpRequest();
        }
        else {
        }
        return xmlhttp;
    };
    AHttp.prototype.getParams = function (params) {
        var paramString = "";
        for (var key in params) {
            paramString += encodeURI(key) + "=" + encodeURI(params[key]) + "&";
        }
        return paramString.substr(0, paramString.length - 1);
    };
    return AHttp;
}());
exports.AHttp = AHttp;
//# sourceMappingURL=http.abstract.js.map