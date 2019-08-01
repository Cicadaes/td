/**
 * Created by wangshouyun on 2017/3/8.
 */
"use strict";
var EventObserver = (function () {
    function EventObserver(callback, context) {
        this.callback = null;
        this.context = null;
        var self = this;
        self.callback = callback;
        self.context = context;
    }
    EventObserver.prototype.notify = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var self = this;
        (_a = self.callback).call.apply(_a, [self.context].concat(args));
        var _a;
    };
    EventObserver.prototype.compar = function (context) {
        return context == this.context;
    };
    return EventObserver;
}());
exports.EventObserver = EventObserver;
//# sourceMappingURL=observer.event.js.map