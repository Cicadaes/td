// import { Utils } from '../../../../build/lib/public/scripts/utils';
/**
 * Created by zhaoxue on 2017-03-31.
 */
import {BaseComponent} from "../base.component";
import {PriviewTemplate} from "./priview.template";
import {PriviewModel} from './priview.model';
import {Utils} from '../../public/scripts/utils';

export class PriviewComponent extends BaseComponent{
    private priviewData:PriviewModel = null;
    private overviewValue:any = null;
    private container:Element = null;
    private container1:Element = null;
    private container2:Element = null;
    private peiviewData:PriviewModel = null;
    constructor(){
        super();
        let template = new PriviewTemplate(this.scopeID);
        //获得模板渲染后的节点
        this.element = this.render(template);
        this.priviewData = new PriviewModel();
        this.overviewValue = this.element.querySelector('div');

        this.overviewValue.style.backgroundColor = this.priviewData.backgroundColor;
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
        console.log(data)
         data['priviewtype'] = "priviewtype";
        //  内容
         this.container = this.element.querySelector("h4[containerH4]");
        //  标题
         this.container1 = this.element.querySelector("h3[containerH3]");   
         for(let i=0;i<data.length;i++){
             for(let key in data[i]){
                this.container1.innerHTML=key;
                this.container.innerHTML=data[i][key];
             }
                          
         }
    }

      public styleChange(style: any): void {   
        //大容器  内容 标题     
         this.container2=this.element.querySelector('div[container]')
         this.container = this.element.querySelector("h4[containerh4]");
         this.container1 = this.element.querySelector("h3[containerh3]");      
      this.container2['style'].backgroundColor= style.backgroundColor;
     // 标题样式
      this.container1['style'].color =style.title_fontcolor;
      this.container1['style'].fontSize=style.title_fontSize;
      this.container1['style'].fontFamily=style.title_fontFamily;
      this.container1['style'].lineHeight=style.lineHeight;
      this.container1['style'].marginLeft=style.marginLeft;
      this.container1['style'].marginTop=style.marginTop;
      this.container1['style'].marginRight=style.marginRight;   
      Utils.changeTitleSite(style,this.container1['style'])

    //  概览样式 
      this.container['style'].color=style.value_fontcolor; 
      this.container['style'].fontSize=style.value_fontSize; 
      this.container['style'].fontFamily=style.value_fontFamily;
      this.container['style'].lineHeight=style.lineHeight;
      this.container['style'].marginLeft=style.marginLeft;
      this.container['style'].marginTop=style.marginTop;
      this.container['style'].marginRight=style.marginRight;
  
      Utils.changeValueSite(style,this.container['style'])
   

    }

    public loadData(): void {
        this.init();
    }

    public get data():any{
        return this.priviewData;
    }

    protected init(): void{


    }
} 