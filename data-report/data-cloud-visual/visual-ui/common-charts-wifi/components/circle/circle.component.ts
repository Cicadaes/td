/**
 * Created by zhaoxue on 2017-03-31.
 */
import {BaseComponent} from "../base.component";
import {CircleTemplate} from "./circle.template";
import {CircleModel} from './circle.model';

export class CircleComponent extends BaseComponent{
    private circleData:CircleModel = null;
    private circleBg:any = null;
    private container:Element = null;
    constructor(){
        super();

        let template = new CircleTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.circleData = new CircleModel();
        this.circleBg = this.element.querySelector('div');

        this.circleBg.style.backgroundColor = this.circleData.backgroundColor;

    }

    public beforeShow(): void {

    }

    public afterShow(): void {

    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    public dataChange(data: any): void {
        
    }

    public styleChange(style: any): void {
        if(this.container == null){
            this.container = this.element.querySelector("div[container]");
        }
        this.container['style'].backgroundColor = style.backgroundColor;
    }

    public loadData(): void {
        this.init();

    }

    public get data():any{
        return this.circleData;
    }

    protected init(): void{


    }
}