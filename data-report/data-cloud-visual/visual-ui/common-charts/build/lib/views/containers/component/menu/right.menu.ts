import {ComponentRightMenuTemplate} from "./template.menu";
import {BaseContainer} from "../../base/base.container";
import {EventEmitter} from "../../../../events/emitter.event";
import {EventType} from "../../../../events/type.event";
import {RightMenuStyle} from "./right.menu.style";

/**
 * Created by wangshouyun on 12/05/2017.
 */

export class ComponentRightMenu extends BaseContainer {

    private rightMenuListArr: Element[] = null;
    private p_containerWidth: number = 0;
    private p_containerHeight: number = 0;

    constructor() {

        super();

        let style = new RightMenuStyle();

        let template = new ComponentRightMenuTemplate();

        //获得模板渲染后的节点
        this.element = this.render(template);

        //存储模块默认顺序
        this.rightMenuListArr = [];
        this.container = this.element.firstElementChild;
        let rightMenuList = this.container.querySelectorAll('div[level="1"]');
        for (let i = 0; i < rightMenuList.length; i++) {
            this.rightMenuListArr.push(rightMenuList[i] as Element);
        }
        for (let node of this.rightMenuListArr) {
           
            let menuContainer = node.querySelector('.rightMenu-list-li') ? node.querySelector('.rightMenu-list-li').firstElementChild : null;
            if (menuContainer) {
                let menuList = menuContainer.querySelectorAll('div[level="2"]');
                let menuArray: Element[] = [];
                for (let i = 0; i < menuList.length; i++) {
                    menuArray.push(menuList[i]);
                }
            }
        }

        //添加鼠标移入移出事件
        this.element.addEventListener("mouseleave", (e: any) => {
            this.hide();
        });

        //给菜单添加事件
        this.menuHandle();
    }

    private static _instance: ComponentRightMenu = null;

    public static getInstance(): ComponentRightMenu {
        if (!ComponentRightMenu._instance) {
            ComponentRightMenu._instance = new ComponentRightMenu();
        }
        return ComponentRightMenu._instance;
    }

    private menuHandle(): void {
        let menus: any = this.element.querySelectorAll('div[menu]');
        for (let menu of menus) {
            menu.addEventListener('click', (e: any) => {
                let el = e.currentTarget as Element;
                let operator = el.getAttribute('menu');
                this.hide();
                EventEmitter.trigger(EventType.COMRIGHTMENU, {menu: operator, scopeID: this.scopeID});
            })
        }
    }

    public show(scopeID: string, point: any): void {
        this.scopeID = scopeID;
        this.addStyle("display", "block");

        this.p_containerWidth = this.parent.container['offsetWidth'];
        this.p_containerHeight = this.parent.container['offsetHeight'];

        if (point.x < this.p_containerWidth / 2 && point.y < this.p_containerHeight / 2) {
            this.x = point.x - 5;
            this.y = point.y - 5;
            this.directLayout("left-top");
        }
        if (point.x < this.p_containerWidth / 2 && point.y > this.p_containerHeight / 2) {
            this.x = point.x - 5;
            this.y = point.y - this.height + 5;
            this.directLayout("left-bottom");
        }
        if (point.x > this.p_containerWidth / 2 && point.y < this.p_containerHeight / 2) {
            this.x = point.x - this.width + 5;
            this.y = point.y - 5;
            this.directLayout("right-top");
        }
        if (point.x > this.p_containerWidth / 2 && point.y > this.p_containerHeight / 2) {
            this.x = point.x - this.width + 5;
            this.y = point.y - this.height + 5;
            this.directLayout("right-bottom");
        }
    }

    public hide(): void {
        this.addStyle("display", "none");
    }

    private directLayout(direct: String): void {
        console.info("direct===", direct);

        switch (direct) {
            case "left-top":
                break;
            case "left-bottom":
                this.rightMenuListArr.reverse();

                break;
            case "right-top":
                break;
            case "right-bottom":
                break;
        }
        this.container.innerHTML = "";
        for (let item of this.rightMenuListArr) {
            this.container.appendChild(item);
        }
    }

}