import { Component, Input, Output, EventEmitter } from '@angular/core';
import { 
    DropdownModule,
    Message,
    GrowlModule,
    ButtonModule,
    DialogModule
} from 'primeng/primeng';
import { ConfirmationService } from "primeng/components/common/api";
import {
    CampaignTargetDefinitionResourceService
} from "../../../services/admin/campaign_target_definition.resource.service";
import { FunnelService }from '../../../services/report/funnel.communication.service';
import { ErrorHandlingService } from './../../../services/exceptional/error-handling.service';
@Component({
    selector: 'admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css'],
    providers: [CampaignTargetDefinitionResourceService,ConfirmationService,FunnelService,ErrorHandlingService]
})

export class AdminComponent {
    selList: any[] = [];
    selectedSel:any;
    msgs: Message[] = [];
    isDisabled:boolean = false;     //新建按钮是否禁用
    newDisplay:boolean = false;     //新建弹框显隐
    acceptLabel: string = '确认';   //删除弹框按钮默认显示
    rejectLabel: string = '取消';   //删除弹框按钮默认显示
    newBuildData: any = {};         //提交的参数集合
    newName: any;                  //修改的新名字
    newDesc: any;                  //新建弹框描述
    changeDisplay: boolean = false; //修改的弹框显隐
    changeName: any;                //修改后的新名字
    changeDesc: any;                //修改后的新描述
    changeIndex: any;               //修改的索引
    searchName: any = '';          //搜索名字
    searchBuilder: any = '';       //搜索创建人
    isabled:boolean;
    tableList:any = [];
    tableSel:any = {};
    updateTableList:any = [];   //查询的已经提交过的列表数据
    currentRows:any=10;
    queryListParam :any = {};   //查询页码
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
        private adminService: CampaignTargetDefinitionResourceService,
        private confirmationService:ConfirmationService,
        private funnelService:FunnelService,
        public errorHandlingService: ErrorHandlingService
    ) {

        this.querySelect();
        this.queryData();
        
    }
    //查询新建弹框下拉数据
    querySelect (){
        let that = this;
        this.adminService.queryList().then((data:any)=>{
            if(data && (data.retCode || data.msgDes)) {
                let err = that.errorHandlingService.getMsg(data);
                this.showMsg("warn",err.message);
                return;
            }
		    //console.log(data,"campaign--querySelect");
            if(data.length == 0){
                this.showMsg("warn","暂时没有可新建数据!");
                this.isDisabled = true;
            }else{
                //默认第一条
                //this.tableList = data;
                this.isDisabled = false;
                this.newName = data[0].name;
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
        this.adminService.queryCampaign(this.queryListParam).then((data:any) => {
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
    changeSel (){
        //console.log(this.selectedSel,'改变sel');
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
                    indexId:that.selectedSel.indexId,
                    name:that.newName,
                    tenantId:that.selectedSel.tenantId,
                    description:that.newDesc,
                    code:that.selectedSel.code
                }
                //console.log(that.newBuildData,'新建参数');
                that.adminService.updateSel(that.newBuildData).then((data:any)=>{
                    if(data.id){
                        that.showMsg("success","添加成功!");
                        that.newDesc = '';
                        that.newDisplay = false;
                        this.querySelect();
                        that.queryData();
                    }
                }).catch();
            }
            
        }else{
            that.showMsg("warn","名称不能为空！");
        }
        
    }
    //删除
    delete (i:any,cId:any){
        let that = this;
            this.adminService.queryStatus(cId).then((data:any) => {
                //console.log(data,'idid');
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
                            that.adminService.deleteFunnel(id).then((data:any) =>{
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
    change (i:any,id:any){
        let that = this;
        this.adminService.queryStatus(id).then((data:any) => {
            //console.log(data,'idid');
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
                that.adminService.putChange(changeData).then((data:any)=>{
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
            that.adminService.queryCampaign(that.searchParam).then((data:any) => {
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
        this.currentRows = params.rows;
        this.queryListParam.page = params.page + 1;
        this.queryData();
    }
    //之前一版的提交
    // updateSel (){
    //     let that = this;
    //     //if(that.selectedSel){
    //         that.adminService.updateSel(that.selectedSel).then((data:any)=>{
    //             //console.log(data.id,'添加');
    //             if(data.id){
    //                 // 添加完成把它从下拉中去掉
    //                 for(let i=0,len=that.selList.length;i<len;i++){
    //                     if(that.selectedSel.id==that.selList[i].id){
    //                         that.selList.splice(i,1);
    //                     }
    //                 }
    //                 that.showMsg("success","添加成功!");
    //             }else{
    //                 that.showMsg("warn","添加失败!");
    //             }
    //         }).catch();
    //     // }else{
    //     //     that.showMsg("warn","已全部添加!");
    //     // }
        
    // }
    // updateTableSel (i:any){
    //     let that = this;
    //     that.tableSel = {
    //         indexId:that.tableList[i].indexId,
    //         name:that.tableList[i].name,
    //         tenantId:that.tableList[i].tenantId
    //     }
        
    //     that.adminService.updateSel(that.tableSel).then((data:any)=>{
            
    //         if(data.id){
    //             that.showMsg("success","添加成功!");
    //             this.tableList.splice(i,1);
    //         }else{
    //             that.showMsg("warn","添加失败!");
    //         }
    //     }).catch();

    // }
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