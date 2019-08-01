import { BaseLayout } from "../base/base.layout";

export class Layout extends BaseLayout {

    constructor(query: any) {
        super();

        // 设置 el
        if (typeof query === 'string') {
            this.el = document.querySelector(query) as HTMLElement;
        } else {
            this.el = query;
        }

    }

}