/**
 * Created by zhaoxue on 2017-03-31.
 */
import {BaseTemplate} from "datwill-sdk/lib/views/base/template.base";

export class FontTemplate extends BaseTemplate {
    constructor(scopeID: String) {
        super(`<div component=${scopeID} style="width:100%;height: 100%;background-color: white">
                 <input container type="text" placeholder="请输入文字" style="width: 100%;height: 100%;outline: none">
                </div>`)
    }
}