import {StageRightMenuTemplate} from "./template.menu";
import {BaseContainer} from "../../base/base.container";

/**
 * Created by wangshouyun on 12/05/2017.
 */

export class StageRightMenu extends BaseContainer {

    constructor() {

        super();

        let template = new StageRightMenuTemplate();

        //获得模板渲染后的节点
        this.element = this.render(template);

    }

    private static _instance: StageRightMenu = null;

    public static getInstance(): StageRightMenu {
        if (!StageRightMenu._instance) {
            StageRightMenu._instance = new StageRightMenu();
        }
        return StageRightMenu._instance;
    }

    private context: any;

    public init(context: any) {
        this.context = context;
        context.element.addEventListener('contextmenu', (e: any) => {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            this.x = e.clintX;
            this.y = e.clientY;
        });
    }

}