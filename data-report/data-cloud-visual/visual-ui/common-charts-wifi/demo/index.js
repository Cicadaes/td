/**
 * Created by wangshouyun on 2017/3/7.
 */
"use strict";
var datwillsdk_1 = require("../node_modules/datwill-sdk/lib/datwillsdk");
var test_1 = require("./test");
datwillsdk_1.DatWillSDK.getInstance().createStage('.stage');
test_1.Test.init(datwillsdk_1.DatWillSDK);
window['DatWillSDK'] = datwillsdk_1.DatWillSDK;
//# sourceMappingURL=index.js.map