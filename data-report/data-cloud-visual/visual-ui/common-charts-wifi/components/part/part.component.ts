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
   
     private partdata:any= {
                        "销售金额": [
                            {
                                "metric": 1484,
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": 4240,
                                "date": "9.15-9.18"
                            }
                        ],
                        "订单数": [
                            {
                                "metric": 11340,
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": 3240,
                                "date": "9.15-9.18"
                            }
                        ],
                        "入店客流": [
                            {
                                "metric": 338240,
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": 94277,
                                "date": "9.15-9.18"
                            }
                        ],
                        "转化率": [
                            {
                                "metric": "3.35%",
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": "3.44%",
                                "date": "9.15-9.18"
                            }
                        ],
                        "客单价": [
                            {
                                "metric": "3.35%",
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": "3.44%",
                                "date": "9.15-9.18"
                            }
                        ],
                        "VPC": [
                            {
                                "metric": "3.35%",
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": "3.44%",
                                "date": "9.15-9.18"
                            }
                        ],
                        "IPC": [
                            {
                                "metric": "3.35%",
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": "3.44%",
                                "date": "9.15-9.18"
                            }
                        ]
                    } 
    
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
         super.onChange(this,{});         
    }
    public dataChange(data: any): void {    
        data=this.partdata= {
                        "销售金额": [
                            {
                                "metric": 1484,
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": 4240,
                                "date": "9.15-9.18"
                            }
                        ],
                        "订单数": [
                            {
                                "metric": 11340,
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": 3240,
                                "date": "9.15-9.18"
                            }
                        ],
                        "入店客流": [
                            {
                                "metric": 338240,
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": 94277,
                                "date": "9.15-9.18"
                            }
                        ],
                        "转化率": [
                            {
                                "metric": "3.35%",
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": "3.44%",
                                "date": "9.15-9.18"
                            }
                        ],
                        "客单价": [
                            {
                                "metric": "3.35%",
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": "3.44%",
                                "date": "9.15-9.18"
                            }
                        ],
                        "VPC": [
                            {
                                "metric": "3.35%",
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": "3.44%",
                                "date": "9.15-9.18"
                            }
                        ],
                        "IPC": [
                            {
                                "metric": "3.35%",
                                "date": "9.19-9.25"
                            },
                            {
                                "metric": "3.44%",
                                "date": "9.15-9.18"
                            }
                        ]
                    } 
        this.init();      
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
        
        let arr=[],arr1,arr2,arr3,obj1={},obj2={},obj3={},partOne="",partTwo="",partThree=""
        for(let key in this.partdata){
            arr.push(key)         
        }
        arr1=arr.slice(0,1)
        arr2=arr.slice(1,3)
        arr3=arr.slice(3)
          for(let key in this.partdata){
              for(let j=0;j<arr1.length;j++){
                if(arr1[j]==key){
                partOne+= '<div class="child_list"><span><a>'+key+'</a></span><span><div><b>'+this.partdata[key][0].metric+'</b><em>'+this.partdata[key][0].date+'</em></div><b>'+this.partdata[key][1].metric+'</b>'+'<em>'+this.partdata[key][1].date+'</em></span></div>'   
                }
              }
               for(let n=0;n<arr2.length;n++){
                if(arr2[n]==key){
                partTwo+= '<div class="child_list"><span><a>'+key+'</a></span><span><b>'+this.partdata[key][0].metric+'</b><em>'+this.partdata[key][0].date+'</em></br><b>'+this.partdata[key][1].metric+'</b>'+'<em>'+this.partdata[key][1].date+'</em></span></div>'   
                }
              }
              for(let x=0;x<arr3.length;x++){
                if(arr3[x]==key){
                     console.log(this.partdata[key])                
                partThree += '<div class="child_list"><span><a>'+key+'</a></span><span><b>'+this.partdata[key][0].metric+'</b><em>'+this.partdata[key][0].date+'</em></br><b>'+this.partdata[key][1].metric+'</b>'+'<em>'+this.partdata[key][1].date+'</em></span></div>'
                   
                }
              }            
          }
      
       let  partContent='<div class="child">'+partOne+
                        '</div>'+'<div class="child">'+partTwo+
                        '</div>' +'<div class="child">'+partThree+   
                        '</div>'              
           $(".tree").html(partContent)      
           $(".child_list").each(function(){
                 if(parseFloat($(this).find("b").eq(0).text())>parseFloat($(this).find("b").eq(1).text())){
                  $(this).find("b").eq(0).removeClass().addClass("up")
             }else{
                  $(this).find("b").eq(0).removeClass().addClass("down")
            }
            })
        

    }




}