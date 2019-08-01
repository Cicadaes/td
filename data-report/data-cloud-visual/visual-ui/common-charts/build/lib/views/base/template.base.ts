/**
 * Created by wangshouyun on 2017/3/8.
 */

import {ATemplate} from "./template.abstract";

export class BaseTemplate extends ATemplate {

    public tpl: string;

    constructor(tpl: string) {
        super();
        this.tpl = tpl;
    }
}