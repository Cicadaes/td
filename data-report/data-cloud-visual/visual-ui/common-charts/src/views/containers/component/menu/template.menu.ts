import {BaseTemplate} from "../../../base/template.base";

export class ComponentRightMenuTemplate extends BaseTemplate {
    constructor() {
        super(`<div class="rightMenu">
                    <div style="position: relative;width: 100%;height: 100%">
                        <div menu="delete" class="rightMenu-list" level="1">
                            删除
                        </div>
                        <div class="rightMenu-list" level="1">
                            图层
                            <div class="rightMenu-list-li">
                                <div style="position: relative;width: 100%;height: 100%;background-color: white">
                                    <div menu="up_layer" class="rightMenu-list" level="2">上移一层</div>
                                    <div menu="down_layer" class="rightMenu-list" level="2">下移一层</div>
                                    <div menu="top_layer" class="rightMenu-list" level="2">置顶</div>
                                    <div menu="bottom_layer" class="rightMenu-list" level="2">置底</div>
                                </div>
                            </div>
                        </div>
                        <div class="rightMenu-list" level="1">
                            对齐
                            <div class="rightMenu-list-li">
                                <div style="position: relative;width: 100%;height: 100%;background-color: white">
                                    <div menu="align_left" class="rightMenu-list" level="2">左对齐</div>
                                    <div menu="align_right" class="rightMenu-list" level="2">右对齐</div>
                                    <div menu="align_top" class="rightMenu-list" level="2">上对齐</div>
                                    <div menu="align_bottom" class="rightMenu-list" level="2">下对齐</div>
                                    <div menu="align_center" class="rightMenu-list" level="2">水平居中</div>
                                    <div menu="align_vertical" class="rightMenu-list" level="2">垂直居中</div>
                                </div>
                            </div>
                        </div>
                    </div>
               </div>`);
    }
}