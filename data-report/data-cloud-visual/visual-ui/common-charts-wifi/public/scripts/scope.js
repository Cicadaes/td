"use strict";
/**
 * Created by wangshouyun on 2017/3/9.
 */
var Scope = (function () {
    function Scope() {
        this.randomIDArray = [];
    }
    Scope.getInstance = function () {
        if (!Scope._instance) {
            Scope._instance = new Scope();
        }
        return Scope._instance;
    };
    Object.defineProperty(Scope.prototype, "scopeID", {
        get: function () {
            var randomID = this.randomID();
            bk: for (var _i = 0, _a = this.randomIDArray; _i < _a.length; _i++) {
                var id = _a[_i];
                if (randomID == id) {
                    randomID = this.randomID();
                    break bk;
                }
            }
            this.randomIDArray.push(randomID);
            return randomID;
        },
        set: function (id) {
            this.randomIDArray.push(id);
        },
        enumerable: true,
        configurable: true
    });
    Scope.prototype.randomID = function (len) {
        len = len || 16;
        var $chars = 'abcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var id = '';
        for (var i = 0; i < len; i++) {
            id += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return id;
    };
    return Scope;
}());
Scope._instance = null;
exports.Scope = Scope;
//# sourceMappingURL=scope.js.map