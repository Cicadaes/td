import {Component, Input} from '@angular/core';
import {DialogData, DialogConfirm} from "../../common/dialog/dialog_data.model";
import {DatasourceCommunicationService} from "../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../report-service/datacause.service";
import {DialogCommunicationService} from "../../report-service/dialog.communication.service";
@Component({
    selector: 'report-dialog-layer',
    templateUrl: 'report-dialog-layer.component.html',
    styles: [`
        .datasource_active{
            background: #5697f1!important;
            color: #fff!important;
        }
        li.datasource_active.disabled_none{
            background: #5697f1!important;
            color: #fff!important;
        }
        li.disabled_none{
            color: #bdc1d5!important;
            pointer-events:none!important;
            cursor: not-allowed!important;
        }
        li.disabled_none:hover{
            background: transparent!important;
            color: #bdc1d5!important;
        }
        .report_layer{
            margin: 10px 0;
            max-height:600px;
        }
        :host/deep/ .ui-dialog .ui-dialog-content{
            overflow: auto;
        }
       :host/deep/ .ui-dialog-titlebar .ui-widget-header .ui-helper-clearfix .ui-corner-top {
         text-align:left;
       } 
       .leftContent,.rightContent {
           padding-top:0 !important;
       }  
        .leftContainer, .rightContainer{
            margin-bottom:10px! important;
        }
       :host/deep/ .leftContainer, .rightContainer,.leftContent,.rightContent{
           border-radius:8px;
           height:390px;
       } 
        :host/deep/ .leftContainer{
              float:left;
              width:120px;              
              border:1px solid #ccc;
              margin-right:10px;
              padding:10px 0px !important;
        }
        :host/deep/ .leftContainer li{
             font-family: PingFangSC-Semibold;
             font-size: 14px;
             color: #464C5B;
             letter-spacing: 0;
             line-height: 12px;
             height:32px;
             line-height:32px;
             text-align:center;
             background: #5697f1!important;
             color: #fff!important;
        }
      :host/deep/ .leftContainer li:hover{
         background: #5697f1!important;
         color: #fff!important;
      }
      .on{
          background:#5697f1;
      }
      :host/deep/ .leftContent li:hover{
         background: #5697f1!important;
         color: #fff!important;
      }
       :host/deep/ .rightContainer{
          float:left;       
          width:616px;
          border:1px solid #ccc;
          padding: 0 10px;
        }
         :host/deep/ .rightContainer input{
            border-radius:6px;         
            border:1px solid #EEF0F3 !important;
         }
        .topContent{
          width:100%;
          height:auto;
          margin-bottom:10px;
        }
        .topContent p{
          height:30px !important;
          line-height:-15px !important;
          padding:10px 0 !important;
        }
        .topContent input{
          text-indent:1em;
        }
        .leftContent{   
           width:184px;
           float:left;  
           margin-right:10px;
           height:310px;    
           border:1px solid #ccc;
            padding:10px 0px 10px 0px!important;
        }
       

        .leftContent li{
          padding-left:10px;
          height:30px;
          line-height:30px;
          font-family: PingFangSC-Semibold;
           font-size: 12px;
           color: #464C5B;
           letter-spacing: 0;
        } 
        .rightContent{
  
          background: #F3F8FF;
          border: 1px solid #DEE6ED;
          position:relative;
          width:400px;
          float:left;
          height:310px;
          overflow:auto;
          border:1px solid #ccc;
         
          position:relative;
          padding:10px !important;
        }  
        .rightContent p{
          width:50px;
          height:20px !important;
          line-height:20px;
          background:#fff;      
          position:fixed;
          top:-6%;
          left:20%;
          text-align:center;         
          padding:10px 0 !important;
        }
        .rightContent dl input{
          width:366px !important;
          border-radius:6 !important;  
          border:1px solid #EEF0F3 !important;
        }
        .rightContent dl dt{
             font-family: PingFangSC-Semibold;
             font-size: 12px;
             color: #464C5B;
             letter-spacing: 0;
             line-height: 12px;
             display:block !important;
        }
        .rightContent dl dd{
           display:block !important;
           float:none !important;
        }
         .topContent div input{
          display:inline-block;
          width:100%;
          height:32px;
          border:1px solid #EEF0F3 !important;
        }
        .report_errTips{        
           color:#f00;
        }
        .report_errborder{
           border:1px solid #f00;
        }
        .confirm_report{
            cursor: not-allowed!important;
            background: #97a1ae!important;
            pointer-events: none!important;
        }
       
    `]
})
export class ReportDialogLayerComponent {
    private dataType: any;
    private dataCauseList: any = [];
    private adaptersData: any = [];
    private addObj: any = {};
    private reportErrorTips: string = "";
    private datasourceBoolean: boolean = false;
    private showerrTip: boolean = false;
    private dataName:any = {
        value : '',
        name : '连接名称',
        errorTips: false,
        errmsgTips: ''
    };
    private errorTip:string = "";
    private adapterId:number;
    private dlistType:number;
    private paramObj: any = {};
    private dataId: number;
    private paramsList: Array<any> = [];
    private saveName:string = "";
    private editadapterId:number;
    private showConfirm:boolean = true;
    private firstName:any;
    
    constructor(private communication: DatasourceCommunicationService,
                private datacauseCommunicationService: DatacauseCommunicationService,
                private dialogCommunicationService: DialogCommunicationService) {
        this.datacauseCommunicationService.missionShowAddDatasource$.subscribe((data: any) => {
            this.datacauseCommunicationService.hideAllLayer()
            this.datasourceBoolean = true;
            this.dlistType = data.type;
            this.dataName.errorTips = false;
            this.dataCauseList = [];
            this.adaptersData = [];
            if(this.dlistType == 1){
                this.dataName.value = "";
                this.adapterId = -1;
                this.showConfirm = true;
                this.getDataTypes();
            }else if(this.dlistType == 2){
                this.dataId = data.id;
                this.getDetailDatasource();
                this.showConfirm = false;
            }

        })

        this.datacauseCommunicationService.missionHideAllLayer$.subscribe((data: any) => {
            this.datasourceBoolean = false;
        })
    }
   clostAll(){
        this.datasourceBoolean = false;
        this.datacauseCommunicationService.hideAllLayer()
    }

    getDetailDatasource() {
        this.communication.querydetail(this.dataId).then((res:any) => {
            this.firstName = res.name;
            console.log(this.firstName) 
            this.dataName.value = res.name;
            this.saveName = res.name;
            this.paramsList = [];
            this.paramsList = JSON.parse(res.params);
            this.editadapterId = this.adapterId = res.adapterId;
            this.getDataTypes();
            this.getAdaptersData(res.adapterId);

        }).catch(err => this.dialogCommunicationService.addMessage({
            severity: 'error',
            summary: '请求失败',
            detail: err._body
        }))
    }

    //编辑数据
    editDatasource(){
        for(let i in this.adaptersData){
            for(let key in this.paramsList){
                if(this.adaptersData[i].code == key){
                    this.adaptersData[i].value = this.paramsList[key];
                }
            }
        }
    }

    // 数据源类型
    getDataTypes() {
        this.communication.querysource().then(res => {
            this.dataType = res;
            this.dataType.forEach((i: any) => {
                this.dataCauseList.push({name: i.name, value: i.id})
            })
        }).catch(err => this.dialogCommunicationService.addMessage({
            severity: 'error',
            summary: '请求失败',
            detail: err._body
        }))
    }


    // 渲染inputList
    clickType(data: any) {
        this.adapterId = data.value;
        this.getAdaptersData(data.value);
        if(!this.keyupFormData(data)){
            return;
        }else{
            this.showConfirm = true;
        }
    }

    getAdaptersData(adapterId: any) {
        this.communication.queryadaptersData(adapterId).then((res: any) => {
            this.adaptersData = res.dataSourceView.fieldTabs[0].fieldGroups[0].fields;
            for(let item of this.adaptersData){
                item.errorTips = false,
                    item.errmsgTips = ''
            }
            if(this.dlistType == 2 && this.editadapterId == this.adapterId){
                this.editDatasource();
            }

        }).catch(err => this.dialogCommunicationService.addMessage({
            severity: 'error',
            summary: '请求失败',
            detail: err._body
        }))

    }

    keyupFormData(item:any){
        if (item.value == '' || item.value == undefined || item.value == null) {
            this.showConfirm = true;
            item.errorTips = true;
            item.errmsgTips = item.name + "不能为空";
            return false
        } else if (!this.illegalChar(item.value) && item.name == "连接名称") {
            this.showConfirm = true;
            item.errorTips = true;
            item.errmsgTips = "连接名称不能包含特殊字符（\/:?<>|）"
            return false
        } else {
            item.errorTips = false;
            item.errmsgTips = "";
        }

        return true;
    }

    checkFormData(item:any){
        if(!this.keyupFormData(item)){
            return;
        }
        if(this.dataName.value !== '' && this.adaptersData.length > 0){
            this.showConfirm = false;
            for(let j of this.adaptersData){
                if(j.value == null){
                    this.showConfirm = true;
                    break;
                }
            }
        }
        return true;
    }

    private illegalChar(str: any) {
        let pattern = /^[a-zA-Z0-9_*\.?*\-?\u4e00-\u9fa5]+$/
        if (!pattern.test(str)) {
            return false;
        }
        return true;
    }

    cancel(){
        this.datasourceBoolean = false;
        this.datacauseCommunicationService.addDatasourceAdapter({id: -1,adapterId: -1})
    }

    testDatasource(){
        this.getParams();
        this.addObj.name = this.dataName.value;
        this.addObj.adapterId = this.adapterId;
        this.addObj.params = JSON.stringify(this.paramObj);
        this.communication.testdatasource(this.addObj).then((res:any) => {
              if(res.success==false){
                this.dialogCommunicationService.addMessage({   severity: 'error',summary: '测试数据源连接失败',detail: res.message})
            }
            if(res.success==true){
                this.dialogCommunicationService.addMessage({   severity: 'success',summary: '测试数据源连接成功',detail: res.message})
            }

        }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '测试数据源连接失败', detail: err._body }))

    }

    getParams(){
        for(let i in this.adaptersData){
            for(let key in this.adaptersData[i]){
                switch (key){
                    case 'code':
                        this.paramObj[this.adaptersData[i][key]] = this.adaptersData[i].value;
                        break;

                }
            }
        }
        console.log(this.paramObj)
        return this.paramObj;
    }

    keyupAdapter(){
        for(let j of this.adaptersData){
            this.keyupFormData(j)
        }
        return true;
    }

    confirm(){
        if(!this.keyupFormData(this.dataName)){
            return;
        }
        if(!this.keyupAdapter()){
            return
        }
        this.getParams();

        if(this.dlistType == 1 && this.saveName !== this.dataName){
            console.log(this.dlistType)
            this.dlistType = 1;
        }
        if(this.dlistType == 1){     
            this.addObj.name = this.dataName.value;
            this.addObj.adapterId = this.adapterId;
            this.addObj.params = JSON.stringify(this.paramObj);
            this.communication.savedatasource(this.addObj).then((res:any) => {
                if (res.success == false) {
                    this.dialogCommunicationService.addMessage({ severity: 'error', summary: '新增数据源连接失败', detail: res.msg })
                }
                if (res.success == true) {
                    this.dialogCommunicationService.addMessage({ severity: 'success', summary: '新增数据源连接成功', detail: '' })
                    this.datasourceBoolean = false;
                    this.addObj =  {};
                    this.datacauseCommunicationService.addDatasourceAdapter({id: parseInt(res.data),adapterId: this.adapterId});
                }

            }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '新增数据源连接失败', detail: err._body }))
        }else if(this.dlistType == 2){
            if(this.dataName.value == this.firstName){
                        this.addObj.id = this.dataId;
                        this.addObj.name = this.dataName.value;  
                        this.addObj.adapterId = this.adapterId;
                        this.addObj.params = JSON.stringify(this.paramObj);
                    this.communication.updatedatasource(this.addObj).then((res:any) => {
                    if (res.success == false) {
                        this.dialogCommunicationService.addMessage({ severity: 'error', summary: '更新数据源连接失败', detail: res.msg })
                    }
                    if (res.success == true) {
                        this.dialogCommunicationService.addMessage({severity: 'success', summary: '更新数据源连接成功', detail: ''})
                        this.datasourceBoolean = false;
                        this.addObj =  {};
                        this.datacauseCommunicationService.addDatasourceAdapter({id: this.dataId,adapterId: this.adapterId});
                    }
               
                   }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '更新数据源连接失败', detail: err._body }))
              
             }else{
                        let dialog = new DialogData()
                        let confirm: DialogConfirm = new DialogConfirm()
                        dialog.confirms.push(confirm)
                        dialog.icon = "jinggao"
                        dialog.content = "变更将影响使用该连接的报表"
                        this.addObj.id = this.dataId;
                        this.addObj.name = this.dataName.value;  
                        this.addObj.adapterId = this.adapterId;
                        this.addObj.params = JSON.stringify(this.paramObj);
                          confirm.onConfirm = () => {
            
                        this.communication.updatedatasource(this.addObj).then((res:any) => {
                            if (res.success == false) {
                                this.dialogCommunicationService.addMessage({ severity: 'error', summary: '更新数据源连接失败', detail: res.msg })
                            }
                            if (res.success == true) {
                                this.dialogCommunicationService.addMessage({severity: 'success', summary: '更新数据源连接成功', detail: ''})
                                this.datasourceBoolean = false;
                                this.addObj =  {};
                                this.datacauseCommunicationService.addDatasourceAdapter({id: this.dataId,adapterId: this.adapterId});
                            }
                        }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '更新数据源连接失败', detail: err._body }))
                      
                    }
                    this.dialogCommunicationService.showDialog(dialog)
              }
           
    }
    }


}