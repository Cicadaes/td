"use strict";
/**
 * Created by wangshouyun on 2017/3/8.
 */
var HttpHeader = (function () {
    function HttpHeader(config) {
        for (var key in config) {
            this[key] = config[key];
        }
    }
    return HttpHeader;
}());
exports.HttpHeader = HttpHeader;
//# sourceMappingURL=http.header.js.map