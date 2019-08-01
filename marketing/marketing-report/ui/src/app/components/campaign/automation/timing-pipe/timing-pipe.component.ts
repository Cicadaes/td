import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as moment from 'moment';
import { Message } from 'primeng/primeng';

import { AppConfResourceService } from './../../../../services/campaign/app_conf.resource.service';
import { PipelineNodeCommunicationService } from './../../../../services/communication/pipeline-node.communication.service';
import { PipelineDefinitionResourceService } from "../../../../services/admin/pipeline-definition.resource.service";

@Component({
	selector: 'timing-pipe',
	templateUrl: 'timing-pipe.component.html',
	styleUrls: ['timing-pipe.component.scss'],
	providers: [ PipelineDefinitionResourceService ]
})

//计时管道
export class TimingPipeComponent implements OnInit, OnChanges {
	msgs: Message[] = [];  //检测成功\系统报错 使用
	
	minDate: Date;//限制的最大时间
	maxDate: Date;//限制的最小时间
	/**
	 * 页面初始化所需要的值
	 */
	hours: SelectItem[];
	minutes: SelectItem[];

	stopTime: any;//停止计时的时间
	selectedHous: number; //停止计时选中的小时
	selectedMins: number; //停止计时选中的分钟

	afterDay: number; //经时定时器的天
	afterHours: number;//经时定时器的小时
	afterMinutes: number;//经时定时器的分钟

	behaviorSettings: any = [];//目标计时器的满足条件
	timeRelation: string = 'or';//目标计时器时间与条件之间的关系
	settingRelation: string = 'or';//目标计时器满足条件之前的关系1:or  2:and

	appConfList: any = [];//应用列表
	eventList: any = [];//事件列表

	@Input() nodeData: any;
	@Input() startTime: any;
	@Input() endTime: any;

	constructor(
		private pipelineNodeCommunicationService: PipelineNodeCommunicationService,
		private appConfResourceService: AppConfResourceService,
		public pipelineDefinitionResourceService: PipelineDefinitionResourceService
	) {
		let that = this;
	}

	ngOnInit() {
		let that = this;

		that.hours = [];
		for (let i = 0; i < 24; i++) {
			that.hours.push({ label: i + '时', value: i });
		}
		that.minutes = [];
		for (let i = 0; i < 60; i++) {
			that.minutes.push({ label: i + '分', value: i });
		}

		that.getAppList();
		that.getEventList();
	}

	ngOnChanges() {
		let that = this;
		that.inititalViewData();
	}

	ngOnDestory() {
		let that = this;
		that.pipelineNodeCommunicationService.nodeData.expression = that.buildExpression();
	}

	// 回显
	inititalViewData() {
		let that = this;

		that.behaviorSettings = []; // 初始化行为事件数组
		//that.stopTime = that.startTime;   停止计时的时间
		that.stopTime = '';
		that.selectedHous = undefined; //停止计时选中的小时
		that.selectedMins = undefined; //停止计时选中的分钟
		that.minDate = that.startTime;
		that.maxDate = that.endTime;

		//初始化计时器类型
		if (!that.nodeData.hourMeterType) {
			that.nodeData.hourMeterType = '1';
		} else if (that.nodeData.hourMeterType == '1') {//目标计时器
			that.pipelineNodeCommunicationService.nodeData.hourMeterType = '1';
			if (that.nodeData.stopTimeMillis) { //回显显示目标计时器的时间
				that.selectedHous = moment(that.nodeData.stopTimeMillis).hours();

				that.selectedMins = moment(that.nodeData.stopTimeMillis).minutes();
				that.stopTime = new Date((moment(that.nodeData.stopTimeMillis).startOf('day')).toString());
			}
			if (that.nodeData.expression) { //回显显示目标计时器的条件
				that.expressionToObj(that.nodeData.expression);
			}
		} else if (that.nodeData.hourMeterType == '2') {//经时计时器
			that.pipelineNodeCommunicationService.nodeData.hourMeterType = '2';
			let afterTime = that.nodeData.timeSchedulingExpression;
			if (afterTime) {
				that.afterDay = afterTime.split(' : ')[0];
				that.afterHours = afterTime.split(' : ')[1];
				that.afterMinutes = afterTime.split(' : ')[2];
			}else {
				that.afterDay = undefined;
				that.afterHours = undefined;
				that.afterMinutes = undefined;
			}
		}
	}

	//获取app列表
	getAppList() {
		let that = this;
		that.appConfList = [];
		that.appConfResourceService.getAppList().then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
				// let err = that.errorHandlingService.getMsg(data);
				// that.showErrorInfo("warn",err.message);
				return;
			}
			if (data) {
				for (let i = 0; i < data.length; i++) {
					that.appConfList.push({ label: data[i].appName, value: data[i].appId });
				}
			}
		}).catch(err => { })
	}

	//查询新建弹框下拉数据
	getEventList() {
		let that = this;
		that.eventList = [];
		that.pipelineDefinitionResourceService.getEvent(4).then((result: any) => {
			if (result) {
				for (let i = 0; i < result.length; i++) {
					that.eventList.push({
						label: result[i].name,
						value: result[i].code
					});
				}
			}
		}).catch();
	}

	//选择类型
	choosType(val: any) {
		let that = this;
		if(val !== that.pipelineNodeCommunicationService.nodeData.hourMeterType) {
			that.stopTime = undefined;
			that.selectedHous = undefined;
			that.selectedMins = undefined;
		
			that.afterDay = undefined;
			that.afterHours = undefined;
			that.afterMinutes = undefined;
			delete that.pipelineNodeCommunicationService.nodeData.expression;
			delete that.pipelineNodeCommunicationService.nodeData.timeSchedulingExpression;
		}
		
		that.pipelineNodeCommunicationService.nodeData.hourMeterType = val;
	}

	/**
	 * 改变停止计时的时间
	 * 格式：2017-10-10 11:03:00
	 * @param {string} type 
	 */
	changeTime(type: string) {
		let that = this;
		if (that.stopTime) {
			that.selectedHous = that.selectedHous || 0;
			that.selectedMins = that.selectedMins || 0;
			let dateTmp = moment(that.stopTime).set({
				'hour': that.selectedHous,
				'minute': that.selectedMins
			}).valueOf();

            that.pipelineNodeCommunicationService.nodeData.stopTimeMillis = dateTmp;
            that.pipelineNodeCommunicationService.nodeData.expression = that.buildExpression();
		}
	}

	//选择行为条件
	changeBehavior() {
		let that = this;
		//if (that.checkAppsAndEvents()) {
			that.pipelineNodeCommunicationService.nodeData.expression = that.buildExpression();
		//}
	}

	// 检查所有的行为条件是否都满足已经填写的情况
	checkAppsAndEvents() {
		let that = this;
		let settingLength = that.behaviorSettings.length;

		for (let i = 0; i < settingLength; i++) {
			if (that.behaviorSettings[i]['selectedApp'] === '' || that.behaviorSettings[i]['selectedEvent'] === '' || that.behaviorSettings[i]['selectedEvent'] === 'undefined') {
				return false;
			}
		}
		return true;
	}

	//添加目标计时器的满足条件
	addSetting(settings: any) {
		let that = this;
		let relation: boolean;
		if(that.behaviorSettings.length > 9) {
			that.showMessageNews('error', '最多可以添加10条');
			return;
		}
		if (that.behaviorSettings[1]) {
			if (that.behaviorSettings[1]['relation']) {
				relation = that.behaviorSettings[1]['relation']
			} else {
				relation = false;
			}
		} else {
			relation = false;
		}
		//判断是否有正在编辑的条件
		if (that.checkAppsAndEvents()) {
			that.behaviorSettings.push({
				selectedApp: '',
				selectedEvent: '',
				relation: relation
			});
		} else {
			that.showMessageNews('error', '还有未编辑完成的条件！');
		}
	}

	//删除目标计时器的满足条件
	delSetting(index: any) {
		let that = this;
		that.behaviorSettings.splice(index, 1);
		that.pipelineNodeCommunicationService.nodeData.expression = that.buildExpression();
	}

	//清空目标计时器的时间
	clearSetting() {
		let that = this;
		that.stopTime = '';
		that.selectedHous = undefined;
		that.selectedMins = undefined;
		delete that.pipelineNodeCommunicationService.nodeData.timeSchedulingExpression;

		delete that.pipelineNodeCommunicationService.nodeData.stopTimeMillis;
		delete that.pipelineNodeCommunicationService.nodeData.expression;
	}

	/**
	 * 改变条件间的关系
	 * @param {boolean} flag true为并且   false为或者
	 * @param {number} index
	 */  
	changeRelation(flag: boolean, index: number) {
		let that = this;
		let settingLength = that.behaviorSettings.length;
		if(index == 0){
			that.behaviorSettings[0]['relation'] = flag;
		}else {
			for (let i = 1; i < settingLength; i++) {
				that.behaviorSettings[i]['relation'] = flag;
			}
		}
		that.pipelineNodeCommunicationService.nodeData.expression = that.buildExpression();
	}

	// 组装 behaviorSettings =>> expression
	buildExpression() {
		let that = this;
		let expression: string = `time : >= : '${moment(that.pipelineNodeCommunicationService.nodeData.stopTimeMillis).format('YYYY-MM-DD HH:mm:ss')}'`;
		let settingLength: number = that.behaviorSettings.length;
		for (let i = 0; i < settingLength; i++) {
			let selectedApp = that.behaviorSettings[i]['selectedApp'] || 'undefined';
			let selectedEvent = that.behaviorSettings[i]['selectedEvent'] || 'undefined';
			let relation = that.behaviorSettings[i]['relation'] ? '&&' : '||';
			expression += ` : ${relation} : ( : 'app' : == : '${selectedApp}' : && : 'event' : == : '${selectedEvent}' : )`;
		}
		return expression;
	}

	/**
	 * 条件转换为对象（页面回显）
	 * 第一个关系是固定的或者
	 * time : >= : '2017-10-10 11:03:00' : && : ( : 'app' : == : 'app1' : && : 'event' : == : 'event1' : ) : && : ( : 'app' : == : 'app2' : && : 'event' : == : 'event2' : )
	 */
	expressionToObj(expression: any) {
		let that = this;
		if(expression.indexOf('(') === -1) {
			return;
		}
		let expressionTmp = expression.slice(expression.indexOf('(') - 6, expression.length);	
		let arrTmp = expressionTmp.split(":");
		let settingStrArr = [];
		let settingLength = arrTmp.length / 10;
		let repeatTimes = 0;

		for (let i = 0; i < settingLength; i++) {
			let str = '';
			repeatTimes += 10;
			for (let j = (repeatTimes - 10); j < repeatTimes; j++) {
				str += arrTmp[j];
			}
			settingStrArr[i] = str;
			that.behaviorSettings[i] = {};
		}

		for (let i = 0; i < settingLength; i++) {
			that.behaviorSettings[i]['relation'] = settingStrArr[i].split('(')[0].trim() === '&&' ? true : false;
			that.behaviorSettings[i]['selectedApp'] = unquote(settingStrArr[i].split('==')[1].split('&&')[0].trim());
			that.behaviorSettings[i]['selectedEvent'] = unquote(settingStrArr[i].split('==')[2].split(')')[0].trim());
		}

		function unquote(str: string) {
			return str.slice(1, str.length - 1);
		}
	}

	//经时定时器停止计时时间
	changeStop() {
		let that = this;
		if (that.afterDay && that.afterHours && that.afterMinutes) {
			that.pipelineNodeCommunicationService.nodeData.timeSchedulingExpression = that.afterDay + " : " + that.afterHours + " : " + that.afterMinutes;
		}
	}

	// 右上角提示信息
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
}