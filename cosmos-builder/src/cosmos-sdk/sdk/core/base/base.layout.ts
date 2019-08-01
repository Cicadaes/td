import { ViewType } from "./base.view";
import { LayoutInterface } from "../layouts/layout.interface";
import { View } from "../views/view";


export class BaseLayout extends View implements LayoutInterface {

    constructor() {
        super();

        // 设置默认类型
        this.type = ViewType.layout;
    }

}