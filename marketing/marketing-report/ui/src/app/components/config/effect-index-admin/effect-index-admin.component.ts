import { Component, Input, Output, EventEmitter } from '@angular/core';
import { 
    DropdownModule,
    Message,
    DialogModule,
    ButtonModule
} from 'primeng/primeng';
import { ConfirmationService } from "primeng/components/common/api";
import {
    EffectIndexDefinitionResourceService
} from "../../../services/admin/effect_index_definition.resource.service";
import { ErrorHandlingService } from './../../../services/exceptional/error-handling.service';

@Component({
    selector: 'effect-index-admin',
    templateUrl: 'effect-index-admin.component.html',
    styleUrls: ['effect-index-admin.component.css'],
    providers: [EffectIndexDefinitionResourceService,ConfirmationService,ErrorHandlingService]
})

export class EffectIndexAdminComponent {
    isDisabled:boolean = false;     //新建按钮是否禁用
    selList: any[] = [];        //下拉
    selectedSel:any;            //下拉绑定
    selList2: any[] = [];       //下拉2
    selectedSel2:any;           //下拉2绑定
    msgs: Message[] = [];
    newDisplay:boolean = false; //新建弹框显隐
    acceptLabel: string = '确认'; //删除弹框按钮默认显示
    rejectLabel: string = '取消'; //删除弹框按钮默认显示
    newBuildData: any = {};     //提交的参数集合
    newName: any;               //修改的新名字
    newDesc: any;               //新建弹框描述
    changeDisplay: boolean = false;  //修改的弹框显隐
    changeName: any;                //修改后的新名字
    changeDesc: any;                //修改后的新描述
    changeIndex: any;               //修改的索引
    isRead:boolean = true;      
    searchName: any = '';       //搜索名字
    searchBuilder: any = '';    //搜索创建人
    tableList:any = [];         //原先要放的查询下拉列表（表格展示）
    tableSel:any = {};          //表格里要提交项
    index:any;                  //索引
    updateTableList:any = [];   //查询的已经提交过的列表数据
    currentRows:any=10;
    queryListParam :any = {}; //查询页码
    value: any = {              //分页配置
        totalRecords: 0,        //总条数
        rows: this.currentRows, //每页显示条数
        pageLinkSize: 10,       //页码显示数量
        rowsPerPageOptions: [10, 20, 50, 100] //条数切换
    };
    searchParam: any = {};
    desWarnShow: boolean = false; //描述提醒
    desWarnShow2: boolean = false;
    constructor (
        private effectIndexService: EffectIndexDefinitionResourceService,
        private confirmationService:ConfirmationService,
        public errorHandlingService: ErrorHandlingService
    ) {
        
        this.querySelect();
        this.queryData();

        //第二个下拉数据
        //默认第一个
        this.selectedSel2 = {
            label:'注册数',
            type:1001
        }
        // this.selList2.push({label:'注册数',value:{type:100}});
        // this.selList2.push({label:'开户数',value:{type:101}});
        // this.selList2.push({label:'签约数',value:{type:102}});
        // this.selList2.push({label:'交易客户数',value:{type:103}});
        // this.selList2.push({label:'有效客户数',value:{type:104}});
        // this.selList2.push({label:'重复交易客户数',value:{type:105}});
        // this.selList2.push({label:'交易金额',value:{type:106}});
        // this.selList2.push({label:'交易量',value:{type:107}});
        // this.selList2.push({label:'收入',value:{type:108}});
        // this.selList2.push({label:'月日均资产',value:{type:109}});
        // this.selList2.push({label:'月交易频次',value:{type:110}});
        // this.selList2.push({label:'渠道',value:{type:111}});
        // this.selList2.push({label:'性别',value:{type:112}});
        // this.selList2.push({label:'营业部',value:{type:113}});
        // this.selList2.push({label:'分公司',value:{type:114}});
        // this.selList2.push({label:'注册来源',value:{type:115}});
        // this.selList2.push({label:'开户来源',value:{type:116}});
        // this.selList2.push({label:'产品结构',value:{type:117}});
        // this.selList2.push({label:'收入结构',value:{type:118}});
        // this.selList2.push({label:'产品覆盖占比',value:{type:119}});
        // this.selList2.push({label:'客户结构占比',value:{type:120}});
        // this.selList2.push({label:'资产分层-金额',value:{type:121}});
        // this.selList2.push({label:'资产分层-金额',value:{type:122}});
        this.selList2.push({label:'概览图',value:{type:1001}});
        this.selList2.push({label:'趋势图',value:{type:1002}});
        this.selList2.push({label:'对比图',value:{type:1003}});
        this.selList2.push({label:'占比图',value:{type:1004}});
    }
    //查询新建下拉数据
    querySelect (){
        let that = this;
        this.effectIndexService.queryEffectList().then((data:any)=>{
            this.selList = [];
            if(data && (data.retCode || data.msgDes)) {
                let err = that.errorHandlingService.getMsg(data);
                this.showMsg("warn",err.message);
                return;
            }
            //console.log(data,"querySelect");
            if(data.length == 0){
                this.showMsg("warn","暂时没有可新建数据!");
                this.isDisabled = true;
            }else{
                this.isDisabled = false;
                //默认第一条
                this.newName = data[0].name;
                //this.tableList = data;
                this.selectedSel = {
                    indexId:data[0].indexId,
                    name:data[0].name,
                    tenantId:data[0].tenantId,
                    code:data[0].code
                }
                for(let i=0; i<data.length;i++){ 
                    this.selList.push({
                        label:data[i].name,
                        value:{
                            indexId:data[i].indexId,
                            name:data[i].name,
                            tenantId:data[i].tenantId,
                            code:data[i].code
                        }
                    });
                }
            }
            
        }).catch(

        );
    }
    
    //查询已经提交过的table列表
    queryData (){
        this.effectIndexService.queryEffectSel(this.queryListParam).then((data:any) => {
            //console.log(data,'table====data');
            if(data.data.length == 0 && this.value.totalRecords == 10){
                this.queryListParam.page = 1;
                this.queryData();
            }else{
                this.updateTableList = data.data;
                this.value.totalRecords = data.total;
            }
            
        }).catch(

        );
    }
    changeSel (){
        //console.log(this.selectedSel,'改变sel');
        this.newName = this.selectedSel.name;
        
    }
    changeSel2 (){
        //console.log(this.selectedSel2,'改变sel2');
    }
    //新建
    newBuild (){
        this.newDisplay = true;
    }
    //新建取消
    cancelNew (){
        this.newDesc = '';
        this.newDisplay = false;
        if(this.selectedSel){
            this.newName = this.selectedSel.name;
        }
    }
    dialogHide (){
        if(this.selectedSel){
            this.newName = this.selectedSel.name;
        }
    }
    //确定新建
    confirmNew (){
        let that = this;
        if(that.newName){
            if(that.newDesc && that.newDesc.length > 240){
                that.desWarnShow = true;
            }else{
                that.desWarnShow = false;
                that.newBuildData = {
                    indexId:that.selectedSel.indexId,
                    name:that.newName,
                    tenantId:that.selectedSel.tenantId,
                    description:that.newDesc,
                    type:that.selectedSel2.type,
                    code:that.selectedSel.code
                }
                //console.log(that.newBuildData,'新建参数');
                that.effectIndexService.updateEffectSel(that.newBuildData).then((data:any)=>{
                    that.showMsg("success","添加成功!");
                    that.newDesc = '';
                    that.newDisplay = false;
                    that.querySelect();
                    that.queryData();
                }).catch();
            }
            
        }else{
            this.showMsg("warn","名称不能为空!");
        }
        
    }
    //删除
    delete (i:any){
        let that = this;
        that.acceptLabel = '确认';
        that.rejectLabel = '取消';
        let id = that.updateTableList[i].id;
        //console.log(id);
        that.confirmationService.confirm({
            message: '您确定继续删除此事件 ?',
            header: '确定删除', 
            accept: () => {
                that.effectIndexService.deleteEffect(id).then((data:any) =>{
                    //console.log(data,'删除====');
                    that.showMsg("success","删除成功!");
                    that.querySelect();
                    that.queryData();
                }).catch();
            }
        });
    }
    //修改
    change (i:any){
        let that = this;
        that.changeIndex = i;
        that.changeDisplay = true;
        that.changeName = that.updateTableList[i].name;
        that.changeDesc = that.updateTableList[i].description;
    }
    //确定修改
    confirmChange (){
        let that = this;
        let changeData = {};
        if(that.changeName){
            if(that.changeDesc && that.changeDesc.length > 240){
                that.desWarnShow2 = true;
            }else{
                that.desWarnShow2 = false;
                changeData = {
                    id:that.updateTableList[that.changeIndex].id,
                    name:that.changeName,
                    tenantId:that.updateTableList[that.changeIndex].tenantId,
                    description:that.changeDesc
                }
                that.effectIndexService.putChange(changeData).then((data:any)=>{
                    that.showMsg("success","修改成功!");
                    that.changeDisplay = false;
                    that.queryData();
                }).catch();
            }
            
        }else{
            that.showMsg("warn","名称不能为空！");
        }
    }
    //取消修改
    cancelChange (){
        this.changeDisplay = false;
    }
    //点关闭按钮触发
    changeDialogHide (){

    }

    //搜索
    search (){
        let that = this;
        if(that.searchName || that.searchBuilder){
            that.searchParam = {
                nameOperator:'like',
                createByOperator:'like'
            }
            if (that.searchName) {
                that.searchParam.name = '%25' + that.searchName + '%25';
            }
            if　(that.searchBuilder) {
                that.searchParam.createBy = '%25' + that.searchBuilder + '%25';
            }
            this.effectIndexService.queryEffectSel(that.searchParam).then((data:any) => {
                that.updateTableList = data.data;
                that.value.totalRecords = data.total;
            }).catch(

            );
        }
        
    }
    //取消搜索
    cancelSearch (){
        this.queryData();
        this.searchName = '';
        this.searchBuilder = '';
    }
    //分页
    paginate(params: any) {
        //console.log(params,'=====');
        this.currentRows = params.rows;
        this.queryListParam.page = params.page + 1;
        this.queryData();

    }
    //展示提示信息
    showMsg(msgType:string,msg:string){
        let that = this;
        that.msgs = [];
        that.msgs.push({severity:msgType, summary:msgType+' Message', detail:msg});
    }
    textareaChange (){
        this.desWarnShow = false;
        this.desWarnShow2 = false;
    }
}