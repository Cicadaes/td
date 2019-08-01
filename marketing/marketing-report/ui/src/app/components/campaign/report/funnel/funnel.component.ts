import {
	Component, Input
} from '@angular/core';
import {
	SelectItem,
	ConfirmationService
} from 'primeng/primeng';
import { CampaignFunnelConfigResourceService } from "../../../../services/campaign/campaign_funnel_config.resource.service";
import { FunnelCommunicationService } from './../../../../services/communication/funnel.communication.service';
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";
import { ErrorHandlingService } from './../../../../services/exceptional/error-handling.service';
import { FunnelService } from './../../../../services/report/funnel.communication.service';
import * as moment from 'moment';
// let bdcharts = require('echarts');
let bdcharts = require('echarts/lib/echarts');
// 引入折线图
// require('echarts/lib/chart/line');
// 引入柱状图
// require('echarts/lib/chart/bar');
@Component({
	selector: 'funnel',
	templateUrl: 'funnel.component.html',
	styleUrls: ['funnel.component.css'],
	providers: [CampaignFunnelConfigResourceService,FunnelCommunicationService,ConfirmationService,FunnelService]
})

export class FunnelConpoment {
	//活动id
	@Input() campaignId:any;

	@Input() campaignName: any;

	showAddFunnel: boolean = false;
	showSuccess: boolean = false; //控制成功弹框显示
	showSelectCrowd: boolean = false;
	funnelList: SelectItem[] = [];
	selectFunnelId: any;    //选中的funnel id id为表的主键
	sFunnelId: number;      //选中的funnelId 

	legends:any = [];

	showTrendCharts:boolean = true;
	tempFunnelData: any;  //存放当前漏斗数据

	isFirLoadLine: boolean = true;//用于折线图的一些交互init
	isFirLoadFunnel: boolean = true;//用于折线图的一些交互init
	steps:any = [];//用于折线图查看第几步到第几步的趋势
	//默认的漏斗
	defFun: any = {};
	childCrowdList: any=[];
	crowdIdList:any = [];
	allFunnel: any;
	defaultFunnleId: number = 0;
	//转换概览
	transOverview: any = [];
	//步骤选择
	step1: any = [];
	step2: any = [];
	selectedStep1: string = '1';
	selectedStep2: string = '1';
	selectedTime: string = '';
	//日期 数值 占比 选择
	isDay: boolean = true;
	isWeek: boolean = false;
	isMonth: boolean = false;
	granularity:string = "day";
	//终点事件累计完成趋势图 时间选择
	isDay2: boolean = true;
	isWeek2: boolean = false;
	isMonth2: boolean = false;
	granularity2:string = "day";
	//漏斗数据
	funnelChart: any;
	xFunnelData: any = [];
	yFunnelData: any = [];
	funnelSeries: any = [];
	//折线数据
	lineChart: any;
	xData: any = [];
	line1Data: any = [];
	line2Data: any = [];
	lineSeries: any = [];
	//柱状数据
	barChart: any;
	barXData: any = [];
	barData: any = [];
	index:any;
	constructor(
		private campaignFunnelConfigResourceService: CampaignFunnelConfigResourceService,
		private funnelCommunicationService: FunnelCommunicationService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication,
        private confirmationService: ConfirmationService,
		private funnelService: FunnelService,
		public errorHandlingService: ErrorHandlingService
	){
		//test 漏斗相关接口调试   start
		/*funnelService.createFunnel({"campaign_id":2,"create_time":201703231504,"crowd_id":1,"default_flag":true,"funnel_id":1,"name":"漏斗活动关系"}).then((data:any)=>{
		    console.log(data,"createFunnel");
		});*/
		/*funnelService.getFunnelEvent(1).then((data:any)=>{
		    console.log(data,"getFunnelEvent");
		});*/

		//test 漏斗相关接口调试   end
	}

	ngOnChanges(){

	}

	ngOnInit() {
		let that = this;
		this.getFunnelList();
		that.funnelCommunicationService.campaignId = that.campaignId;
	}
	
	focusList() {
		let that = this;
		let i = 0;
        for (i = 0; i < that.allFunnel.length; i++) {
            if (that.allFunnel[i]['defaultFlag']) {//判断是不是默认的
                that.defaultFunnleId = that.allFunnel[i].id;
                that.index = i;
            }
            break;
        }
        if (i == that.allFunnel.length) {
            that.index = null;
            return;
        }
		setTimeout(function () {
			let oList = document.querySelector('.ui-dropdown-list');
			if (oList && "number" == typeof(that.index)) {
				let oS = oList.children;
				// oS[that.index + 1]['style'].backgroundImage = 'url(../../../../../public/images/moren.png)';
				oS[that.index + 1]['style'].backgroundImage = 'url(/marketing/public/images/moren.png)';
				oS[that.index + 1]['style'].backgroundRepeat = 'no-repeat';
			}
		}, 0);
	}

	selectFunnel() {
		let that = this;
		for (let i = 0; i < that.allFunnel.length; i++) {
			if (that.selectFunnelId == that.allFunnel[i]['id']) {
				that.defFun = that.allFunnel[i];
				that.sFunnelId = that.allFunnel[i].funnelId;
				that.funnelCommunicationService.selectedFunnelId = that.allFunnel[i].funnelId;
			}
		}
		this.getFunnelView();
	}

	getFunnelList(){
		let that = this;
        that.defFun = {};   //清空历史数据
		that.funnelList = [];
		that.funnelList.push({
			label: '新建漏斗',
			value: 'add'
		});
		//获取漏斗列表
		that.campaignFunnelConfigResourceService.query({campaignId: that.campaignId,pageSize:100}).then((data: any) => {
			if (data && (data.retCode || data.msgDes)) {
                that.error(data);
                return;
            }
			if (data && data.length > 0) {
				that.allFunnel = data;//备份一份漏斗列表
				let fromFlag = false;//判断是不是从修改或者添加页面进入的
				if (that.funnelCommunicationService && that.funnelCommunicationService.selectedFunnelId) {
					fromFlag = true;
				}
				for (let i = 0; i < data.length; i++) {
					if (fromFlag) {
						if (that.funnelCommunicationService.selectedFunnelId == data[i].funnelId) {
							that.selectFunnelId = data[i].id;
							that.sFunnelId = data[i].funnelId;
                            that.defFun = data[i];
                            if (data[i].defaultFlag) { //判断是不是默认的
                                that.index = i;
                            }
						}
					} else {
						if (data[i].defaultFlag) { //判断是不是默认的
							that.selectFunnelId = data[i].id;
							that.sFunnelId = data[i].funnelId;
                            that.defaultFunnleId = data[i].id;
                            that.defFun = data[i];
                            that.index = i;
						}
					}

					that.funnelList.push({
						label: data[i].funnelName,
						value: data[i].id
					});
				}
				
				if (null == that.selectFunnelId) {      //如果没有默认的，就默认选择第一条数据
					that.selectFunnelId = data[0].id;
					that.sFunnelId = data[0].funnelId;
					that.defFun = data[0];
                    that.defaultFunnleId = 0;
                    that.index = null;
				}
				that.funnelCommunicationService.selectedFunnelId = that.sFunnelId;
				//第一次进入时需要INIT
				that.getFunnelView();
				// that.getUserLossCharts();
				// that.lastEventTrendCharts();
				// that.trendLineCharts();
				that.funnelCommunicationService.funnelListName = that.allFunnel;
			} else {
				that.showTrendCharts = false;
			}
		}).catch(err =>{
			that.error('系统繁忙，请稍后重试');
		});
		
	}

	//设置图表的图例颜色；
	setLegendColor(colors: any,status: boolean) {
		let that = this;
		if (status) {
			that.chartData['color'] = colors;
			that.lineChartData['color'] = colors;
			that.barChartData['color'] = colors;
		} else {
			that.chartData['color'] = ['#5ba0ff'];
			that.lineChartData['color'] = ['#5ba0ff'];
			that.barChartData['color'] = ['#5ba0ff'];
		}
	}

	//子人群细分组件交互
	checkedCrowdList(data: any) {
		let that = this;
		let legendcolors: any[] = [];
		that.crowdIdList = [];

		if (data) {
			that.childCrowdList = data;
			for (let i = 0; i < data.length; i++) {
				that.crowdIdList.push(data[i]["id"]);
				legendcolors.push(data[i]['color']);
			}
			//设置图表的图例颜色；
			if (data.length > 0) {
				that.setLegendColor(legendcolors, true);
			} else {
				that.setLegendColor(legendcolors, false);
			}
		}
		that.getFunnelView();
		// that.getUserLossCharts();
	}

	//获取转换概览
	getFunnelView() {
		let that = this;
		let param = {
			funnelId: that.sFunnelId,
			crowdIds: that.crowdIdList
		};
		that.campaignFunnelConfigResourceService.getFunnelConvertOverview(param).then(data => {
            if (data && (data.retCode || data.msgDes)) {
                this.error(data);
                return;
            }
            that.funnelSeries = [];
            that.tempFunnelData = data;
            that.formatFunnelViewData(data);
            that.funnelChart = bdcharts.init(document.getElementById("funnelID"));
            that.chartData.series = that.funnelSeries;
            that.chartData.legend.data = that.legends;
            that.funnelChart.clear();
            that.funnelChart.setOption(that.chartData);
            setTimeout(function () {
                that.funnelChart.resize();
            }, 0);
            that.trendLineCharts();
            that.lastEventTrendCharts();
        }).catch(err => {
            that.error('系统繁忙，请稍后再试！');
        });
	}

	//格式化数据用于图表
	formatFunnelViewData(data:any){
		let that = this;
		//初始化
		that.transOverview = [];
		that.yFunnelData = [];
		that.legends = [];
		for (let i = 0; i < data.length; i++) {

			that.legends.push({name: data[i]['crowdName'], icon: 'circle'});//图表的指示

			let viewData = data[i]['funnelConvertOverviewEventStepItem'];
			if (that.childCrowdList.length === 0) {
				let view = {};

				view['startDeviceCount'] = viewData[0].val;
				view['endDeviceCount'] = viewData[viewData.length - 1].val;
				
				view['wholeConvertRate'] = +(isNaN(+viewData[viewData.length - 1].val / +viewData[0].val) ? 0 : (+viewData[viewData.length - 1].val / +viewData[0].val)* 100).toFixed(2)  + '%';
			
				that.transOverview.push(view);
 			} else {
				for (let j = 0; j < that.childCrowdList.length; j++) {
					if (data[i]['crowdId'] == that.childCrowdList[j]['id']) {
						let view = {};
						view['color'] = that.childCrowdList[j]['color'];
						view['startDeviceCount'] = viewData[0].val;
						view['endDeviceCount'] = viewData[viewData.length - 1].val;
						view['wholeConvertRate'] = +(isNaN(+viewData[viewData.length - 1].val / +viewData[0].val) ? 0 : (+viewData[viewData.length - 1].val / +viewData[0].val)* 100).toFixed(4)  + '%';
						that.transOverview.push(view);
					}
				}
			}
			that.formatFunnelData(data[i]['crowdName'], viewData);
		}
		//如果为两个柱状图对比 修改markPoint
		if (data.length === 2) {
			let markPoint = {
				symbol: 'image://marketing/public/images/funnel2_tip2.png',
				symbolSize: [110, 24],
				label: {
					normal: {
						offset: [-25, -3],
						textStyle: {
							color: '#4EAEFA'
						},
						formatter: function (params: any) {
                            return params.data.value + '%';
                        }
					},
					emphasis: {
						offset: [-25, -3],
						textStyle: {
							color: '#4EAEFA'
						},
						formatter: function (params: any) {
                            return params.data.value + '%';
                        }
					}
				}
			}
			that.funnelSeries[0]['markPoint'] = Object.assign(that.funnelSeries[0]['markPoint'], markPoint);
			let markPoint2 = {
				symbol: 'image://marketing/public/images/funnel2_tip.png',
				symbolSize: [110, 24],
				symbolOffset: ['-100%',' -231%'],
				label: {
					normal: {
						offset: [25, -3],
						textStyle: {
							color: '#FF898D'
						},
						formatter: function (params: any) {
                            return params.data.value + '%';
                        }
					},
					emphasis: {
						offset: [25, -3],
						textStyle: {
							color: '#FF898D'
						},
						formatter: function (params: any) {
                            return params.data.value + '%';
                        }
					}
				}
			}
			that.funnelSeries[1]['markPoint'] = Object.assign(that.funnelSeries[1]['markPoint'], markPoint2);
			// that.funnelSeries[0]['markPoint'].symbol = 'image://public/images/funnel2.png';
			// that.funnelSeries[0]['markPoint'].symbolSize = [100, 24];
			// that.funnelSeries[0]['markPoint'].label.normal['offset'] = [-20, -2];
			// that.funnelSeries[0]['markPoint'].label.emphasis['offset'] = [-20, -2];
		}

		that.chartData.yAxis[0].data = that.yFunnelData;
	}

	//趋势分析折线图
	trendLineCharts(){
		let that = this;
		//line图
		let param = {
			"campaignId": that.campaignId,
			"crowdIds": that.crowdIdList,
			"granularity": that.granularity
		};
		let eventIds = [];
		//获取eventId列表
		eventIds.push(that.tempFunnelData[0].funnelConvertOverviewEventStepItem[+that.selectedStep1 - 1].eventId);
		eventIds.push(that.tempFunnelData[0].funnelConvertOverviewEventStepItem[+that.selectedStep2 - 1].eventId);
		param['eventIds'] = eventIds;
		that.campaignFunnelConfigResourceService.getFunnelChart(param).then(data => {
			if (data && (data.retCode || data.msgDes)) {
				this.error(data);
				return;
			}
			//图表数据置为空
			that.xData = [];
			let legends = [];
			that.lineSeries = [];
			if (data && data.length > 0) {
				for (let i = 0; i < data.length; i++) {
					that.line1Data = [];
					legends.push({
						name: data[i]['crowdName'] || '' + '转化率',
						icon: 'circle'
					});
					let chartsData = data[i]['items'];
					let tempData: any = {};
					for (let j = 0; j < chartsData.length; j++) {
						Object.assign(tempData, chartsData[j]);
					}
					for (let key in tempData) {
						that.line1Data.push(tempData[key]);
						if (that.xData.length < chartsData.length) {
							if (that.granularity == 'day') {
								that.xData.push(moment(key).format("YYYY-MM-DD"));
							} else {
								if (that.granularity == 'month') {
									key = (+key + 1) + '';
								}
								that.xData.push(key);
							}
						}
						// if (that.xData.length < chartsData.length) {
						// 	that.xData.push(moment(key).format("YYYY-MM-DD"));
						// }
					}
					that.buildTrendCharts(data[i]['crowdName'], that.line1Data);
				}
			}
			that.lineChart = bdcharts.init(document.getElementById("lineID"));
			that.lineChartData.xAxis[0].data = that.xData;
			that.lineChartData.legend.data = legends;//图表的指示
			that.lineChartData.series = that.lineSeries;
			that.lineChart.clear();
			that.lineChart.setOption(that.lineChartData);
			setTimeout(function () {
				that.lineChart.resize();
			}, 0);
		}).catch(err => {
			that.error('系统繁忙，请稍后再试！');
		});
	}

	//终点事件累计完成趋势图
	lastEventTrendCharts() {
		let that = this;
		let param = {
			campaignId: that.campaignId,
			crowdIds: that.crowdIdList,
			granularity: that.granularity2
		};
		that.campaignFunnelConfigResourceService.getLastEventChart(that.tempFunnelData[0].funnelConvertOverviewEventStepItem[that.tempFunnelData[0].funnelConvertOverviewEventStepItem.length - 1].eventId, param)
		.then(data => {
			if (data && (data.retCode || data.msgDes)) {
				this.error(data);
				return;
			}
			//图表数据置为空
			that.barData = [];
			that.barXData = [];
			let legends = [];
			if (data && data.length > 0) {
				for (let i = 0; i < data.length; i++) {
					legends.push({
						name: data[i]['crowdName'] || '用户数',
						icon: 'circle'
					});
					let chartsData = data[i]['items'];
					let tempData = [];
					let obejectData: any = {};
					for (let j = 0; j < chartsData.length; j++) {
						Object.assign(obejectData, chartsData[j]);
					}
					for (let key in obejectData) {
						tempData.push(obejectData[key]);
						if (that.barXData.length < chartsData.length) {
							if (that.granularity2 == 'day'){
								that.barXData.push(moment(key).format("YYYY-MM-DD"));
							} else {
								if (that.granularity2 == 'month') {
									key = (+key + 1) + '';
								}
								that.barXData.push(key);
							}
						}
						// if (that.barXData.length < chartsData.length) {
						// 	that.barXData.push(moment(key).format("YYYY-MM-DD"));
						// }
					}
					that.barData.push({
						name: data[i]['crowdName'] || '用户数',
						type: 'line',
						stack: 'one',
						barWidth: '28',
						data: tempData
					});
				}
			}
			that.barChart = bdcharts.init(document.getElementById("barID"));
			that.barChartData.xAxis[0].data = that.barXData;
			that.barChartData.legend['data'] = legends;
			that.barChartData.series = that.barData;
			that.barChart.clear();
			that.barChart.setOption(that.barChartData);
			setTimeout(function () {
				that.barChart.resize();
			}, 0);
		}).catch(err => {
			that.error('系统繁忙，请稍后再试！');
		});
	}

	buildTrendCharts(crowdName:any,data:any){
		let serie = {
			smooth: true,
			name: crowdName || '' + '转化率',
			type: 'line',
			data: data
		};
		this.lineSeries.push(serie);
	}

	//处理接口返回的漏斗数据
	formatFunnelData(crowdName:any, data:any){
		let that = this;
		that.xFunnelData = [];
		that.steps = [];
		let markPointData = [];
		if (that.yFunnelData.length) {
			that.yFunnelData.reverse();
		}
		for (let i = 0; i < data.length; i++) {
			if (data.length > that.yFunnelData.length) {
				that.yFunnelData.push(data[i]['stepOrder'] + '.' + data[i]['stepName']);
			}
			let arry = [];
			arry.push(data.length - 1 - i);
			arry.push(data[i]['val']);
			arry.push(data[i]['convertRate']);
			arry.push(data[i]['totalConvertRate']);
			that.xFunnelData.push(arry);
			that.steps.push({label:data[i]['stepOrder'], value:data[i]['stepOrder']});
			if (i > 0) {
				let json = {
					value: data[i]['convertRate'],
					yAxis: data.length - i - 1,
					x: '100%'
				};
				markPointData.push(json);
			}
		}
		//反转数据
		// that.xFunnelData.reverse();
		that.yFunnelData.reverse();
		that.buildFunnelCharts(crowdName, that.xFunnelData, markPointData);
		//init趋势步骤
		that.initTrendStep();
	}

	buildFunnelCharts(crowdName:any, data:any, markPointData: any) {
		let serie = {
			name: crowdName,
			type: 'bar',
			barWidth: '16',
			encode: {
                x: 1,      
                y: 0,              
                tooltip: [1, 2, 3],
                label: 3          
            },
			markPoint: {
                label: {
                    normal: {
                        show :true,
						offset: [0, -3],
                        formatter: function (params: any) {
                            return params.data.value + '%';
                        }
                    },
					emphasis: {
						show :true,
						offset: [0, -3],
                        formatter: function (params: any) {
                            return params.data.value + '%';
                        }
					}
                },
				silent: true,
				symbolSize: [50, 24],
                symbolOffset:['-100%', '-150%'],
                symbol: 'image://marketing/public/images/funnel_tip.png',
                data: markPointData
            },
			// [{qwe: 11, y: '20%', x:100}]  markPoint.data 数据格式
			// label: {
			// 	normal: {
			// 		show: true,
			// 		position: 'right',
			// 		// offset: [-20, 20],
			// 		textStyle: {
			// 			color: '#000'
			// 		},
			// 		formatter:function(param:any){
			// 			return param.data;
			// 		}
			// 	}
			// },
			data: data
		}
		this.funnelSeries.push(serie);
	}

	initTrendStep(){
		let that = this;
		that.selectedStep1 = that.steps[0]['value'];
		that.selectedStep2 = that.steps[that.steps.length - 1]['value'];
		that.step1 = that.steps.slice(0, +that.selectedStep2 - 1);
		that.step2 = that.steps.slice(+that.selectedStep1);
	}

	//修改选择的趋势
	changeTrendStep(){
		let that = this;
		that.step1 = that.steps.slice(0, +that.selectedStep2 - 1);
		that.step2 = that.steps.slice(+that.selectedStep1);
		that.trendLineCharts();
	}

	addFunnel(event: any) {
		event.stopPropagation();
		this.funnelCommunicationService.isEditFunnel = false;
		this.showAddFunnel = true;
	}

	//编辑漏斗
	editFunnel() {
		let that = this;
		that.funnelCommunicationService.isEditFunnel = true;
		that.showAddFunnel = true;
	}

	//删除confirm
    delConfirm(){
        let that = this;
        that.confirmationService.confirm({
            message: '该删除行为不可逆,是否继续删除漏斗 ?',
            header: '删除漏斗', 
            accept: () => {
                this.funnelService.deleteFunnel(that.funnelCommunicationService.selectedFunnelId)
                .then((data:any)=>{
                    if (data._body) {
                        if(data._body && (data._body.retCode || data._body.msgDes)) {
                            let err = that.errorHandlingService.getMsg(data);
                            that.error(err.message);
                            return;
                        }
                    }
					that.funnelCommunicationService.selectedFunnelId = null;
					that.selectFunnelId = null;
					that.getFunnelList();
                }).catch(err=>{})
            }
        });
    }

	hideAddFunnelDialog(bl: boolean) {
		this.showAddFunnel = bl;
		//添加成功后通知到父组件更新下拉
		this.getFunnelList();
	}

	showSuccessDialog(bl:boolean){
		this.showSuccess = bl;
		this.showTrendCharts = true;

	}

	hideSelectCrowdDialog(bl: boolean) {
		this.showSelectCrowd = bl;
	}

	//设置默认漏斗
	saveDefaultFunnel() {
		let that = this;
		let dId = that.selectFunnelId;
		if (!that.defFun.defaultFlag) {
			dId = 0
		}
		that.campaignFunnelConfigResourceService.setDefaultFunnel(that.defaultFunnleId, dId).then(data => {
			if (data && (data.retCode || data.msgDes)) {
				this.error(data);
				return;
			}
			for (let i = 0; i < that.allFunnel.length; i++){
				if(that.sFunnelId == that.allFunnel[i]["funnelId"]){
					that.index = i;
				}
				if(that.defaultFunnleId == that.allFunnel[i]['id']){
					that.allFunnel[i]['defaultFlag'] = 0;
				}
			}
			if (dId == 0) {//取消默认时，即时把图标去掉
				that.index = null;
			}
			that.focusList();
			that.defaultFunnleId = dId;
		}).catch(err => {
			that.error('系统繁忙，请稍后再试！');
		});
	}
	
	//下载漏斗详情列表
	download() {
		let that = this;
		let funnelName: string = '';
		for (let i = 0; i < that.allFunnel.length; i++) {
			if(that.selectFunnelId == that.allFunnel[i].id) {
				funnelName = that.allFunnel[i].funnelName;
			}
		}
		let url = that.campaignFunnelConfigResourceService.baseUrl + '/' + that.campaignFunnelConfigResourceService.getRouter + '/funnel/' + (that.sFunnelId || -1) + '/detail/download';
		let param = `?campaignName=${that.campaignName}_${funnelName}&crowdIds=` + (that.crowdIdList || '');
		window.location.href = url + param;
	}

	//漏斗图配置
	chartData = {
		color: ['#5ba0ff'],
		label: {
			normal: {
				show: false,
				position: 'top',
				textStyle: {
					color: '#000'
				},
				formatter: function (params: any) {
					var text = params.data[2] + '%';
					return text;
				}
			},
			emphasis: {
				show: false,
				position: 'top',
				textStyle: {
					color: '#000'
				},
				formatter: function (params: any) {
					var text = params.data[2] + '%';
					return text;
				}
			}
		},
		tooltip: {
			trigger: 'axis',
			backgroundColor: '#fff',
			padding: [16, 20],
			extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);',
			textStyle: {
				color: '#464c5b'
			},
			//提示框配置
			formatter: function (params: any) {
				let formatNumber = function (number: string) {
					number = number + '';
					if (!/^[0-9]*$/.test(number)) {
						return number;
					}
					let length = Math.floor(number.length / 3);
					let tempNumber = number.split('');
					for (let i = 0; i < length; i++) {
						tempNumber.splice(-(((i + 1) * 3) + i), 0, ',');
					}
					if (tempNumber[0] == ',') {
						tempNumber.shift();
					}
					return tempNumber.join('');
				}
				let res: string = '';
				let users: string = '<div style="display: inline-block;"><p style="border-bottom: 1px solid #dfe7f2;padding-bottom: 10px;margin-bottom: 16px;"><span style="margin-left: 14px;">用户数</span></p>';
				let steps: string = '<div style="display: inline-block;"><p style="border-bottom: 1px solid #dfe7f2;padding-bottom: 10px;margin-bottom: 16px;"><span>步骤间转化率</span></p>';
				let rate: string = '<div style="display: inline-block;"><p style="border-bottom: 1px solid #dfe7f2;padding: 0 10px 10px 10px;margin-bottom: 16px;"><span>该步转化率</span></p>';
				for (let i = 0; i < params.length; i++) {
					users += `<p><span style="color:${params[i].color};padding-right: 5px;">●</span><span>` + formatNumber(params[i].data[1]) + `</span></p>`;
					steps += `<p><span>${params[i].dataIndex == 0 ? '--' :(params[i].data[2] || 0).toFixed(2) + '%'}</span></p>`;
					rate += `<p style="padding: 0 10px;"><span>${params[i].data[3]}%</span></p>`;
				}
				users += '</div>';
				steps += '</div>';
				rate += '</div>';
				res += users + rate + steps;
				return res;
			},
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend:{
			right: 22,
			top: 12,
			data:''
		},
		grid: {
			top: '45',
			left: '150',
			right: '40',
			bottom: '30',
			// containLabel: true
			containLabel: false
		},
		xAxis: [{
			type: 'value',
			splitLine: {
				show: true,
				lineStyle: {
					type: 'solid',
					width: 1,
					color: '#f2f7ff'
				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#dfe7f2',
					width: 1
				}
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				textStyle: {
					color: '#657180',
				}
			}
		}],
		yAxis: [{
			type: 'category',
			data: this.yFunnelData,
			splitLine: {
				show: true,
				lineStyle: {
					type: 'solid',
					width: 1,
					color: '#f2f7ff'
				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#dfe7f2',
					width: 1
				}
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				margin:135,
				textStyle: {
					color: '#657180',
					align:'left'
				},
				//formater y轴数据，一行最多显示十个
				formatter: function(params: any) {
					var newParamsName = "";// 最终拼接成的字符串
					var paramsNameNumber = params.length - 2;// 实际标签的个数(减的2是遍历数据的时候，新加的  步骤数+“.”+名称)
					var provideNumber = 10;// 每行能显示的字的个数
					var rowNumber = Math.ceil(paramsNameNumber / provideNumber);// 换行的话，需要显示几行，向上取整
					/**
					 * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
					 */
					// 条件等同于rowNumber>1
					if (paramsNameNumber > provideNumber) {
						/** 循环每一行,p表示行 */
						for (var p = 0; p < rowNumber; p++) {
							var tempStr = "";// 表示每一次截取的字符串
							var start = p * provideNumber;// 开始截取的位置
							var end = start + 2 + provideNumber;// 结束截取的位置
							if(p == 0){//处理第一行数据 截取步骤数+“.”以后的数据
								tempStr = params.substring(start, end) + "\n";
							} else if (p == rowNumber - 1) {// 此处特殊处理最后一行的索引值
								// 最后一次不换行
								// tempStr = params.substring(start, paramsNameNumber);
								tempStr = params.substring(start + 2, params.length);
							} else {
								tempStr = params.substring(start + 2, end) + "\n";
							}
							newParamsName += tempStr;// 最终拼成的字符串
						}
				
					} else {
						newParamsName = params;
					}
					return newParamsName
				},
			}
		}],
		series:''
		// series: [{
		// 	name: '人群1',
		// 	type: 'bar',
		// 	barWidth: '16',
		// 	label: {
		// 		normal: {
		// 			show: true,
		// 			position: 'right',
		// 			offset: [-20, 20],
		// 			textStyle: {
		// 				color: '#000'
		// 			}
		// 		}
		// 	},
		// 	data: [123123,1111,11231,111,3333]
		// }]
	};

	//折线图配置
	lineChartData = {
		color: ['#5ba0ff'],
		//图例
		legend: {
			right: 170,
			top: 12,
			data: this.legends
		},
		//数据提示框配置  
		tooltip: {
			trigger: 'axis',
			backgroundColor: '#fff',
			padding: [16, 20],
			extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);',
			textStyle: {
				color: '#464c5b'
			},
			//提示框配置
			formatter: function (params: any) {
				var res = '<div style="border-bottom:1px solid #dfe7f2;padding-bottom:12px;">时间<span style="margin-left:70px;">' + params[0].name + '</span></div>'
				for (var i = 0; i < params.length; i++) {
					res += '<p style="margin-top:12px;"><span style="color:'+params[i].color+';margin-right:8px;">●</span>' + params[i].seriesName + '<span style="color:#5ba0ff;margin-left:90px;">' + params[i].value + '%' + '</span></p>'
				}
				return res;
			},
		},
		grid: {
			top: '46',
			left: '25',
			right: '22',
			bottom: '3',
			containLabel: true
		},
		//x轴配置  
		xAxis: [{
			type: 'category',
			data: this.xData,
			name: "",
			boundaryGap: false,//x坐标轴是否留白
			splitLine: {
				show: true,
				lineStyle: {
					type: 'solid',
					width: 1,
					color: '#f2f7ff'
				}
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: '#dfe7f2',
					width: 1
				}
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				textStyle: {
					color: '#657180',

				}
			}
		}],
		//Y轴配置  
		yAxis: [{
			type: 'value',
			axisLine: {
				show: false
			},
			splitLine: {
				show: true,
				lineStyle: {
					type: 'solid',
					width: 1,
					color: '#f2f7ff'
				}
			},

			axisTick: {
				show: false
			},
			axisLabel: {
				textStyle: {
					color: '#657180',
				},
				formatter: '{value} %'
			}
		}],
		//图表Series数据序列配置  
		series: this.lineSeries

	};

	//趋势图配置
	barChartData = {
		color: ['#5ba0ff'],
		legend: {
			right: 170,
			top: 12
		},
		tooltip: {
			trigger: 'axis',
			backgroundColor: '#fff',
			padding: [16, 20],
			extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);',
			textStyle: {
				color: '#464c5b'
			},
			//提示框配置
			formatter: function (params: any) {
				var res = '<div style="border-bottom:1px solid #dfe7f2;padding-bottom:12px;">时间<span style="margin-left:70px;">' + params[0].name + '</span></div>'
				for (var i = 0; i < params.length; i++) {
					res += '<p style="margin-top:12px;"><span style="color:'+params[i].color+';margin-right:8px;">●</span>' + params[i].seriesName + '<span style="color:#5ba0ff;margin-left:90px;">' + params[i].value + '</span></p>'
				}
				return res;
			}
		},
		grid: {
			top: '46',
			left: '20',
			right: '20',
			bottom: '3',
			containLabel: true
		},
		xAxis: [{
			type: 'category',
			data:  ['20170529', '20170530', '20170531', '20170601', '20170602', '20170603', '20170604'],
			name: '',
			boundaryGap: false,//x坐标轴是否留白
			splitLine: {
				show: true,
				lineStyle: {
					type: 'solid',
					width: 1,
					color: '#f2f7ff'
				}
			},
			//boundaryGap:true,//x坐标轴是否留白
			axisLine: {
				show: true,
				lineStyle: {
					color: '#dfe7f2',
					width: 1
				}
			},
			axisTick: {
				show: false
			},
			axisLabel: {
				textStyle: {
					color: '#657180',

				}
			}
		}],
		yAxis: [{
			type: 'value',
			axisLine: {
				show: false
			},
			splitLine: {
				show: true,
				lineStyle: {
					type: 'solid',
					width: 1,
					color: '#f2f7ff'
				}
			},

			axisTick: {
				show: false
			},
			axisLabel: {
				textStyle: {
					color: '#657180',

				}
			}
		}],
		series: ''
	};
	// [{
	// 		name: '流失数量1',
	// 		type: 'line',
	// 		stack: 'one',
	// 		barWidth: '28',
	// 		data: [10, 52, 200, 334, 390, 330, 220]
	// 		// data: this.bar1Data//[10, 52, 200, 334, 390, 330, 220]
	// 	},
	// 	{
	// 		name: '流失数量2',
	// 		type: 'line',
	// 		stack: 'one',
	// 		barWidth: '28',
	// 		data: [10, 52, 200, 334, 390, 330, 220]
	// 	}
	// 	]
	getDay(type: number) {
		if(type != 2) {
			if (this.granularity == "day") {
				return;
			}
			this.isDay = true;
			this.isWeek = false;
			this.isMonth = false;
			this.granularity = "day";
			this.trendLineCharts();
		} else {
			if (this.granularity2 == "day") {
				return;
			}
			this.isDay2 = true;
			this.isWeek2 = false;
			this.isMonth2 = false;
			this.granularity2 = "day";
			this.lastEventTrendCharts();
		}
	}
	getWeek(type: number) {
		if (type != 2) {
			if (this.granularity == "week") {
				return;
			}
			this.isDay = false;
			this.isWeek = true;
			this.isMonth = false;
			this.granularity = "week";
			this.trendLineCharts();
		} else {
			if (this.granularity2 == "week") {
				return;
			}
			this.isDay2 = false;
			this.isWeek2 = true;
			this.isMonth2 = false;
			this.granularity2 = "week";
			this.lastEventTrendCharts();
		}
	}
	getMonth(type: number) {
		if (type != 2) {
			if (this.granularity == "month") {
				return;
			}
			this.isDay = false;
			this.isWeek = false;
			this.isMonth = true;
			this.granularity = "month";
			this.trendLineCharts();
		} else {
			if (this.granularity2 == "month") {
				return;
			}
			this.isDay2 = false;
			this.isWeek2 = false;
			this.isMonth2 = true;
			this.granularity2 = "month";
			this.lastEventTrendCharts();
		}
	}

	//错误处理
	error(info: any) {
		this.campaignDetailExceptionalCommunication.exceptionalMission(info);
	}
}