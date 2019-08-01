import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, SimpleChanges} from '@angular/core';
import { CarouselAppAddDialogService } from './carousel-app-add-dialog.service';


@Component({
    selector: 'carousel-app-add-dialog',
    templateUrl: 'carousel-app-add-dialog.component.html',
    styleUrls: ['carousel-app-add-dialog.component.css']
})
export class CarouselAppAddDialogComponent implements OnInit, OnDestroy {
    @Input() isShow:boolean = false;
    @Output() onClose = new EventEmitter<any>();
    @Output() onSubmit = new EventEmitter<any>();
    @Input() queryParams:any;
    @Input() addType:any;
    isVisible = false;
    isSubmit = false;
    isConfirmLoading = false;
    @Input() checkedList : any[];
    appList : any[] = [];
    checkedAppList:any[] = [];
    isCollapse = true;
    curApp:any = {};
    resourceTreeDatas:any[] = [];
    isSetTreeDatas : boolean = true;
    checkedFunIds:any[]=[];

    showModal = () => {
        this.isConfirmLoading = false;
        this.isVisible = true;
        this.isSubmit = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.isShow && changes.isShow.currentValue){
            this.isShow = changes.isShow.currentValue;
        }else{
            this.isShow = false;
        }
        if(this.isShow){
            this.showModal();
        }
    }

    getCheckedAppList(){
        let list:any[] = [];
        if(this.appList && this.appList.length > 0){
            for(let i = 0;i < this.appList.length;i++){
                if(this.appList[i].checked){
                    list.push(this.appList[i]);
                }
            }
        }
        return list;
    }

    handleOk = (e: any) => {
        this.checkedAppList = this.getCheckedAppList();
        this.onSubmit.emit(this.checkedAppList);
        this.isVisible = false;
    }

    handleCancel = (e: any) => {
        this.isVisible = false;
        this.onClose.emit(this.isVisible);
    }


    constructor(private service: CarouselAppAddDialogService) {

    }

    toggleCollapse() {
        this.isCollapse = !this.isCollapse;;
    }

    queryAppList(){
        let param = this.queryParams||{};
        param.status=1;
        this.service.queryAppList(param).then((response:any)=>{
            this.appList=response.result;
            console.log(this.appList);
            this.initCurApp();
        }).catch((err:any)=>{
            console.log(err);
        });
    }
    checkedListData(){
        for(let i=0;i<this.checkedList.length;i++){
            var app =this.checkedList[i];
            if(app.id==this.curApp.id){
                //循环当前已选择中的功能存储
                this.checkedFunIds=[];
                for(let n=0;n<app.tree.length;n++){
                    for(let j=0;j<app.tree[n].children.length;j++){
                        this.checkedFunIds.push(app.tree[n].children[j].id);
                        if(app.tree[n].children[j].children.length>0){
                            this.pushIds(app.tree[n].children[j].children);
                        }
                    }
                    //循环当前功能集，id在选中的则选中
                    for(let j=0;j<this.resourceTreeDatas.length;j++){
                        if(this.resourceTreeDatas[j].children.length>0){
                            this.updateCheckedIds(this.resourceTreeDatas[j].children);
                        }
                    }
                }
            }
        }
    }
    //递归封装选中的ids
    pushIds(data:any){
        for(let i=0;i<data.length;i++){
            this.checkedFunIds.push(data[i].id);
            if(data.children[i].children.length>0){
                this.pushIds(data.children[i].children);
            }
        }
    }
    updateCheckedIds(data:any){
        for(let i=0;i<data.length;i++){
            if(this.dataContains(data[i].id)){
                data[i].checked=true;
            }
            if(data[i].children.length>0){
                this.updateCheckedIds(data[i].children);
            }
        }
    }

    dataContains(funcid:any){
        for(let i=0;i<this.checkedFunIds.length;i++){
            if(this.checkedFunIds[i]==funcid){
                return true;
            }
        }
        return false;
    }

    queryResourceTreeDatasByApp(){
        if(this.curApp.tree && this.curApp.tree.length>0){
            this.resourceTreeDatas=this.curApp.tree;
            //循环选中的applist，将选中的项勾选
            return false;
        }
        let param :any={};
        param.id=this.curApp.id;
        if(this.queryParams){
            param.value=this.queryParams.id;
        }
        this.service.queryAppFunList(param).then((response:any)=>{
            this.resourceTreeDatas=response.result;
            //checkedList，将选中的项勾选
            this.checkedListData();
            this.curApp.tree = this.resourceTreeDatas;
        }).catch((err:any)=>{
            console.log(err);
        });

       /* this.resourceTreeDatas = [{
            id:1,
            label:'产品中心',
            isTree:false,
            children:[{
                id:11,
                label:'MoneyBox',
                children:[],
                checked: true
            },{
                id:12,
                label:'标签体系',
                children:[]
            }]
        },{
            id:2,
            label:'按钮',
            isTree:false,
            children:[{
                id:21,
                label:'产品管理权限',
                children:[]
            },{
                id:22,
                label:'报表配置',
                children:[]
            }]
        },{
            id:3,
            label:'菜单',
            isTree:true,
            children:[{
                id:31,
                label:'移动分析',
                children:[{
                    id:311,
                    label:'数据概览',
                    children:[]
                },{
                    id:312,
                    label:'运营分析',
                    children:[{
                        id:3121,
                        label:'渠道分析',
                        children:[]
                    },{
                        id:3122,
                        label:'用户留存',
                        children:[]
                    },{
                        id:3123,
                        label:'活跃分析',
                        children:[]
                    }]
                }]
            },{
                id:32,
                label:'WEB分析',
                children:[{
                    id:321,
                    label:'数据概览',
                    children:[]
                },{
                    id:322,
                    label:'运营分析',
                    children:[{
                        id:3221,
                        label:'渠道分析',
                        children:[]
                    },{
                        id:3222,
                        label:'用户留存',
                        children:[]
                    },{
                        id:3223,
                        label:'活跃分析',
                        children:[]
                    }]
                }]
            },{
                id:33,
                label:'跨屏分析',
                children:[{
                    id:331,
                    label:'数据概览',
                    children:[]
                },{
                    id:332,
                    label:'运营分析',
                    children:[{
                        id:3321,
                        label:'渠道分析',
                        children:[]
                    },{
                        id:3322,
                        label:'用户留存',
                        children:[]
                    },{
                        id:3323,
                        label:'活跃分析',
                        children:[]
                    }]
                }]
            }]
        }];*/
    }

    checkCurApp(app:any){

    }

    initCurApp(){
        if(this.appList && this.appList.length > 0){
            this.appList[0].active = true;
            this.curApp = this.appList[0];
            this.queryResourceTreeDatasByApp();
        }
    }

    resetCurApp(app:any){
        if(this.appList && this.appList.length > 0){
            for(let i = 0;i < this.appList.length;i++){
                this.appList[i].active = false;
            }
        }
        app.active = true;
        this.curApp = app;
        this.queryResourceTreeDatasByApp();
    }

    /*checkAppIsActive(app:any){
        let isActive :boolean = false;
        if(app && this.appList && this.appList.length > 0){
            for(let i = 0;i < this.appList.length;i++){
                if(this.appList[i].active && app.id == this.appList[i].id){
                    isActive = true;
                    break;
                }
            }
        }
        return isActive;
    }*/


    editApp(app:any){
        this.resetCurApp(app);
    }

    getBackTreeDatas(datas:any[]){

    }

    ngOnInit() {
        this.queryAppList();
    }

    ngOnDestroy() {

    }

}