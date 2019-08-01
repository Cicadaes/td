/**
 * Created by ZHAOXUE on 2017/12/08.
 */
"use strict";
var PATHJSON = (function () {
    function PATHJSON() {
    }
    //开发
    // public static urlHost = "http://172.23.4.44:9097";
    // public static urlHostLifeCycleList = "http://172.23.6.189";
    // public static urlHostRFM = "http://172.23.6.189";
    // 绫致
    PATHJSON.urlHost = function () {
        var str = "";
        if (window.location.host == '172.23.6.189' || window.location.host == 'localhost') {
            str = "http://172.23.4.44:9097";
        }
        else {
            str = "http://10.150.33.122:9500";
        }
        return str;
    };
    ;
    return PATHJSON;
}());
PATHJSON.urlHostLifeCycleList = window.location.origin;
PATHJSON.urlHostRFM = window.location.origin;
exports.PATHJSON = PATHJSON;
//# sourceMappingURL=path.js.map