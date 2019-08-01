import { BaseContainer } from "../base/base.container";
import { Scope } from "./../utils/scope";
import { DataStore } from '../stores/data.store';
import { View } from "./view";

export class Container extends BaseContainer {

    constructor(query: any) {
        super(query);
    }

    public addChild(view: View): void {
        this.el.appendChild(view.el);
        view.onCreate();
    }

    public removeChild(view: View): void {
        DataStore.removeComponentInstance(view);
        let children = view.container.allChildren;
        let len = children.length;
        for(let i = 0; i < len; i++){
            children[i].onDestroy();
        }

        this.el.removeChild(view.el);
        view.onDestroy();
    }

    public removeAllChild():void {
        for (let view of this.children) {
            this.removeChild(view);
        }
    }

    public replaceChild(view: View, oldNode: Element) {
        this.el.replaceChild(view.el, oldNode);
        view.onCreate();
    }

    //获取当前容器直接后代元素
    public get allChildren(): View[] {
        let views: View[] = [];
        let children = this.el.children;
        this.getAllChildren(this.el, views);
        return views;
    }

     
     //获取当前容器所有后代元素
     public get children(): View[] {
        let views: View[] = [];
        let children = this.el.children;
        for (let i = 0; i < children.length; i++) {
            let scope = children[i].getAttribute('cm-scope');
            let childComponent = DataStore.getComponentInstance(scope);
            if (childComponent){
                views.push(childComponent);
            } 
        }

        return views;
    }

    /**
     * 获取所有后代元素
     * @param el 当前元素
     * @param views 后代元素的数组
     */
    public getAllChildren(el:any, views:any){
        let children = el.children;
        if(children && children.length > 0){
            for (let i = 0; i < children.length; i++) {
                let scope = children[i].getAttribute('cm-scope');
                let childComponent = DataStore.getComponentInstance(scope);
                if (childComponent){
                    views.push(childComponent);
                    this.getAllChildren(childComponent.container.el, views);
                } 
            }
        }
        
    }

     // 获取父容器实例
     public getParent(el: HTMLElement): Container {
        let parent = el.parentElement;
        while (parent && (!parent.getAttribute('cm-scope') || parent.hasAttribute('container'))) {
            parent = parent.parentElement;
        }
        return DataStore.getInstance().componentData[parent && parent.getAttribute('cm-scope')];
    }

    onDestroy() {
        this.removeAllChild();
    }


}