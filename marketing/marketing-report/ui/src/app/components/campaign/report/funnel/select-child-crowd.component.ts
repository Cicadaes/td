import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Message} from 'primeng/primeng';
import { CrowdResourceService } from "../../../../services/campaign/crowd.resource.service";
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";

@Component({
    selector: 'select-child-crowd',
    templateUrl: 'select-child-crowd.component.html',
    styleUrls: ['select-child-crowd.component.css'],
    	providers: []

})

export class SelectChildCrowdCompoment {
    display: boolean;
    searchParams: string;
    crowdList: any[];
    selectList: any[] = [];
    childCrowdList: any=[];
    selectedCrowds:any = [];

    //备份的人群列表数据
    allCrowdList: any[]=[];

    colors: any = ['#5ba0ff','#ff8686'];

    msgs: Message[] = [];

    disabled: boolean = false;
    
    disables: any = []; //记录每一个的true false

    indexArr:any = []; //记录选中的index
    @Input() campaignId:number;

    @Input()
    set showSelectCrowd(bl: boolean) {
        this.display = bl;
    }

    @Output() hideSelectCrowd = new EventEmitter<boolean>();

    @Output() checkedCrowdList = new EventEmitter<any[]>();
    

    constructor(
        private crowdResourceService: CrowdResourceService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
    ){
        this.crowdList = [];
    }
    ngOnInit(){
        this.getCrowdList();
    }

    //过滤子人群
    search() {
        let that = this;
        let filtered : any[] = [];
        for(let i = 0; i < that.allCrowdList.length; i++) {
            let crowd = that.allCrowdList[i];
            if(crowd.refName.indexOf(that.searchParams) != -1) {
                filtered.push(crowd);
            }
        }
        this.crowdList = filtered;
    }
	//选择人群
	selectedCrowd (index: any){
        let that = this;
        if(that.selectList.length <= 1){
            for(let i = 0;i < that.crowdList.length; i++){
                that.crowdList[i].dis = false;
            }
        }
        if(that.selectList.length >=2){
            for(let i=0; i < that.crowdList.length; i++){
                if(that.crowdList[i].id != that.selectList[0] && that.crowdList[i].id != that.selectList[1]){
                    that.crowdList[i].dis = true;
                }
            }
        }
    
	}
    
    //获取人群列表
	getCrowdList(){
        let that = this;
        that.crowdResourceService.query({campaignId: that.campaignId})
            .then((data: any) => {
                if (data && (data.retCode || data.msgDes)) {
                    that.campaignDetailExceptionalCommunication.exceptionalMission(data);
                    return;
                }
                that.crowdList = data;
                //备份一份人群数据
                for(let i = 0 ; i < data.length ; i ++){
                    that.crowdList[i].dis = false;
                }
                that.allCrowdList = data;
            }).catch(err => {
                that.campaignDetailExceptionalCommunication.exceptionalMission(err);
            });
	}
	//取消选择
	cancelChoice (){
		this.selectList = [];
        this.initFn();
	}
	//取消
    closeDialog (hide:any) {
        let that = this;
        that.selectList = [];
        if(that.selectedCrowds && that.selectedCrowds.length>0){
            for(let i=0;i<that.selectedCrowds.length;i++){
                that.selectList.push(that.selectedCrowds[i].id);
            }
        }
        that.display = false;
        that.hideSelectCrowd.emit(this.display);
        hide.hide();
        if (that.selectList.length != 2) {
            that.initFn();
        } else {
            for (let i = 0; i < that.allCrowdList.length; i++) {
                let flag = true;
                for(let j = 0; j < that.selectedCrowds.length;j++){
                    if (that.allCrowdList[i].id == that.selectedCrowds[j].id) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    that.allCrowdList[i].dis = true;
                } else {
                    that.allCrowdList[i].dis = false;
                }
            }
        }
    }
    //初始化
    initFn(){
        for(let i=0;i< this.allCrowdList.length; i++){
            this.allCrowdList[i].dis = false;
        }
    }
    //清空搜索
    clearSearch(){
        let that = this;
        that.searchParams = "";
        that.crowdList = that.allCrowdList;
    }
	//确定
    save (hide:any) {
       	let that = this;
       	if(that.selectList.length<3){
       		that.display = false;
	        that.hideSelectCrowd.emit(that.display);
            that.formateMsg();
	        that.checkedCrowdList.emit(that.selectedCrowds);
            that.childCrowdList = that.selectedCrowds;
       	}
        hide.hide();
    }

    //将选中的人群放到另外一个对象里
    formateMsg(){
        let that = this;
        that.selectedCrowds = [];
        for(let i=0;i<that.allCrowdList.length;i++){
            for(let j=0;j<that.selectList.length;j++){
                if(that.selectList[j]==that.allCrowdList[i].id){
                    let crowd = that.allCrowdList[i];
                    crowd['color'] = that.colors[j];
                    that.selectedCrowds.push(crowd);
                }
            }
        }
    }
}