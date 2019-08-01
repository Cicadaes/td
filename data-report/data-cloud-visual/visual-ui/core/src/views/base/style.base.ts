/**
 * Created by wangshouyun on 2017/3/9.
 */
import {AStyle} from "./style.abstract";

export class BaseStyle extends AStyle {

    constructor() {
        super();
    }

    instertToHead(style: string): void {
        let el = document.createElement("style");
        el.setAttribute("rel", "styleSheet");
        el.innerHTML = style;
        document.head.appendChild(el);
    }
}