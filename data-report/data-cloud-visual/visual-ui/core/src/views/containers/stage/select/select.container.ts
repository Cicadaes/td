/**
 * Created by wangshouyun on 2017/3/22.
 */
import {BaseContainer} from "../../base/base.container";
import {SelectTemplate} from "./select.template";

export class SelectContainer extends BaseContainer {
    constructor() {
        super();

        let template = new SelectTemplate(this.scopeID);

        //模板渲染后获得当前节点
        this.element = this.render(template);
    }
}