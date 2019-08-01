"use strict";
/**
 * Created by wangshouyun on 2016/12/17.
 */
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var core_1 = require("@angular/core");
var app_module_1 = require("./app/modules/app.module");
//console.log(process.env.ENV)
if (process.env.ENV === 'production') {
    core_1.enableProdMode();
}
var jsessionidStr = window.location.href.replace(window.location.origin, "");
if (jsessionidStr.indexOf('/;jsessionid') == 0) {
    window.location.href = window.location.origin + "/datareport";
}
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=main.js.map