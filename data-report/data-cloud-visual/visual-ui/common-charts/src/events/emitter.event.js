/**
 * Created by wangshouyun on 2017/3/8.
 */
"use strict";
var observer_event_1 = require("./observer.event");
var EventEmitter = (function () {
    function EventEmitter() {
    }
    EventEmitter.restoreListeners = function () {
        EventEmitter.listeners = {};
    };
    EventEmitter.register = function (name, callback, context) {
        //先尝试取消，避免重复订阅。
        EventEmitter.unRegister(name, callback, context);
        var observers = EventEmitter.listeners[name];
        if (!observers) {
            EventEmitter.listeners[name] = [];
        }
        EventEmitter.listeners[name].push(new observer_event_1.EventObserver(callback, context));
    };
    EventEmitter.unRegister = function (name, callback, context) {
        var observers = EventEmitter.listeners[name];
        if (!observers)
            return;
        var length = observers.length;
        for (var i = 0; i < length; i++) {
            var observer = observers[i];
            if (observer.compar(context)) {
                observers.splice(i, 1);
                break;
            }
        }
        if (observers.length == 0) {
            delete EventEmitter.listeners[name];
        }
    };
    EventEmitter.trigger = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var observers = EventEmitter.listeners[name];
        if (!observers)
            return;
        var length = observers.length;
        for (var i = 0; i < length; i++) {
            var observer = observers[i];
            observer.notify.apply(observer, [name].concat(args));
        }
    };
    return EventEmitter;
}());
EventEmitter.listeners = {};
exports.EventEmitter = EventEmitter;
//# sourceMappingURL=emitter.event.js.map