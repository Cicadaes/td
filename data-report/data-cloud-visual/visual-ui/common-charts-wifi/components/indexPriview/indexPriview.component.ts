/**
 * Created by zhaoxue on 2017/3/28.
 */
import {BaseComponent} from "../base.component";
import {IndexPriviewTemplate} from "./indexPriview.template";
import {IndexPriviewModel} from './indexPriview.model';
import * as $ from 'jquery';

export class IndexPriviewComponent extends BaseComponent {
     private chartData: any = null; 
     private container: any =null;
     private Data:any=null;

     constructor() {
        super();

         let template = new IndexPriviewTemplate(this.scopeID);
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
           super.onChange(this,{});           
          
    }

    public dataChange(data: any): void {      
        this.Data=data;
         this.initHtml(); 
    }

    public styleChange(style: any): void {
    }

    public loadData(): void {  
    }

    public get data(): any {
        return this.chartData;
        
    }
    protected initHtml(): void {  
         let html="";    
        let arr=[];   
       for(let key in this.Data){         
          let brandHtml="";
          for(let i=0;i<this.Data[key].brand.length;i++){
              if(this.Data[key].brand[i].active_hour_users && this.Data[key].brand[i].percentage ){
                  brandHtml+='<li><b>'+this.Data[key].brand[i].brand+'</b><span>'+this.Data[key].brand[i].active_hour_users+'</span><strong>'+this.Data[key].brand[i].percentage+'</strong></li>'      
             }else {
                 if(this.Data[key].brand[i].percentage){
                     brandHtml+='<li><b>'+this.Data[key].brand[i].brand+'</b><strong>'+this.Data[key].brand[i].percentage+'</strong></li>'       
                 }else{
                      brandHtml+='<li><b>'+this.Data[key].brand[i].brand+'</b><span>'+this.Data[key].brand[i].active_hour_users+'</span></li>' 
                      if(!this.Data[key].brand[i].active_hour_users && !this.Data[key].brand[i].percentage ) {
                       brandHtml="";
                   }  
                 }
                 
              }               
             
             }  
         html += '<div class="indexPriview">'+
                   '<p>'+key+'</p><ul class="data">'+
                       '<li><b>'+this.Data[key].total.total+'</b><span>'+this.Data[key].total.time+'</span></li>'+
                       '<li><b>'+this.Data[key].before.before_total+'</b><span>'+this.Data[key].before.before_time+'</span></li>'+
                   '</ul><ul class="type">'+brandHtml+'</ul></div>' 
        arr.push(key)
     }
      $('#'+this.scopeID).html(html)
        let len=arr.length;
       $(".indexPriview").css("width",(100/len)+"%")
      console.log((100/len)+"%")
    }

}
