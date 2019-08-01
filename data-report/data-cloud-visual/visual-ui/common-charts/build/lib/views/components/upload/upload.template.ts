/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseTemplate} from "../../base/template.base";

export class UploadTemplate extends BaseTemplate{
    constructor(scopeID: String){
        super(`<div component id=${scopeID} style="width:100%;height: 100%;display:table">
                    <div style="display: table-cell;vertical-align: middle;padding: 0 13px;font-family: '微软雅黑'" id="upload">
                        上传图片
                     </div>
                     <div class="upload_layer" id="upload_layer">
                         <p><input type="file" id="upfile"></p>
                         <p><input type="button" id="upJQuery" value="上传"></p>
                     </div>
                </div>`)
    }
}