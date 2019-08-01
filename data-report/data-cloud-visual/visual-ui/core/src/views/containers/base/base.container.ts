/**
 * Created by wangshouyun on 2017/3/20.
 */

import {BaseView} from "../../base/view.base";

export class BaseContainer extends BaseView {
    container: Element;
    hasLoad: Boolean;
    private _isSelect: Boolean;
    private _parent: BaseContainer;

    constructor() {
        super();
        this.hasLoad = false;
    }

    public set isSelect(select: Boolean) {
        this._isSelect = select;
        if (select) {
            this.element['style'].border = "2px solid #5F93E1";
           console.log(this.element.childNodes[1])
        this.element.childNodes[1]['style'].display="block ";
        } else {
            this.element['style'].border = "1px solid transparent";
            this.element.childNodes[1]['style'].display="none";
        }
    }

    public get isSelect(): Boolean {
        return this._isSelect;
    }


    public set parent(p: BaseContainer) {
        this._parent = p;
    }

    public get parent(): BaseContainer {
        return this._parent;
    }

}