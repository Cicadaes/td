/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {DateformatTemplate} from "./dateformat.template";
import {DateformatModel} from './dateformat.model';

export class DateformatComponent extends BaseComponent {
    private myPrimeui:any = null;
    private chartData:any = null;
    private dateformatData:DateformatModel = null;
    private echartData:any = null;

    constructor(){

        super();

        let template = new DateformatTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.dateformatData = new DateformatModel();
    }

    public beforeShow(): void {

    }

    public afterShow(): void {
        this.init();
    }

    public beforeDestory(): void {

    }

    public afterDestory(): void {

    }

    public resize(): void {

    }

    public getconfiginformation(event:any,changeObj:any): void{

    }

    public dataChange(data: any): void {
        console.log(data,1111)
    }

    public styleChange(style: any): void {

    }

    public loadData(): void {

    }

    public get data():any{
        return this.chartData;
    }

    protected init(): void{

    }

}