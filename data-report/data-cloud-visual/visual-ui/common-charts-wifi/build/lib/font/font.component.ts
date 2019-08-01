/**
 * Created by zhaoxue on 2017-03-31.
 */
import {BaseComponent} from "../base.component";
import {FontTemplate} from "./font.template";
import {FontModel} from './font.model';

export class FontComponent extends BaseComponent {
    private fontData:FontModel = null;
    private fontStyle:any = null;
    private container:any = null;

    constructor() {
        super();

        let template = new FontTemplate(this.scopeID);

        //获得模板渲染后的节点
        this.element = this.render(template);
        this.fontData = new FontModel();
        //获得文本框
        this.fontStyle = this.element.querySelector('input');
        this.fontStyle.style.fontSize = this.fontData.font_fontSize;
        this.fontStyle.style.color = this.fontData.font_fontColor;
        this.fontStyle.style.fontFamily = this.fontData.font_fontFamily;
        this.fontStyle.style.backgroundColor = this.fontData.backgroundColor;
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
        console.log(data,)
        if(this.container == null){
            this.container = this.element.querySelector("input[container]");
        }
        if(data.font_value == undefined){
            data.font_value = "请输入文字"
        }
        this.container.value = data.font_value;
    }

    public styleChange(style: any): void {
        console.log(style)
        if(this.container == null){
            this.container = this.element.querySelector("input[container]");
        }
        this.container['style'].fontSize = style.font_fontSize;
        this.container['style'].color = style.font_fontColor;
        this.container['style'].fontFamily = style.font_fontFamily;
        this.container['style'].backgroundColor = style.backgroundColor;
    }

    public loadData(): void {
        this.init();
    }

    protected init(): void {


    }
}