/**
 * Created by wangshouyun on 2017/3/20.
 */
import {BaseTemplate} from "datwill-sdk/lib/views/base/template.base";

export class TestTemplate extends BaseTemplate {
    constructor(scopeID: String) {
        super(`<div component id=${scopeID} style="width:100%;height: 100%"></div>`);
    }
}