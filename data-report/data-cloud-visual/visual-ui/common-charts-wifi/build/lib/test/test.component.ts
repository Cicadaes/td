/**
 * Created by wangshouyun on 2017/3/20.
 */
import {BaseComponent} from "../base.component";
import {TestTemplate} from "./test.template";

export class TestComponent extends BaseComponent {

    private myChart: any = null;

    constructor() {
        super();

        let template = new TestTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
    }

    public afterShow(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {
        if (this.myChart) this.myChart.resize();
    }

    public dataChange(data: any): void {

    }

    public styleChange(style: any): void {

    }

    public loadData(): void {
        this.init();
    }

    public getData(): any {

    }

    protected init(): void {

    }

}