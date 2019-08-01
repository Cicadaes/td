/**
 * Created by zhaoxue on 2017-03-31.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_base_1 = require("datwill-sdk/lib/views/base/model.base");
var FontModel = (function (_super) {
    __extends(FontModel, _super);
    function FontModel() {
        var _this = _super.apply(this, arguments) || this;
        /** font value*/
        _this.font_value = "请输入文字";
        /** font background*/
        _this.backgroundColor = '#fff';
        /** font fontSize*/
        _this.font_fontSize = '12px';
        _this.font_fontColor = '#000';
        /** font fontFamily*/
        _this.font_fontFamily = "微软雅黑";
        return _this;
    }
    return FontModel;
}(model_base_1.BaseModel));
exports.FontModel = FontModel;
//# sourceMappingURL=font.model.js.map