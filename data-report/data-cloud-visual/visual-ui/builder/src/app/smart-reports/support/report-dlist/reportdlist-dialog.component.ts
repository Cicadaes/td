import {Component, OnInit} from '@angular/core';
import {DatasourceCommunicationService} from "../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../report-service/datacause.service";
import {DialogCommunicationService} from "../report-service/dialog.communication.service";
import {DialogData, DialogConfirm} from "../common/dialog/dialog_data.model";
import {isNumber} from "util";

@Component({
    selector: 'reportdlist-dialog',
    templateUrl: 'reportdlist-dialog.component.html',
    styles: [`
        :host /deep/ .ui-dialog{
            overflow: inherit!important;
        }
        .add_project{
            padding: 10px 5px;
        }
        :host /deep/ .ui-dialog .ui-dialog-content{
            overflow: initial;
        }
        :host /deep/ .ui-dialog .ui-dialog-buttonpane{
            padding-right: 0!important;
        }
        /*factory*/      
        :host /deep/ .ui-dialog .ui-dialog-content dl dd .ui-dropdown{
            width: 344px!important;     
        }
       .skin-blue .content .ui-dialog .ui-dialog-content dl .rightBtn{
            float:right;
         }
        .ui-dialog .ui-dialog-content dl dd button{
             padding: 8px 20px;
        } 

        :host /deep/ .ui-dialog .ui-dialog-content dl dd {
             width:calc(100% - 80px) !important;
         }
    
        :host /deep/ .rightBtn{
            display:inline-block;
            float:right;          
        } 
        :host /deep/ .ui-dialog .ui-dialog-content dl dd>button{
            color: #ffffff;
            background: #5697f1;
            border-radius: 4px;
            height: 28px;
            width:auto;
            padding:4px 15px;
            font-size: 12px;          
            font-family: "Microsoft YaHei";
            -webkit-transition: all linear 0.3s;
            -moz-transition: all linear 0.3s;
            transition: all linear 0.3s;
            margin-left: 5px;
        }
        :host /deep/ .ui-dialog .ui-dialog-content dl dd>button:hover{
            background:#4683de;
        }
         :host /deep/ .rightBtn button{      
            color: #ffffff;
            background: #5697f1;
            border-radius: 4px;
            height: 32px;
            width:80px;
            font-size: 12px;          
            font-family: "Microsoft YaHei";
            -webkit-transition: all linear 0.3s;
            -moz-transition: all linear 0.3s;
            transition: all linear 0.3s;
            margin-left: 5px;
        } 
        :host /deep/ .grey{      
            background:rgba(215, 215, 215, 1) !important;      
        } 
        .onActive{
           background:#5697f1;
        }
        :host /deep/ .ui-dialog .ui-dialog-content dl dd .ui-dropdown .ui-inputtext{
            padding: 8px;
        }
        :host /deep/ .ui-dialog-content{
              height:400px;    
        }
        .report_button button{
            cursor: not-allowed;
            float: right;
            pointer-events: none;
            background: #97a1ae;
        }
        .report_button button.surface_color{
            background: #5697f1!important;
            color: #fff;
            cursor: pointer;
            pointer-events: auto;
        }

        .confirm_report{
            cursor: not-allowed!important;
            background: #97a1ae!important;
            pointer-events: none!important;
        }

        .invaliderr{
            border-color: #f00!important;
        }
        .report_button button{
            background: #97a1ae;
            padding: 10px 25px;
            border-radius: 3px;
            color: #fff;
            font-family: "微软雅黑";
        }
        .ui-helper-clearfix div{
            float: left!important;
        }
        :host /deep/ .errorTip{
            width:340px !important;
            margin-left:90px !important;
        }
    `]
})

export class ReportdlistDialogComponent implements OnInit {

    private display: boolean = false;
    private dialogWidth: number = 800;
    private taskTitle: any = "新建数据源";
    private dataName: string;
    private dataDesc: string;
    private selectedDatasource: any = [];
    private selectedCube: any = [];
    private dataSourceList: any;
    private dataCubeList: any;
    private queryObj: any = {};
    private showConfirm: boolean = true;
    private showEdit: boolean = true;
    private showerrTip: boolean = false;
    private showerrTip1: boolean = false;
    private showerrTip2: boolean = false;
    private errorTip: any;
    private cutover: boolean = true;
    private clickPriview: boolean = true;
    private dataList: any;
    private dataCauseList: any;
    private dataType: any;
    private dlistType:number;
    private addObj:any = {};
    private datasourceId: number;
    private SyntaxCheck: boolean = true;
    private SyntaxName:any = null;
    private showerrTipSyntax: boolean = false;
    private errorTipSyntax:string = '';
    private datasourceName:string = '';
    private textAreaData:any;
    private testData:any={name:'',adapterId:'',params:''};
    private PreviewBtn:boolean=true;
    private editBool:boolean = false;
    constructor(private communication: DatasourceCommunicationService,
                private datacauseCommunicationService: DatacauseCommunicationService,
                private dialogCommunicationService: DialogCommunicationService) {
        this.datacauseCommunicationService.missionAddLayerShowSource$.subscribe((data: any) => {
            this.datacauseCommunicationService.hideAllLayer()
            this.display = true;
            this.dlistType = data.type;
            if(this.dlistType == 1){
                this.cutover = true;
                this.taskTitle = "新建数据源";
                this.dataName = "";
                this.dataDesc = "";
                this.selectedDatasource = [];
                this.selectedCube = [];
                this.dataType = -1;
                this.showConfirm = true;
                this.showEdit = true;
                this.editBool = true;
                this.dialogWidth = 800;
                this.getDataSourceList();
            }else if(this.dlistType == 2){
                this.taskTitle = "编辑数据源";
                this.dialogWidth = 490;
                this.editBool = false;
                this.datasourceId = data.id;
                this.dataName = data.name;
            }
        })

        this.datacauseCommunicationService.missionAddDatasourceAdapter$.subscribe((data:any) => {
            this.cutover = true;
            this.typeDatasource();
            if(data.id !== -1){
                this.getDataSourceList();
                this.selectedDatasource = data.id;
                this.dataType = data.adapterId;
            }
        })

        this.datacauseCommunicationService.missionAddConnections$.subscribe((data:any) => {
            this.cutover = true;
            this.typeDatasource();
            if(data.id !== -1){
                this.SyntaxName = data.syntaxName;
                if(this.SyntaxName !== ""){
                    this.showerrTipSyntax = false;
                    this.errorTipSyntax = "";
                    this.SyntaxCheck = false;
                }
            }
        })

        this.datacauseCommunicationService.missionPreviewConnections$.subscribe((data: any) => {
            this.cutover = false;
            this.taskTitle = "数据预览";
        })

        this.datacauseCommunicationService.missionHideDatasource$.subscribe((data: any) => {
            this.cutover = true;
            this.typeDatasource();
        })


    }

    ngOnInit() {
          
    }

    typeDatasource(){
        if(this.dlistType == 1){
            this.taskTitle = "新建数据源";
        }else if(this.dlistType == 2){
            this.taskTitle = "编辑数据源";
        }
    }

    clostAll(){
        this.display = false;
      
    }

    // 数据源连接
    getDataSourceList() {
        this.communication.querydataSource().then((res:any) => {
            this.dataSourceList = res;
            console.log(this.dataSourceList)
            this.getDataCauseList(this.dataSourceList)
        }).catch(err => this.dialogCommunicationService.addMessage({
            severity: 'error',
            summary: '请求失败',
            detail: err._body
        }))
    }


    // 获取cube列表
    getCubeList() {
        this.communication.querycube(this.selectedDatasource).then((res:any) => {
            this.dataCubeList = res.data;
            this.getDataCubeList(this.dataCubeList);

        }).catch(err => this.dialogCommunicationService.addMessage({
            severity: 'error',
            summary: '请求失败',
            detail: err._body
        }))
    }

    //生成列表格式
    getDataCubeList(dataCubeList: any[]): any {
        this.dataList = [{label: "请选择", value: ""}];
        if (dataCubeList) {
            dataCubeList.forEach((i: any) => {
                this.dataList.push({label: i, value: i})
            });
            return this.dataList;
        }
    }


    //生成列表格式
    getDataCauseList(dataSourceList: any[]): any {
        this.dataCauseList = [{label: "请选择", value: ""}];
        if (dataSourceList) {
            dataSourceList.forEach((i: any) => {
                this.dataCauseList.push({label: i.name, value: i.id})
            });
            return this.dataCauseList;
        }
    }

    editCheckForm(){
        if(this.selectedDatasource == "" || this.selectedDatasource == "请选择"){
            return false;
        }
        return true;
    }

    //编辑数据源连接
    editDataSource() {
        if (!this.editCheckForm()) {
            return;
        }
        this.cutover = false;
        this.taskTitle = "编辑数据源连接";
        this.datacauseCommunicationService.showAddDatasource({type:2,id:this.selectedDatasource})
    }

    //add数据源连接
    addDataSource() {
        this.cutover = false;
        this.taskTitle = "新增数据源连接";
        this.datacauseCommunicationService.showAddDatasource({type:1,id:-1})
    }


    // 预览按钮是否可用
    changePreview() {
       if(!this.checkFormName()&& (this.SyntaxName!=""||this.SyntaxName != null) && this.selectedDatasource!=""){
        this.PreviewBtn=false;
       }
    }
  


     // 点击预览
   clickpriview(id:any) {
       if(!this.confirmType()){
           return;
       }
        this.taskTitle = "数据预览"
        this.cutover = false;
        let data={
            id:this.selectedDatasource,
            querySql:this.SyntaxName,
            saveId: id
        }
        this.datacauseCommunicationService.showDataPrview(data)
    }

//测试连接
  testConnect(data:any){
       this.communication.testConnect(this.testData).then((res:any) => {
            if(res.success==false){
                this.dialogCommunicationService.addMessage({   severity: 'error',summary: '连接失败',detail: res.message})
            }
            if(res.success==true){
                this.dialogCommunicationService.addMessage({   severity: 'success',summary: '连接成功',detail: res.message})
            }
        }).catch(err => this.dialogCommunicationService.addMessage({
            severity: 'error',
            summary: '请求失败',
            detail: err._body
        }))
    }

    // 编辑，测试连接按钮是否可用；
    change() {
        if (this.selectedDatasource != "" && this.selectedDatasource != "请选择") {
            this.showEdit = false;
            this.getCubeList();
            this.dataSourceList.forEach((i: any) => {
                if (i.id == this.selectedDatasource) {
                    this.dataType = i.adapterId
                    this.datasourceName = i.name;
                }

            });
            this.showerrTipSyntax = false;
            this.errorTipSyntax = "";
        }else{
            this.dataType = -1;
            this.showEdit = true;
        }
    }

    changeDatasource(id:number){
        this.change();
        this.getdataSourceData(id);
        this.SyntaxName = "";
         
    }

    getdataSourceData(id:number){
        for(let item of this.dataSourceList){
            if(item.id == id){
                this.testData['name']= item.name
                this.testData['adapterId']=item.adapterId
                this.testData['params']=item.params;
            }
        }
    }

    checkDatasourceFormName(){
        if(!this.checkFormName()){
            return;
        }
    }

    changeCube(){
        if (this.selectedCube != "" || this.selectedCube != "请选择") {
            this.showConfirm = false;
        }
        
    }

    checkFormName() {
        if (this.dataName == '' || this.dataName == undefined) {
            this.showerrTip = true;
            this.errorTip = "数据源名称不能为空";
            return false
        } else if (!this.illegalChar(this.dataName)) {
            this.showerrTip = true;
            this.errorTip = "数据源名称不能包含特殊字符（\/:?<>|）"
            return false
        } else {
            this.showerrTip = false;
            this.errorTip = "";
           
        }

        return true;
    }

    checkSyntax(){
   
        if(this.SyntaxName == '' || this.SyntaxName == null){
            this.showerrTipSyntax = true;
            this.errorTipSyntax = "SQL不能为空";
            this.SyntaxCheck = true;
            this.PreviewBtn=true;
            return false
        }else{
            this.showerrTipSyntax = false;
            this.errorTipSyntax = "";
            this.SyntaxCheck = false;
            if(this.checkFormName()&&  this.selectedDatasource!=""){
               this.PreviewBtn=false;
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

    //SQL语法校验
    sqlSyntaxCheck(){
        this.addObj.id = this.selectedDatasource;
        this.addObj.querySql = this.SyntaxName;
        this.communication.saveSqlCheck(this.addObj)
            .then(res => {
                this.addObj =  {};
                if (res.success == false) {
                    this.dialogCommunicationService.addMessage({ severity: 'error', summary: 'SQL语法校验失败', detail: res.msg })
                }
                if (res.success == true) {
                    this.dialogCommunicationService.addMessage({severity: 'success', summary: 'SQL语法校验成功', detail: ''})
                }
            }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: 'SQL语法校验失败', detail: err._body }
        ))
    }

    getSqlSyntax(){
        this.cutover = false;
        this.taskTitle = "数据库浏览器";
        this.datacauseCommunicationService.showGetSqlSyntax({id: this.selectedDatasource,datasourceName:this.datasourceName})
    }

    //新建数据源页取消
    cancel() {
        this.display = false;
    }

    confirmType(){
        if(!this.checkFormName()){
            return;
        }
        if(this.dataType == 19){
            if(!this.checkSyntax()){
                return;
            }
            if(this.selectedDatasource == "" || this.selectedDatasource == "请选择"){
                return false;
            }
           
            return true;

        }else if(this.dataType == 20 || this.dataType == 21){
            if(this.selectedDatasource == "" || this.selectedDatasource == "请选择"){
                return false;
            }

            if(this.selectedCube == "" || this.selectedCube == "请选择"){
                return false;
            }
            
            return true;
        }
    }

    confirm(){
        if(this.dlistType == 1){
            if(!this.confirmType()){
                return;
            }
            this.addObj.name = this.dataName;
            this.addObj.dataSourceConnectionId = this.selectedDatasource;
            this.addObj.description = this.dataDesc;
            if(this.dataType == 19){
                this.addObj.mappedDataSource = this.SyntaxName;
            }else if(this.dataType == 20 || this.dataType == 21){
                this.addObj.mappedDataSource = this.selectedCube;
            }
            this.communication.create(this.addObj).then(res => {
                this.dialogCommunicationService.addMessage({ severity: 'success', summary: '新增数据源成功', detail: '' })
                this.display = false;
                this.addObj =  {};
                this.datacauseCommunicationService.updateList()
            }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '新增数据源失败', detail: err._body }))
        }else if(this.dlistType == 2){
            this.addObj.id = this.datasourceId;
            this.addObj.name = this.dataName;
            this.addObj.description = this.dataDesc;
            this.communication.update(this.addObj).then(res => {
                this.display = false;
                this.addObj =  {};
                if (res.success == false) {
                    this.dialogCommunicationService.addMessage({ severity: 'error', summary: '更新数据源失败', detail: res.msg })
                }
                if (res.success == true) {
                    this.dialogCommunicationService.addMessage({severity: 'success', summary: '更新数据源成功', detail: ''})
                    this.datacauseCommunicationService.updateList()
                }
            }).catch(err => this.dialogCommunicationService.addMessage({ severity: 'error', summary: '更新数据源失败', detail: err._body }))
        }
    }
}
