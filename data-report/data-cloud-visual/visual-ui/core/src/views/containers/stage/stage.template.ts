/**
 * Created by wangshouyun on 2017/3/20.
 */
import {BaseTemplate} from "../../base/template.base";

export class StageTemplate extends BaseTemplate {
    constructor(scopeID: string) {
        super(`<div stage-container=${scopeID} style="height: 500px;position: relative; z-index:2;box-sizing: border-box;
                    left: 0;top: 0;right: 0;bottom: 0;will-change: transform;">
                    <div containerSide=${scopeID} style="width: 100%;height: 100%;position:
                     relative;background: #eef0fc;background-size: 10px 10px;
    background-position: 1px 1px;"></div>
               </div>`);
    }
}
