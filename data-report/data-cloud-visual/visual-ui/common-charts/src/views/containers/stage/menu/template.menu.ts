import {BaseTemplate} from "../../../base/template.base";

export class StageRightMenuTemplate extends BaseTemplate {
    constructor() {
        super(`<div style="position: absolute;width: 100px;border: 1px solid #cc0033">
                    <div style="position: relative;width: 100%">
                        <div style="width: 100%;border-bottom: 1px solid gray;padding: 5px 0">删除</div>
                    </div>
               </div>`);
    }
}