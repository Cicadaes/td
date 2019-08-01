import { SelectItem, Message } from 'primeng/primeng';
import { Component, Input } from '@angular/core';
import * as moment from 'moment';
import { UtilesService } from './../../../../common/utiles.service';
import { ChannelDefinitionResourceService } from './../../../../services/admin/channel_definition.resource.service';
import { PipelineNodeCommunicationService } from './../../../../services/communication/pipeline-node.communication.service';
import { PipelineDefinitionResourceService } from '../../../../services/admin/pipeline-definition.resource.service';
import { PipelineSegmentGroups } from '../../../../services/campaign/pipeline_segment_groups.resource.service';
import { ErrorHandlingService } from '../../../../services/exceptional/error-handling.service';
import { CampaignDetailExceptionalCommunication } from '../../../../services/exceptional/campaign-detail-exceptional.service';

@Component({
	selector: 'sms-pipe',
	templateUrl: 'sms-pipe.component.html',
	styleUrls: ['sms-pipe.component.scss'],
	providers: [
		ChannelDefinitionResourceService,
		UtilesService,
		PipelineDefinitionResourceService,
		PipelineSegmentGroups
	]
})

//短信推广管道
export class SmsPipeComponent {
	show:boolean = false;//链接框
	testDialog: boolean = false; //测试发送弹出框
	msgs: Message[] = [];
	faultUrl: boolean = false;//链接输入错误
	limitSize: number = 500; //短信内容可输入的字数
	errUrlInfo: string;//插入链接后的错误提示

	isRightNow: boolean = false;//立即发送
	isFixTime: boolean = false;//定时发送
    isLoopTime: boolean = false;//循环发送
    
    selectedLoop: boolean = false;//选择循环发送
    
    sendType: number;//发送类型  1：立即  2：定时
    subTriggerType: number; // 循环发送选择类型

	minDate: Date;//限制的最大时间
	maxDate: Date;//限制的最小时间

	//页面初始化所需值
	groupList: SelectItem [];
	period: SelectItem [];
	outlineTime: SelectItem [];
	week: SelectItem [];
	month: SelectItem [];
	hours: SelectItem [];
	minutes: SelectItem [];

	sendTime: any;//发送的时间
	selectedHous: number = 0; //定时发送选中的小时
	selectedMins: number = 0; //定时发送选中的分钟
	cycleVal: number = 1; //循环类型是每周或每月时使用
	cycleHour: number = 0; //循环发送选中的小时
	cycleMinute: number = 0;//循环发送选中的分钟

	channels: any = [];//短信渠道列表
	csvFileName: string = "";// 黑名单文件名称
	textIndex: number = 0; //记录插入活动链接位置

	sendCellphone: any; //测试发送的手机号码
	faultCellphone: boolean = false;//手机号码错误提示

	showGroupList: boolean = false; //显示投放组下拉列表
    pipelineGroupList: any[] = [];  //投放组下拉列表

	@Input() nodeData: any;
	@Input() startTime: any;
	@Input() endTime: any;

	constructor (
		private channelDefinitionResourceService: ChannelDefinitionResourceService,
		public pipelineNodeCommunicationService: PipelineNodeCommunicationService,
		public utilesService: UtilesService,
		public pipelineDefinitionResourceService: PipelineDefinitionResourceService,
		public pipelineSegmentGroups: PipelineSegmentGroups,
		public errorHandlingService: ErrorHandlingService,
		public campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
	){
		let that = this;

		that.groupList = [
			{label: '每天上午10点', value: 10},
			{label: '每天下午2点', value: 14},
			{label: '每天下午6点', value: 18}
		]
		that.period = [
			{label:'每天', value:3},
			{label:'每周', value:4},
			{label:'每月', value:5}
		];
		that.outlineTime = [
			{label:'4小时', value:null},
			{label:'8小时', value:null},
			{label:'1天', value:null},
			{label:'2天', value:null}
		];
		that.week = [
			{label:'星期一', value:2},
			{label:'星期二', value:3},
			{label:'星期三', value:4},
			{label:'星期四', value:5},
			{label:'星期五', value:6},
			{label:'星期六', value:7},
			{label:'星期日', value:1},
		];
		
		that.month = [];
		for(let i=1;i<32;i++){
			that.month.push({label:i+'号',value:i});
		};
		that.month.push({label:'最后一天',value:'last'});
		that.hours = [];
		for(let i = 0;i < 24; i++){
			that.hours.push({label:i+'时',value:i});
		}
		that.minutes = [];
		for(let i = 0; i < 60;i++){
			that.minutes.push({label:i+'分',value:i});
		}
		
	}

	ngOnChanges() {
		let that = this;
		that.isRightNow = false;
		that.isFixTime = false;
        that.isLoopTime = false;

        that.sendTime = '';
		that.selectedHous = 0;
		that.selectedMins = 0;
		that.cycleHour = 0;
		that.cycleMinute = 0;
		that.cycleVal = 1;
        that.sendType = 1;
        
		that.csvFileName = that.nodeData.attachmentName ? that.nodeData.attachmentName : "";
		//初始化投放时间
		if(that.nodeData.triggerType) {
            that.sendType = that.nodeData.triggerType;
			if(that.sendType == 1){
				that.isRightNow = true;
			}else if(that.sendType == 2){
                that.isFixTime = true;
                that.selectedLoop = false;
				//初始化定时发送
				that.sendTime = that.nodeData.appointedTime ? that.nodeData.appointedTime : '';
				this.selectedHous = that.nodeData.appointedTime ? moment(that.sendTime).hours() : 0;
				this.selectedMins = that.nodeData.appointedTime ? moment(that.sendTime).minutes() : 0;
				this.sendTime = that.nodeData.appointedTime ? new Date((moment(that.sendTime).startOf('day')).toString()) : '';
			} else if(that.sendType == 3) {
				that.isLoopTime = true; 
				that.selectedLoop = true;
                //解析cron并赋值
                let loopDate;
                if (that.nodeData.cronExpression) {
                    loopDate = that.utilesService.transformToObj(that.nodeData.cronExpression);
                } else {
                    loopDate = {};
                }
                that.subTriggerType = that.nodeData.subTriggerType;
				that.cycleVal = loopDate['cycleVal'] ? loopDate['cycleVal'] : 1;
				that.cycleHour = loopDate['cycleHour'] ? loopDate['cycleHour'] : 0;
				that.cycleMinute = loopDate['cycleMinute'] ? loopDate['cycleMinute'] : 0;
			}
		}else{
			let nowDate = new Date().getTime();
			let startTime = new Date(that.startTime).getTime();
			let endTime = new Date(that.endTime).getTime();
			if(nowDate < startTime || nowDate > endTime) {
				that.isFixTime = true;
                that.sendType = 2;
                that.pipelineNodeCommunicationService.nodeData.triggerType = 2;
			}else {
				that.isRightNow = true;
                that.sendType = 1;
                that.pipelineNodeCommunicationService.nodeData.triggerType = 1;
			}
		}

		//初始化短信内容剩余可输入的字符
		if(that.nodeData.content) {
			that.limitSize -= that.utilesService.getChartLenth(that.nodeData.content);
		}
	}

	ngOnInit(){
		let that = this;
		//获取短信渠道信息
		let channelType = 2;//和后端约定，channelType为2是查询短信投放渠道
		that.channelDefinitionResourceService.getChanelList(channelType).then((res:any)=>{
			if (res && (res.retCode || res.msgDes)) {
				// campaignDetailExceptionalCommunication.exceptionalMission(res);
				return;
			}
			if(res.data){
				let data = res.data;
				for(let i=0;i<data.length;i++){
					that.channels.push({label:data[i].name, value:data[i].code});
				}
			}
		});
	}

	//判断上传的文件名称
    checkFileName(fileName:string){
		if(fileName){
			let tp = fileName.substr(fileName.length-3,3);
			if(tp.toUpperCase() == 'CSV'){
				return true;
			}
		}
		return false;
	}

	//选择文件时触发
    selectFile(event: any){
		let that = this;
        if(that.checkFileName(event.target.value)){
			let infos = event.target.value.split('\\');
			that.csvFileName = infos[infos.length - 1];
			let formData = new FormData();
			formData.append('uploadFiles', event.target.files[0]);
			that.pipelineDefinitionResourceService.uploadFile(formData).then((data: any) => {
				if(data.retCode) {
					that.showMessageNews('error', data.msgDes || data.errMessage);
					return;
				}
				return that.pipelineDefinitionResourceService.uploadBlacklist(data);
			}).then((data: any) => {
				if(data.retCode) {
					that.showMessageNews('error', data.msgDes || data.errMessage);
					return;
				}
				that.pipelineNodeCommunicationService.nodeData.attachmentName = that.csvFileName;
				that.pipelineNodeCommunicationService.nodeData.attachmentId = data;
			}).catch((err: any) => {
				console.log(err)
			})
		}else{
			that.error("上传的文件格式不正确");
			return;
		}
    }

	clearFile(){
		let that = this;
		that.pipelineNodeCommunicationService.nodeData.attachmentName = "";
		that.pipelineNodeCommunicationService.nodeData.attachmentId = "";
		that.csvFileName = "";
	}

	//error处理
    error(err: any) {
        let that = this;
        that.msgs.push({severity: 'error', summary: '错误', detail: err});
    }

	//显示添加活动链接浮层
	addLink() {
		let that = this;
		that.show = !that.show;
		let content = that.pipelineNodeCommunicationService.nodeData.content;
		if(content) {
			that.textIndex = content.length;
			let inputText = document.getElementById('smsContent');
			that.textIndex = that.doGetCaretPosition(inputText);
		}
	}

	//获取焦点
	doGetCaretPosition(oField: any) {
        let iCaretPos = 0;
        if (document['selection']) { // IE
            oField.focus();
            let oSel = document['selection'].createRange();
            oSel.moveStart('character', -oField.value.length);
            iCaretPos = oSel.text.length;
        } else if (oField.selectionStart || oField.selectionStart == '0') { // Firefox suppor  测试chrome v56.0.2924.87无问题
            iCaretPos = oField.selectionStart;
        }
        return iCaretPos;
    }

	inputChange(){
		let that = this;
		that.faultUrl = false;
	}

	//取消
	cancel(){
		let that = this;
		that.show = !that.show;
	}
	
	//保存链接
	save(){
		let that = this;
		let linkAddress = that.pipelineNodeCommunicationService.nodeData.linkAddress;
		if(!that.utilesService.isURL(linkAddress)){
			that.errUrlInfo = "请输入正确的链接地址。";
			that.faultUrl = true;
			return ;
		}
		let content = that.pipelineNodeCommunicationService.nodeData.content;//短信没有A/B Test 先先死为0
		if(that.utilesService.getChartLenth(content) + linkAddress.length > that.limitSize){
			that.errUrlInfo = "短信内容和链接地址超过500字。";
			that.faultUrl = true;
			return ;
		}
		if(!content) {
			content = linkAddress + " ";
		} else {
			let length = content.length;
			content = content.substring(0 ,that.textIndex) + " " + linkAddress + " " + content.substring(that.textIndex, length);
		}
		that.pipelineNodeCommunicationService.nodeData.content = content;
		that.show = !that.show;
	}

	//输入短信内容（计算短信内容还能输入多少）
	inputContent(){
		let that = this;
		let contentLenth,smsContent;
		contentLenth = that.utilesService.getChartLenth(that.pipelineNodeCommunicationService.nodeData.content);
		that.limitSize = 500 - contentLenth;
		if(that.limitSize <= 0){
			smsContent = that.pipelineNodeCommunicationService.nodeData.content;
			that.pipelineNodeCommunicationService.nodeData.content = that.utilesService.cutByte(smsContent,500);
			that.limitSize = 0;
		}
	}

	//初始化发送类型
	initSendType() {
		let that = this;
		that.isRightNow = false;
		that.isFixTime = false;
        that.isLoopTime = false;
        
        delete that.pipelineNodeCommunicationService.nodeData.expression;

        that.sendTime = '';
		that.selectedHous = 0;
		that.selectedMins = 0;
		that.cycleHour = 0;
		that.cycleMinute = 0;
		that.cycleVal = 1;
    }
    
	/*
	 * triggerType:调度类型： 1、立即发送 2、定时发送 3、循环发送
     * 选中立即发送
	 */
	changeRightNow() {
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		that.initSendType();
		that.pipelineNodeCommunicationService.nodeData.triggerType = 1;
		that.selectedLoop = false;
		that.sendType = 1;
		that.isRightNow = true;
	}

	//选择定时发送
	changeFixTime() {
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		that.initSendType();
		that.pipelineNodeCommunicationService.nodeData.triggerType = 2;
		that.selectedLoop = false;
		that.sendType = 2;
		that.isFixTime = true;
	}

	//选择循环发送
	changeLoop() {
		let that = this;
		if (!that.pipelineNodeCommunicationService.editFlag) {
			return;
		}
		that.initSendType();
		that.pipelineNodeCommunicationService.nodeData.triggerType = 3;
		that.sendType = 3;
		that.isLoopTime = true;
		that.selectedLoop = true;
	}

	//改变定时推送的时间
	changeTime(type: string) {
		let that = this;
        if (that.sendTime) {
            let dateTmp = moment(that.sendTime).set({
                'hour': that.selectedHous,
                'minute': that.selectedMins
            }).format('YYYY-MM-DD HH:mm:ss');
            
            that.pipelineNodeCommunicationService.nodeData.appointedTime = dateTmp;
        }
    }

	//修改循环发送的时间触发
	changeLoopTime(){
		let that = this;
		that.rebuildCron();
	}

	//修改循环发送的类型触发
	sLoop(event: any) {
		let that = this;
		if (event.value == 3) {
			that.cycleHour = 0;
			that.cycleMinute = 0;
		} else {
			that.cycleVal = 1;
			that.cycleHour = 0;
			that.cycleMinute = 0;
		}
		that.rebuildCron();
		that.pipelineNodeCommunicationService.nodeData.subTriggerType = event.value;
	}

	inputCellphone(){
		let that = this;
		that.faultCellphone = false;
	}

	//发送测试短信
	sendTestMsg(){
		let that = this;
		if(!that.utilesService.isCellphoneNumber(that.sendCellphone)){
			that.faultCellphone = true;
		}
	}

	//重新生成cron表达式
	rebuildCron(){
		let that = this;
        let cron = that.utilesService.transformToCron(that.sendType, that.cycleVal, that.cycleHour, that.cycleMinute);
        that.pipelineNodeCommunicationService.nodeData.cronExpression = cron;
	}

	inputPositiveInteger(number: any) {
		if(parseFloat(number).toString() !== "NaN") {
			if(number === 0) {
				return 1;
			}
			if(number < 0) {
				return number * -1;
			}
		}
		return number;
    }
    
    // 提示信息
	showMessageNews(type: any, detail: any) {
		let that = this;
		let message = '';
		if (type === 'info') {
			message = '成功';
		} else if (type === 'error') {
			message = '失败';
		}
		that.msgs.push({severity: type, summary: message, detail: detail})
	}

    /**
	 * 获取投放组列表
	 */
	getGroupList() {
        let that = this;
		if (that.pipelineNodeCommunicationService.nodeData.groupName) {
            that.pipelineSegmentGroups.getGroupList(that.pipelineNodeCommunicationService.nodeData.groupName)
            .then((data: any) => {
                that.groupList = data;
            }).catch((err: any) => {});
        } else {
            that.pipelineSegmentGroups.query()
            .then((data: any) => {
                that.groupList = data;
            }).catch((err) => {});
        }
    }
    
    /**
     * 选中下拉列表中的某个分组
     * @param group 
     */
    selectGroup(group: any) {
        let that = this;
        that.showGroupList = false;
        that.pipelineNodeCommunicationService.nodeData.groupName = group.groupName;
        that.pipelineNodeCommunicationService.nodeData.groupId = group.id;
    }

    showGroups(e: any) {
        e.stopPropagation();
        this.showGroupList = !this.showGroupList;
	}
	
	saveGroup(e: any) {
        if (e && e.keyCode === 13) {
            let that = this;
            that.pipelineSegmentGroups.save(that.pipelineNodeCommunicationService.nodeData.groupName)
            .then((data: any) => {
                that.getGroupList();
            }).catch((err: any) => {});
        }
    }

    /**
     * 隐藏分组下拉列表
     */
    hideGroupList(e: any) {
        this.showGroupList = false;
	}
	
	deleteGroup(data: any) {
		let that = this;
		if (data && data.groupName) {
			that.pipelineSegmentGroups.deleteGroup(data.groupName)
			.then((data: any) => {
				if (data && (data.retCode || data.msgDes)) {
					let error = that.errorHandlingService.getMsg(data);
					that.campaignDetailExceptionalCommunication.exceptionalMission(error.message);
					return;
				}
				that.getGroupList();
			}).catch((err: any) => {})
		}
	}
}