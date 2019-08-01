import { Component } from '@angular/core';
import { 
    DropdownModule,
    Message,
    DialogModule,
    ButtonModule
} from 'primeng/primeng';
import { ConfirmationService } from "primeng/components/common/api";
import { ErrorHandlingService } from './../../../services/exceptional/error-handling.service';
import { TargetDefinitionResourceService } from './../../../services/admin/target-definition.resource.service';
@Component({
    selector: 'index-config',
    templateUrl: 'index-config.component.html',
    styleUrls: ['index-config.component.css'],
    providers: [TargetDefinitionResourceService,ConfirmationService,ErrorHandlingService]
})

export class IndexConfigComponent {
    isDisabled:boolean = false;     //新建按钮是否禁用
    selList: any[] = [];        //下拉
    msgs: Message[] = [];
    newDisplay:boolean = false; //新建弹框显隐
    acceptLabel: string = '确认'; //删除弹框按钮默认显示
    rejectLabel: string = '取消'; //删除弹框按钮默认显示
    searchName: any = '';       //搜索名字
    updateTableList:any = [];   //查询的已经提交过的列表数据

    currentRows:any=10;
    queryListParam :any = {}; //查询参数
    value: any = {              //分页配置
        totalRecords: 0,        //总条数
        rows: this.currentRows, //每页显示条数
        pageLinkSize: 10,       //页码显示数量
        rowsPerPageOptions: [10, 20, 50, 100] //条数切换
    };
    desWarnShow: boolean = false; //描述提醒
    desWarnShow2: boolean = false;
    isActive: boolean = false; //活动被占用提示

    configInfo: any = {};//配置对象
    selectedValue: any;//选中的下拉框中的值

    dialogHeader: string;//弹出框头部显示

    constructor (
        private confirmationService:ConfirmationService,
        public errorHandlingService: ErrorHandlingService,
        private targetDefinitionResourceService: TargetDefinitionResourceService
    ) {
        let that = this;
        that.initParam();
        

        that.queryData();

        //查询用户管家的事件列表
        this.querySelect();
    }

    /**
     * 初始化查询参数
     */
    initParam(){
        let that = this;
        that.queryListParam = {
            'page': 1,
            'pageSize': 10
        }
    }

    //查询新建弹框下拉数据
    querySelect (){
        let that = this;
        that.selList = [];
        that.targetDefinitionResourceService.queryUserTargets().then((data:any)=>{
            if(data && (data.retCode || data.msgDes)) {
                let err = that.errorHandlingService.getMsg(data);
                that.showMsg("warn",err.message);
                return;
            }
            if(data.length == 0){
                that.showMsg("warn","暂时没有可新建数据!");
                that.isDisabled = true;
            }else{
                that.isDisabled = false;
                //默认第一条
                that.selectedValue = data[0];
                for(let i=0; i<data.length;i++){ 
                    that.selList.push({
                        label: data[i].name,
                        value: data[i]
                    });
                }
            }
            
        }).catch(

        );
    }

    //查询列表  type是标注从哪进入的（created指创建后进入，处理分页组件不选中造成的问题，分页组件后调整）
    queryData (type?: string){
        let that = this;
        that.targetDefinitionResourceService.query(that.queryListParam).then((data:any) => {
            if(data.data.length == 0 && data.total > 0){
                that.queryListParam.page --;
                that.queryData();
            }else{
                if(type && "created" == type && data.total % 10 == 1){
                    that.queryListParam.page = Math.ceil(data.total/10);
                    that.queryData();
                }
                that.updateTableList = data.data;
                that.value.totalRecords = data.total;
            }
        }).catch(

        );
    }
    changeSel (){
        
    }
    
    //新建
    newBuild (){
        let that = this;
        that.configInfo = {};
        that.newDisplay = true;
        that.dialogHeader = "新建指标";
    }
    //新建取消
    cancelNew (){
        this.newDisplay = false;
    }
    dialogHide (){
        /*if(this.selectedSel){
            this.newName = this.selectedSel.name;
        }*/
    }
    //确定新建/修改
    confirmNew (){
        //调提交接口
        let that = this;
        if(that.configInfo.name){
            if(that.configInfo.name.length > 32){
                that.showMsg("warn","名称长度不能超过32！");
                return;
            }

            if(that.configInfo.description && that.configInfo.description.length > 240){
                that.desWarnShow = true;
            }else{
                that.desWarnShow = false;
                
                if(that.configInfo.id){
                    that.targetDefinitionResourceService.update(that.configInfo).then((data:any)=>{
                        if (data && data._body) {
                            data = JSON.parse(data._body);
                        }
                        if(data && (data.retCode || data.msgDes)) {
                            let err = that.errorHandlingService.getMsg(data);
                            that.showMsg("warn",err.message);
                            return;
                        }
                        that.showMsg("success","修改成功!");
                        that.newDisplay = false;
                        that.queryData();
                    }).catch();
                }else{
                    that.configInfo['code'] = that.selectedValue.code;
                    that.configInfo['value'] = that.selectedValue.value;
                    that.configInfo['indexId'] = that.selectedValue.indexId;
                    that.targetDefinitionResourceService.create(that.configInfo).then((data:any)=>{
                        if(data && (data.retCode || data.msgDes)) {
                            let err = that.errorHandlingService.getMsg(data);
                            that.showMsg("warn",err.message);
                            return;
                        }
                        if(data.id){
                            that.showMsg("success","添加成功!");
                            that.newDisplay = false;
                            that.queryData("created");
                            that.querySelect();
                        }
                    }).catch();
                }
            }
            
        }else{
            this.showMsg("warn","名称不能为空!");
        }
        
    }
    //删除
    delete (info: any){
        let that = this;
        that.confirmationService.confirm({
            message: '您确定继续删除"' + info.name + '"指标 ?',
            header: '确定删除', 
            accept: () => {
                that.targetDefinitionResourceService.remove(info.id).then((data:any) =>{
                    that.showMsg("success","删除成功!");
                    that.queryData();
                    that.querySelect();
                }).catch();
            }
        });
    }
    //修改
    change (info: any){
        let that = this;
        that.newDisplay = true;
        that.dialogHeader = "修改指标";
        that.targetDefinitionResourceService.get(info.id).then((data: any) => {
            that.configInfo = data;
        }).catch(

        );
    }
    //关闭提示弹框
    noticeDialogHide (){
        this.isActive = false;
    }
    //搜索
    search (){
        let that = this;
        if(that.searchName){
            that.queryListParam.nameOperator = 'like';
            that.queryListParam.name = '%25' + that.searchName + '%25';
            that.queryData();
        }
        
    }
    //取消搜索
    cancelSearch (){
        this.searchName = '';
        this.initParam();
        this.queryData();
    }
    //分页
    paginate(params: any) {
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