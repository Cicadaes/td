import { Component, Input, Output, EventEmitter } from '@angular/core';
import { 
    DropdownModule,
    Message,
    DialogModule,
    ButtonModule
} from 'primeng/primeng';
import { ConfirmationService } from "primeng/components/common/api";
import {
    FunnelIndexDefinitionResourceService
} from "../../../services/admin/funnel_index_definition.resource.service";
import { FunnelService }from '../../../services/report/funnel.communication.service';
import { ErrorHandlingService } from './../../../services/exceptional/error-handling.service';
@Component({
    selector: 'funnel-index-admin',
    templateUrl: 'funnel-index-admin.component.html',
    styleUrls: ['funnel-index-admin.component.css'],
    providers: [FunnelIndexDefinitionResourceService,FunnelService,ConfirmationService,ErrorHandlingService]
})

export class FunnelIndexAdminComponent {
    isDisabled:boolean = false;     //新建按钮是否禁用
    selList: any[] = [];        //下拉
    selectedSel:any;            //下拉绑定
    msgs: Message[] = [];
    newDisplay:boolean = false; //新建弹框显隐
    acceptLabel: string = '确认'; //删除弹框按钮默认显示
    rejectLabel: string = '取消'; //删除弹框按钮默认显示
    display: boolean;           //改名弹框显隐
    isabled: boolean;
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
    isActive: boolean = false; //活动被占用提示
    constructor (
        private funnelIndexService: FunnelIndexDefinitionResourceService,
        private funnelService:FunnelService,
        private confirmationService:ConfirmationService,
        public errorHandlingService: ErrorHandlingService
    ) {
        //查询下拉
        this.querySelect();
        this.queryData();
    }
    //查询新建弹框下拉数据
    querySelect (){
        let that = this;
        this.funnelIndexService.queryFunnelList().then((data:any)=>{
            if(data && (data.retCode || data.msgDes)) {
                let err = that.errorHandlingService.getMsg(data);
                this.showMsg("warn",err.message);
                return;
            }
		    //console.log(data,"querySelect");
            if(data.length == 0){
                this.showMsg("warn","暂时没有可新建数据!");
                this.isabled = true;
                this.isDisabled = true;
            }else{
                this.isDisabled = false;
                //默认第一条
                this.newName = data[0].name;
                //this.tableList = data;
                this.selectedSel = {
                    eventId:data[0].eventId,
                    name:data[0].name,
                    tenantId:data[0].tenantId
                }
                for(let i=0; i<data.length;i++){ 
                    this.selList.push({
                        label:data[i].name,
                        value:{
                            eventId:data[i].eventId,
                            name:data[i].name,
                            tenantId:data[i].tenantId
                        }
                    });
                }
            }
            
        }).catch(

        );
    }
    //查询已经提交过的table列表
    queryData (){
        this.funnelService.queryFunnelSel(this.queryListParam).then((data:any) => {
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
        //调提交接口
        let that = this;
        if(that.newName){
            if(that.newDesc && that.newDesc.length > 240){
                that.desWarnShow = true;
            }else{
                that.desWarnShow = false;
                that.newBuildData = {
                    eventId:that.selectedSel.eventId,
                    name:that.newName,
                    tenantId:that.selectedSel.tenantId,
                    description:that.newDesc
                }
                //console.log(that.newBuildData,'新建参数');
            
                that.funnelIndexService.updateFunnelSel(that.newBuildData).then((data:any)=>{
                    if(data.id){
                        that.showMsg("success","添加成功!");
                        that.newDesc = '';
                        that.newDisplay = false;
                        that.querySelect();
                        that.queryData();
                    }
                }).catch();
            }
            
        }else{
            this.showMsg("warn","名称不能为空!");
        }
        
    }
    //删除
    delete (i:any,eventId:any){
        let that = this;
        that.funnelIndexService.queryStatus(eventId).then((data:any) => {
            if(!data){
                //提示活动占用不能操作
                that.isActive = true;
            }else{
                that.acceptLabel = '确认';
                that.rejectLabel = '取消';
                let id = that.updateTableList[i].id;
                that.confirmationService.confirm({
                    message: '您确定继续删除此事件 ?',
                    header: '确定删除', 
                    accept: () => {
                        that.funnelIndexService.deleteFunnel(id).then((data:any) =>{
                            this.showMsg("success","删除成功!");
                            this.querySelect();
                            this.queryData();
                        }).catch();
                    }
                });
            }
        }).catch(

        );
        
    }
    //修改
    change (i:any,eventId:any){
        let that = this;
        that.funnelIndexService.queryStatus(eventId).then((data) => {
            if(!data){
                //提示活动占用不能操作
                that.isActive = true;
            }else{
                that.changeIndex = i;
                that.changeDisplay = true;
                that.changeName = that.updateTableList[i].name;
                that.changeDesc = that.updateTableList[i].description;
            }
        }).catch(

        );
        
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
                //console.log(changeData,'修改的参数');
                that.funnelIndexService.putChange(changeData).then((data:any)=>{
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
    //关闭提示弹框
    noticeDialogHide (){
        this.isActive = false;
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
            that.funnelService.queryFunnelSel(that.searchParam).then((data:any) => {
                //console.log(data,'sss');
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
    //修改名称
    // dialogShow (i:any){
    //     this.display = true;
    //     this.index = i;
    // }
    //修改名称取消
    // dialogHide (){
    //     this.display = false;
    //     this.newName = '';
    // }
    //修改名称操作
    // changeTabName (){
    //     //this.isRead = false;
  
    //     if(this.newName){
    //         this.tableList[this.index].name = this.newName;
    //         this.display = false;
    //         this.newName = '';
    //     }else{
    //         this.showMsg("warn","名称不能修改为空!");
    //     }
    // }
    // updateSel (){
    //     let that = this;
    //     //console.log(that.selectedSel);
    //     that.funnelIndexService.updateFunnelSel(that.selectedSel).then((data:any)=>{
    //         //console.log(data.id,'添加');
    //         if(data.id){
    //             this.showMsg("success","添加成功!");
    //         }
    //     }).catch();
        
    // }
    //提交
    // updateTableSel (i:any){
    //     let that = this;
        
    //     that.tableSel = {
    //         eventId:that.tableList[i].eventId,
    //         name:that.tableList[i].name,
    //         tenantId:that.tableList[i].tenantId
    //     }
    //     //console.log(that.tableSel,'table---');
    //     that.funnelIndexService.updateFunnelSel(that.tableSel).then((data:any)=>{
        
    //         if(data.id){
    //             this.showMsg("success","添加成功!");
    //             this.tableList.splice(i,1); 
    //         }
    //     }).catch();
    // }
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
    confirmActive (){
        this.isActive = false;
    }
    cancelActive (){
        this.isActive = false;
    }
}