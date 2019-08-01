"use strict";
/**
 * Created by wangshouyun on 2017/3/24.
 */
var Timer = (function () {
    function Timer() {
        this.timeoutHandle = 0;
        this.intervalHandle = 0;
    }
    Timer.prototype.startTimeOut = function (second, fun, context) {
        this.stopTimeOut();
        this.timeoutHandle = setTimeout(function () {
            fun.call(context);
        }, second * 1000);
    };
    Timer.prototype.stopTimeOut = function () {
        clearTimeout(this.timeoutHandle);
    };
    Timer.prototype.startInterval = function (second, fun, context) {
        this.stopInterval();
        this.intervalHandle = setInterval(function () {
            fun.call(context);
        }, second * 1000);
    };
    Timer.prototype.stopInterval = function () {
        clearTimeout(this.intervalHandle);
    };
    return Timer;
}());
exports.Timer = Timer;
//# sourceMappingURL=timer.js.map