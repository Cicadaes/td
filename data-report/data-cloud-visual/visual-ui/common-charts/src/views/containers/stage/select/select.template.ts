import {BaseTemplate} from "../../../base/template.base";
/**
 * Created by wangshouyun on 2017/3/20.
 */

export class SelectTemplate extends BaseTemplate {
    constructor(scopeID: string) {
        super(`<div select-container=${scopeID} style="position: absolute;
                    width: 1px;height: 1px;border: 1px solid #5697f1;z-index: 5">
               </div>`);
    }
}