import {Component,Input} from '@angular/core';
import {DialogData, DialogConfirm} from "../../common/dialog/dialog_data.model";
import {DatasourceCommunicationService} from "../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../report-service/datacause.service";
import {DialogCommunicationService} from "../../report-service/dialog.communication.service";
@Component({
    selector:'report-dialog',
    templateUrl:'report-dialog.component.html',
    styles: [`
       :host/deep/ .ui-dialog-titlebar .ui-widget-header .ui-helper-clearfix .ui-corner-top {
         text-align:left;
       }       
        :host/deep/ .leftContainer{
          float:left;
          width:120px; 
          height:400px;         
          border:1px solid #ccc;
          margin-right:10px;
        }
        :host/deep/ .leftContainer li{
          height:32px;
          line-height:32px;
          font-size:14px;
          font-weight:bold;
          text-align:center;
          color:#000;
        }
      :host/deep/ .leftContainer li:hover{
        background:#5697f1;
      }
      .on{
          background:#5697f1;
      }
       :host/deep/ .leftContent li:hover{
        background:#5697f1;
      }
       :host/deep/ .rightContainer{
          float:left;
          height:400px; 
          width:616px;
          border:1px solid #ccc;
          padding: 0 10px;
        }
        .topContent{
          width:100%;
          height:auto;
          margin-bottom:20px;
        }
        .topContent p{
          height:30px !important;
          line-height:-15px !important;
          padding:10px 0 !important;
        }
        .leftContent{
          width:250px;
          float:left;  
          height:200px;
          margin-right:10px;
        }
        .leftContent dl dt{
          width:100px !important;
        }
        .leftContent dl dd{
           width:100% !important;
           height:200px;   
           border:1px solid #ccc;
        }
        .leftContent li{
          height:30px;
          line-height:30px;
        } 
        .rightContent{
          width:300px;
          float:left;
          height:310px;
          border:1px solid #ccc;
          overflow-y:scroll;
          position:relative;
        }  
        .rightContent p{
          width:50px;
          height:20px !important;
          background:#fff;      
          position:absolute;
          top:-8%;
          left:20%;
          text-align:center;         
          padding:10px 0 !important;
        }
        .rightContent dl input{
          width:200px !important;
          border-radius:0 !important;
          border:1px solid #000 !important;
          border:1px solid #ccc !important;
        }
        .rightContent dl dt{
          display:inline-block !important;
        }
        .rightContent dl dd{
          display:inline-block !important;
        }
         .topContent div input{
          display:inline-block;
          width:400px;
          height:32px;
          border:1px solid #000 !important;
        }
        .tab{
          width:600px !important;
          float:left;
        }
        .report_errTips{        
           color:#f00;
        }
        .report_errborder{
           border:1px solid #f00;
        }
       
    `]
})
export class ReportDialogComponent {
   display: boolean =true;
   dataType:any;
   dataCauseList:any = [];
   adaptersData:any = [];
   paramObj:any = {};
   reportErrorTips:string="";
  //  adapterId:any;
  arr:any =[{name:"主机名",value:"<input >"},
            {name:"主机名",value:"<input >"},
            {name:"主机名",value:"<input >"},
            {name:"主机名",value:"<input >"}
           ]

   constructor(
               private communication: DatasourceCommunicationService,
                private datacauseCommunicationService: DatacauseCommunicationService,
                private dialogCommunicationService: DialogCommunicationService
   ){  
     this.getDataTypes()   
  
  }  

  clickCon(e:any){
     if(e.target=="基本设置"){
          this.display=true
     }else{
         this.display=!this.display;
     }
  } 
// 数据源类型
  getDataTypes(){
    this.communication.querysource().then(res=>{
    this.dataType=res;
     this.dataType.forEach((i:any)=>{
         this.dataCauseList.push({name:i.name,value:i.id})
     }) 
    }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '请求失败', detail: err._body }))      
  }
// 渲染inputList
  clickType(data:any){
     this.getAdaptersData(data.value) 

  }
   getAdaptersData(adapterId:any){
         this.communication.queryadaptersData(adapterId).then((res:any) => {
            this.adaptersData = res.dataSourceView.fieldTabs[0].fieldGroups[0].fields; 
        }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '请求失败', detail: err._body }))
      
    }

     checkFromData(){
      console.log(this.adaptersData)
        for(let i in this.adaptersData){        
            if(this.adaptersData[i].value == "" && this.adaptersData[i].code=="host"){
                this.reportErrorTips = "host不能为空"
                return false;
            }else if(this.adaptersData[i].value == "" && this.adaptersData[i].code=="port"){
               this.reportErrorTips = "port不能为空"
               return false;
            }
        }
       
    }
  
 

// 生成列表格式
  // getDataCauseList(dataSourceList: any[]):any{     
  //        this.dataCauseList= [{label: "请选择", value: ""}];
  //       if(dataSourceList){
  //           dataSourceList.forEach((i:any)=>{
  //               debugger
  //               this.dataCauseList.push({ label: i.name, value: i.id})
                             
  //           });
  //           return this.dataCauseList;          
  //       }
  //   }











  
}