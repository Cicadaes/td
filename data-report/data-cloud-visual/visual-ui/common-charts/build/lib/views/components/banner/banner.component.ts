/**
 * Created by zhaoxue on 2017-03-31.
 */
import {BaseComponent} from "../base.component";
import {BannerTemplate} from "./banner.template";
import {BannerModel} from './banner.model';

export class BannerComponent extends BaseComponent{
    private bannerData:BannerModel = null;
    private bannerBg:any = null;
    private container:Element = null;
    constructor(){
        super();

        let template = new BannerTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.bannerData = new BannerModel();
        this.bannerBg = this.element.querySelector('div');

        this.bannerBg.style.backgroundColor = this.bannerData.backgroundColor;

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

    }

    public styleChange(style: any): void {
        if(this.container == null){
            this.container = this.element.querySelector("div[container]");
        }
        this.container['style'].backgroundColor = style.backgroundColor;
    }

    public loadData(): void {

    }

    public get data():any{
        return this.bannerData;
    }

    protected init(): void{


    }
}