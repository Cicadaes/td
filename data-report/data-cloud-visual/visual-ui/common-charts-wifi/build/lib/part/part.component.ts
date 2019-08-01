/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {PartTemplate} from "./part.template";
import {PartModel} from './part.model';
import * as $ from 'jquery';

export class PartComponent extends BaseComponent {
     private chartData: any = null; 
     private container: any =null;   
     private oldValue:string = ''; 
     private settingObjCode:string = '';
     private partData: any =[
                              {
                                name: "销售金额",                                
                                metric: "231,333",
                                date: "6.15-6.21",
                              },
                              {
                                name: "订单数",
                                metric: "231,333",
                                date: "6.15-6.21",
                              },
                              {
                                name: "客单价",
                                metric: "231,333",
                                date: "6.15-6.21",
                              },
                              {
                                name: "入店客流",
                                metric: "231,333",
                                date: "6.15-6.21",
                              },
                              {
                                name: "转化率",
                                metric: "231,333",
                                date: "6.15-6.21",
                              },
                              {
                                name: "VPC",
                                metric: "231,333",
                                date: "6.15-6.21",
                              },
                              {
                                name: "IPC",
                                metric: "231,333",
                                date: "6.15-6.21",
                              }
                            ]
     constructor() {
        super();
        let template = new PartTemplate('aw6knmndkx24zdrz', PartComponent);

        //获得模板渲染后的节点
       this.element = this.render(template);
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

   public settingChange(event:any,target:any): void{
             console.log(target)
        this.getSettingObjChange(target.settingObj)
    }

    private getSettingObjChange(settingObj:any){
        //把第0项放入已选择框里
        let sendObj:Object = Object.assign(
            super.transformInput(settingObj.code,settingObj.result),
            super.transformInput('oldValue',this.oldValue)
        );
        super.onChange(this,sendObj);
        console.log(this.partData)       
         this.init(); 
    }
    public dataChange(data: any): void {    
         data=this.partData;
    }
      public styleChange(style: any): void {
    }
    public loadData(): void {
        this.init();
    }
    public get data(): any {
        return this.chartData;
    }   
    protected init(): void {
      
       let  partContent='<div class="child">'+
                             '<div class="child_list"><span><a>'+this.partData[0].name+'</a></span><span><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b></span></div>'+
                        '</div>'+'<div class="child">'+
                             '<div class="child_list"><span><a>'+this.partData[0].name+'</a></span><span><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b></span></div>'+
                             '<div class="child_list"><span><a>'+this.partData[0].name+'</a></span><span><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b></span></div>'+
                        '</div>' +'<div class="child">'+
                             '<div class="child_list"><span><a>'+this.partData[0].name+'</a></span><span><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b></span></div>'+
                             '<div class="child_list"><span><a>'+this.partData[0].name+'</a></span><span><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b></span></div>'+
                             '<div class="child_list"><span><a>'+this.partData[0].name+'</a></span><span><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b></span></div>'+
                             '<div class="child_list"><span><a>'+this.partData[0].name+'</a></span><span><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b><b>'+this.partData[0].metric+'<em>'+this.partData[0].date+'</em></b></span></div>'+
                        '</div>'              
           $(".tree").html(partContent)
    }




}