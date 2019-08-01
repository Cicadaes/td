import { BaseComponent } from '../base.component';
import { VueTemplate } from './vue.template';

export class VueComponent extends BaseComponent {
    // protected vue:Vue = null;

    constructor() {
        super();

        let template = new VueTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);

        // //绑定 vue 实例
        // this.vue = new Vue({
        //     el:this.element
        // });
    }

    public afterShow(): void {
       
    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    public dataChange(data: any): void {
              
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data(): any {
        return null;
    }


}