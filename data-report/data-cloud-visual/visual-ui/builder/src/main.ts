/**
 * Created by wangshouyun on 2016/12/17.
 */
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {AppModule} from './app/modules/app.module';
//console.log(process.env.ENV)
if (process.env.ENV === 'production') {
    enableProdMode();
}

let jsessionidStr = window.location.href.replace(window.location.origin, "");
if (jsessionidStr.indexOf('/;jsessionid') == 0) {
    window.location.href = window.location.origin + "/datareport";
}

platformBrowserDynamic().bootstrapModule(AppModule);
