import { Component, Input, Output, EventEmitter } from '@angular/core';
import { 
    SelectItem,
    Message
} from 'primeng/primeng';
import { AnalysisResourceService } from "../../../../services/campaign/analysis.resource.service";
import { CampaignResourceService } from "../../../../services/campaign/campaign.resource.service";
import { EffectIndexDefinitionResourceService } from "../../../../services/admin/effect_index_definition.resource.service";
import { CampaignDetailExceptionalCommunication } from "../../../../services/exceptional/campaign-detail-exceptional.service";

import * as moment from 'moment';

// let bdcharts = require('echarts');
let bdcharts = require('echarts/lib/echarts');
// 引入折线图
require('echarts/lib/chart/line');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入饼状图
require('echarts/lib/chart/pie');
@Component({
    selector: 'effect',
    templateUrl: 'effect.component.html',
    styleUrls: ['effect.component.css'],
    providers: [AnalysisResourceService, EffectIndexDefinitionResourceService]
})

export class EffectComponent {

    @Input()
    set campaignId(id: number) {
        let that = this;
        if (id) {
            that.cId = id;
            that.campaignResourceService.get(id).then(data => {
                if (data && (data.retCode || data.msgDes)) {
                    that.isError(data);
                    return;
                }
                // that.marketingValue.dateRanges.max = new Date(data.endTime);
                that.marketingValue.dateRanges.min = new Date(data.startTime);
                that.marketingValue.data.start = new Date(data.startTime);
                that.marketingValue.data.end = new Date(data.endTime);
                return that.effectIndexDefinitionResourceService.queryQwnDefinitions()
            }).then((data: any) => {
                if (data && (data.retCode || data.msgDes)) {
                    that.isError(data);
                    return;
                }
                that.overviewDefaultList = [];
                that.lineList = [];
                that.barList = [];
                that.pieList = [];
                that.formatOwnDefinitions(data['1001'], that.overviewDefaultList);
                that.formatOwnDefinitions(data['1002'], that.lineList);
                that.formatOwnDefinitions(data['1003'], that.barList);
                that.formatOwnDefinitions(data['1004'], that.pieList);
                // that.selectOverview1 = that.overviewDefaultList[0] && that.overviewDefaultList[0].value;
                // that.selectOverview2 = that.overviewDefaultList[1] && that.overviewDefaultList[1].value;
                // that.selectOverview3 = that.overviewDefaultList[2] && that.overviewDefaultList[2].value;
                // that.selectOverview4 = that.overviewDefaultList[3] && that.overviewDefaultList[3].value;
                that.overviewList1 = that.overviewDefaultList.slice(4);
                that.overviewList2 = that.overviewDefaultList.slice(4);
                that.overviewList3 = that.overviewDefaultList.slice(4);
                that.overviewList4 = that.overviewDefaultList.slice(4);
                if(that.lineList.length > 0) that.selectLine = that.lineList[0].value;
                if(that.barList.length > 0) that.selectbar = that.barList[0].value;
                if(that.pieList.length > 0) that.selectpie = that.pieList[0].value;
                that.selectTop = '2';
                that.getFirstData();
            });
        } 
    }

    cId: number; //活动Id
    //这里写死 然后有个配置页面 不懂为啥要这么做
    overviewDefaultList: any[] = [];        //概览值原始选择列表
    lineList: any[] = [];             //趋势折线图选择列表
    barList: any[] = [];              //对比柱状图对比维度
    pieList: any[] = [];            //饼图选择列表
    topList: SelectItem[] = [               //对比柱状图对比Top
        {label: 'Top 2', value: 2},
        {label: 'Top 3', value: 3},
        {label: 'Top 4', value: 4},
        {label: 'Top 5', value: 5}
    ];  //对比柱状图 top选择列表
    overviewList1: any[] = [];      //第一个概览值选择列表
    overviewList2: any[] = [];      //第二个概览值选择列表
    overviewList3: any[] = [];      //第三个概览值选择列表
    overviewList4: any[] = [];      //第四个概览值选择列表
    selectOverview1: any;           //第一个概览值选择列表 选中的数据
    selectOverview2: any;           //第二个概览值选择列表 选中的数据
    selectOverview3: any;           //第三个概览值选择列表 选中的数据
    selectOverview4: any;           //第四个概览值选择列表 选中的数据
    selectLine: any;                //趋势折线图选择列表 选中的数据
    selectbar: any;                 //对比柱状图选择列表 选中的数据
    selectTop: any;                 //top选择列表 选中的数据
    selectpie: any;                 //饼图选择列表 选中的数据
    selectOverviewData1: any;    //第一个概览值
    selectOverviewData2: any;    //第二个概览值
    selectOverviewData3: any;    //第三个概览值
    selectOverviewData4: any;    //第四个概览值

    numberList:any[] = []; //选择指标列表数据
    selectTarget:any;      //绑定
    //效果分析折线图
    lineChart:any;
    //效果分析柱状图
    barChart:any;
    //效果分析饼状图
    pieData:any;
    marketingValue: any = {
        showIcon: true,
        ranges: [{
            label:'今天',day:1
        },
        {
            label:'最近七天',day:7
        },
        {
            label:'最近一个月',day:30
        },
        {
            label:'季度',day:90
        }],
        dateRanges:{max:null, min:new Date(Date.now())},
        data:{start:new Date(Date.now())}
    };

    //图表默认颜色
    color: any = ['#558be7', '#5db8ac', '#ed6f6a', '#eea75b', '#da76d1', '#9064d7', '#493bf5', '#5bb0f3', '#94be48', '#cb3329'];

    //效果分析折线图
    lineChartData ={
        color: this.color,
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
			// formatter: function (params: any) {
			// 	var res = '<div style="border-bottom:1px solid #dfe7f2;padding-bottom:12px;">时间<span style="margin-left:70px;">' + params[0].name + '</span></div>'
			// 	for (var i = 0; i < params.length; i++) {
			// 		res += '<p style="margin-top:12px;"><span style="color:'+params[i].color+';margin-right:8px;">●</span>' + params[i].seriesName + '<span style="color:#5ba0ff;margin-left:90px;">' + params[i].value + '%' + '</span></p>'
			// 	}
			// 	return res;
			// },
		},
        legend: {
            right: 170,
			top: 12
        },
        
        grid: {
			top: '46',
			left: '25',
			right: '50',
			bottom: '3',
			containLabel: true
		},
        xAxis : [
            {
                type : 'category',
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
            }
        ],
        yAxis : [
            {
                type : 'value',
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
            }
        ],
        series : [
            {
                name:'',
                type:'line',
                smooth:true,
                stack: ''
            },
            
        ]
    };
    //柱状图配置
	barChartData = {
		color: this.color,
		// legend: {
		// 	data: [],
		// 	right: 170,
		// 	top: 12
		// },
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		grid: {
			top: '46',
			left: '20',
			right: '20',
			bottom: '40',
			containLabel: true
		},
        dataZoom: [{
            type: 'slider',
            show: true,
            xAxisIndex: 0
        }],
		xAxis: [{
			type: 'category',
			name: '',
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
		}]
	};
    //饼状图配置
    pieChartData = {
        color: this.color,
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        // legend: {
        //     orient: 'vertical',
        //     x: 'left',
        //     data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        // },
        series: [
            {
                name:'',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                }
            }
        ]
    };

    msgs: Message[] = []; //报错提示

    constructor(
        private analysisResourceService: AnalysisResourceService,
        private campaignResourceService: CampaignResourceService,
        private effectIndexDefinitionResourceService: EffectIndexDefinitionResourceService,
        private campaignDetailExceptionalCommunication: CampaignDetailExceptionalCommunication
    ){}

    //格式化数据 将数据变成primng下拉框可以使用的格式
    formatOwnDefinitions(data: any, list: any) {
        let length = data ? data.length : 0;
        for (let i = 0; i < length; i++) {
            let json = {
                label: data[i].name,
                value: {code: data[i].indexId, name: data[i].name}
            };
            list.push(json);
        }
    }

    //获取页面第一次需要的数据
    getFirstData() {
        let that = this;
        let beginTime = moment(that.marketingValue.data.start).format('YYYY-MM-DD');
        let endTime = moment(that.marketingValue.data.end).format('YYYY-MM-DD');
        let json = {
            campaignId: that.cId,
            begin: beginTime,
            end: endTime
        };
        if (that.overviewDefaultList[0] && that.overviewDefaultList[0].value) {
            for (let i = 0; i < 4; i++) {
                that[`selectOverview${i + 1}`] = that.overviewDefaultList[i] && that.overviewDefaultList[i].value;
                if( that[`selectOverview${i + 1}`]) {
                    that.analysisResourceService.getActualValue(that.overviewDefaultList[i].value.code, json)
                    .then(data => {
                        if (data && (data.retCode || data.msgDes)) {
                            that.isError(data);
                            return;
                        }
                        that[`selectOverviewData${i + 1}`] = data;
                    });
                }
            }
        }
        if (that.lineList[0] && that.lineList[0].value && that.lineList[0].value.code) {
            that.getTrendData(that.lineList[0].value.code, json);
        }
        if (that.barList[0] && that.barList[0].value && that.barList[0].value.code) {
            that.analysisResourceService.getCount(that.barList[0].value.code, that.cId)
            .then(data => {
                if (data && (data.retCode || data.msgDes)) {
                    that.isError(data);
                    return;
                }
                that.topList = [];
                for (let i = 2; i <= data; i++) {
                    let json = {label: `Top ${i}`, value: i};
                    that.topList.push(json);
                }
                let comparingData = {
                    campaignId: that.cId,
                    begin: beginTime,
                    end: endTime,
                    topN: 2
                }
                return that.analysisResourceService.getComparingTrend(that.barList[0].value.code, comparingData)
                .then((data: any) => {
                    if (data && (data.retCode || data.msgDes)) {
                        that.isError(data);
                        return;
                    }
                    let seriesList: any[] = [];
                    let tempAxis = [];
                    for (let i in data) {
                        for (let j = 0; j < data[i].length; j++) {
                            if (!seriesList[j]) {
                                seriesList[j] = {
                                    name: data[i][j].name,
                                    type: 'bar',
                                    data: [data[i][j].value]
                                };
                            } else {
                                seriesList[j].data.push(data[i][j].value);
                            }
                        }
                        tempAxis.push(i);
                    }
                    that.barChartData.xAxis[0]['data'] = tempAxis;
                    that.barChartData['series'] = seriesList;
                    that.barChart.clear();
                    that.barChart.setOption(that.barChartData);
                }).catch(err => {});
            }).catch(err => {});
        }
        if (that.pieList[0] && that.pieList[0].value && that.pieList[0].value.code) {
            that.pieChartData.series[0].name = that.pieList[0].value.name;
            that.getPieData(that.pieList[0].value.code, json);
        }
    }

    ngAfterViewInit() {
		this.lineChart = bdcharts.init(document.getElementById('effectLine'));
        // this.lineChart.setOption(this.lineChartData);
        // this.lineChart.resize();

		this.barChart = bdcharts.init(document.getElementById('effectBar'));
        // this.barChart.setOption(this.barChartData);
        // this.barChart.resize();

        this.pieData = bdcharts.init(document.getElementById('effectPie'));
        // this.pieData.setOption(this.pieChartData);
        // this.pieData.resize();

        let that = this;
        setTimeout(function () {
            that.lineChart.resize();
            that.barChart.resize();
            that.pieData.resize();
        }, 0);
	}

    //获取4个方框数据
    selectOtherOverview(event: any, index: number) {
        let that = this;
        let length = that.overviewDefaultList.length;
        let beginTime = moment(that.marketingValue.data.start).format('YYYY-MM-DD');
        let endTime = moment(that.marketingValue.data.end).format('YYYY-MM-DD');
        let json = {
            campaignId: that.cId,
            begin: beginTime,
            end: endTime
        }
        that.analysisResourceService.getActualValue(event.value.code, json)
        .then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.isError(data);
                return;
            }
            if(process.env.ENV === 'developer') {
                if (index === 1) {
                    that.selectOverviewData1 = (Math.random() * Math.random() * 10000).toFixed(0);
                } else if (index === 2) {
                    that.selectOverviewData2 = (Math.random() * Math.random() * 10000).toFixed(0);
                } else if (index === 3) {
                    that.selectOverviewData3 = (Math.random() * Math.random() * 10000).toFixed(0);
                } else {
                    that.selectOverviewData4 = (Math.random() * Math.random() * 10000).toFixed(0);
                }
            } else {
                if (index === 1) {
                    that.selectOverviewData1 = data;
                } else if (index === 2) {
                    that.selectOverviewData2 = data;
                } else if (index === 3) {
                    that.selectOverviewData3 = data;
                } else {
                    that.selectOverviewData4 = data;
                }
            }
        }).catch(err => {});
        that.overviewList1 = [];
        that.overviewList2 = [];
        that.overviewList3 = [];
        that.overviewList4 = [];
        for(let i = 0; i < length; i++) {
            if(that.selectOverview1 === that.overviewDefaultList[i].value || that.selectOverview2 === that.overviewDefaultList[i].value 
            || that.selectOverview3 === that.overviewDefaultList[i].value || that.selectOverview4 === that.overviewDefaultList[i].value) {
                continue;
            }
            if (that.overviewList1.indexOf(that.overviewDefaultList[i]) === -1) {
                that.overviewList1.push(that.overviewDefaultList[i]);
                that.overviewList2.push(that.overviewDefaultList[i]);
                that.overviewList3.push(that.overviewDefaultList[i]);
                that.overviewList4.push(that.overviewDefaultList[i]);
            }
        }
    }

    //获取折线趋势图数据
    getTrendData(code: number, data: any) {
        let that = this;
        that.analysisResourceService.getLineData(code, data)
        .then((data: any) => {
            if (data && (data.retCode || data.msgDes)) {
                that.isError(data);
                return;
            }
            let axis = [];  //存放从后端获取到的时间数据
            let seriesData = [];  //存放从后端获取到的数量数据
            if (data) {
                for (let i in data) {
                    axis.push(i);
                    seriesData.push(data[i]);
                }
            }
            let tempAxis = [];   //存放补全后的数据
            let tempSeriesdata = [];  //存放补全后的数据
            for (let i = 0; i < axis.length; i++) {
                tempAxis.push(axis[i]);
                tempSeriesdata.push(seriesData[i]);
                let fistTime = moment(axis[i]);
                let nextTime = moment(axis[i + 1]);
                if(axis[i + 1] && nextTime.diff(fistTime, 'days') > 1) {
                    let days = nextTime.diff(fistTime, 'days') - 1;  
                    for (let j = 0; j < days; j++) {
                        let tempTime = fistTime.add(1, 'days').format('YYYY-MM-DD');
                        tempAxis.push(tempTime);
                        tempSeriesdata.push(0);
                    }
                } 
            }
            that.lineChartData.xAxis[0]['data'] = tempAxis;
            if (that.selectLine && that.selectLine.name) {
                 that.lineChartData.legend['data'] = [that.selectLine.name];
                 that.lineChartData.series[0].name = that.selectLine.name;
            } else {
                that.lineChartData.legend['data'] = [that.lineList[0].value.name];
                that.lineChartData.series[0].name = that.lineList[0].value.name;
            }
            that.lineChartData.series[0]['data'] = tempSeriesdata;
            that.lineChart.clear();
            that.lineChart.setOption(that.lineChartData);
        }).catch(err => {})
    }

    //获取环形图数据
    getPieData(code: number, data: any){
        let that = this;
        that.analysisResourceService.getPie(code, data)
        .then((data: any) => {
            if (data && (data.retCode || data.msgDes)) {
                that.isError(data);
                return;
            }
            let tempPieData = [];
            for (let i in data) {
                let json = {
                    value: data[i],
                    name: i
                };
                tempPieData.push(json);
            }
            for (let i = 1; i < tempPieData.length; i++) {
                for(let j = 0; j < tempPieData.length - i; j++) {
                    let temp;
                    if (tempPieData[j].value < tempPieData[j + 1].value) {
                        temp = tempPieData[j];
                        tempPieData[j] = tempPieData[j + 1];
                        tempPieData[j + 1] = temp;
                    }
                }
            }
            that.pieChartData.series[0]['data'] = tempPieData;
            that.pieData.clear();
            that.pieData.setOption(that.pieChartData);    
        }).catch(err => {}); 
    }

    //修改趋势图参数
    changeTrend(event: any) {
        let that = this;
        let beginTime = moment(that.marketingValue.data.start).format('YYYY-MM-DD');
        let endTime = moment(that.marketingValue.data.end).format('YYYY-MM-DD');
        let json = {
            campaignId: that.cId,
            begin: beginTime,
            end: endTime
        }
        that.getTrendData(event.value.code, json);
    }

    //修改对比图Top参数
    changeTop(event: any){
        let that = this;
        let beginTime = moment(that.marketingValue.data.start).format('YYYY-MM-DD');
        let endTime = moment(that.marketingValue.data.end).format('YYYY-MM-DD');
        let comparingData = {
            campaignId: that.cId,
            begin: beginTime,
            end: endTime,
            topN: event.value
        }
        if(!that.barList[0] || !that.barList[0].value){
            return;
        }
        let code = that.barList[0].value.code;
        if (that.selectbar && that.selectbar.code) {
            code = that.selectbar.code
        }
        that.analysisResourceService.getComparingTrend(code, comparingData)
        .then((data: any) => {
            if (data && (data.retCode || data.msgDes)) {
                that.isError(data);
                return;
            }
            let seriesList: any[] = [];
            let tempAxis = [];
            for (let i in data) {
                for (let j = 0; j < data[i].length; j++) {
                    if (!seriesList[j]) {
                        seriesList[j] = {
                            name: data[i][j].name,
                            type: 'bar',
                            data: [data[i][j].value]
                        };
                    } else {
                        seriesList[j].data.push(data[i][j].value);
                    }
                }
                tempAxis.push(i);
            }
            that.barChartData.xAxis[0]['data'] = tempAxis;
            that.barChartData['series'] = seriesList;
            that.barChart.clear();
            that.barChart.setOption(that.barChartData);
        }).catch(err => {});
    }

    //修改对比图渠道参数
    changeBar(event: any) {
        let that = this;
        let beginTime = moment(that.marketingValue.data.start).format('YYYY-MM-DD');
        let endTime = moment(that.marketingValue.data.end).format('YYYY-MM-DD');
        that.analysisResourceService.getCount(event.value.code, that.cId)
        .then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.isError(data);
                return;
            }
            that.topList = [];
            for (let i = 2; i <= data; i++) {
                let json = {label: `Top ${i}`, value: i};
                that.topList.push(json);
            }
            let comparingData = {
                campaignId: that.cId,
                begin: beginTime,
                end: endTime,
                topN: 2
            }
            that.selectTop = 2;
            return that.analysisResourceService.getComparingTrend(event.value.code, comparingData)
            .then((data: any) => {
                if (data && (data.retCode || data.msgDes)) {
                    that.isError(data);
                    return;
                }
                let seriesList: any[] = [];
                let tempAxis = [];
                for (let i in data) {
                    for (let j = 0; j < data[i].length; j++) {
                        if (!seriesList[j]) {
                            seriesList[j] = {
                                name: data[i][j].name,
                                type: 'bar',
                                data: [data[i][j].value]
                            };
                        } else {
                            seriesList[j].data.push(data[i][j].value);
                        }
                    }
                    tempAxis.push(i);
                }
                that.barChartData.xAxis[0]['data'] = tempAxis;
                that.barChartData['series'] = seriesList;
                that.barChart.clear();
                that.barChart.setOption(that.barChartData);
            }).catch(err => {});
        }).catch(err => {});
    }

    //修改占比图参数
    changePie(event: any) {
        let that = this;
        let beginTime = moment(that.marketingValue.data.start).format('YYYY-MM-DD');
        let endTime = moment(that.marketingValue.data.end).format('YYYY-MM-DD');
        let json = {
            campaignId: that.cId,
            begin: beginTime,
            end: endTime
        }
        that.pieChartData.series[0].name = event.value.name;
        that.getPieData(event.value.code, json);
    }

    //时间插件 选择时间后处理
    onSelect(date: any) {
        let that = this;
        let beginTime = moment(date.start).format('YYYY-MM-DD');
        let endTime = moment(date.end).format('YYYY-MM-DD');
        let json = {
            campaignId: that.cId,
            begin: beginTime,
            end: endTime
        };
        for (let i = 1; i <= 4; i++) {
            if(!that['selectOverview' + i]){
                continue;
            }
            that.analysisResourceService.getActualValue(that['selectOverview' + i].code, json)
            .then(data => {
                if (data && (data.retCode || data.msgDes)) {
                    that.isError(data);
                    return;
                }
                 that['selectOverviewData' + i] = data;
            }).catch(err => {});
        }
        if(that.selectLine){
            that.getTrendData(that.selectLine.code, json);
        }
        if(!that.selectpie){
            return ;
        }
        that.pieChartData.series[0].name = that.selectpie.name;
        that.getPieData(that.selectpie.code, json);
         that.analysisResourceService.getCount(that.selectbar.code, that.cId)
        .then(data => {
            if (data && (data.retCode || data.msgDes)) {
                that.isError(data);
                return;
            }
            that.topList = [];
            for (let i = 2; i <= data; i++) {
                let json = {label: `Top ${i}`, value: i};
                that.topList.push(json);
            }
            let comparingData = {
                campaignId: that.cId,
                begin: beginTime,
                end: endTime,
                topN: 2
            }
            return that.analysisResourceService.getComparingTrend(that.selectbar.code, comparingData)
            .then((data: any) => {
                if (data && (data.retCode || data.msgDes)) {
                    that.isError(data);
                    return;
                }
                let seriesList: any[] = [];
                let tempAxis = [];
                for (let i in data) {
                    for (let j = 0; j < data[i].length; j++) {
                        if (!seriesList[j]) {
                            seriesList[j] = {
                                name: data[i][j].name,
                                type: 'bar',
                                data: [data[i][j].value]
                            };
                        } else {
                            seriesList[j].data.push(data[i][j].value);
                        }
                    }
                    tempAxis.push(i);
                }
                that.barChartData.xAxis[0]['data'] = tempAxis;
                that.barChartData['series'] = seriesList;
                that.barChart.clear();
                that.barChart.setOption(that.barChartData);
            }).catch(err => {});
        }).catch(err => {});
    }

    //错误处理
    isError(err: any) {
        this.campaignDetailExceptionalCommunication.exceptionalMission(err);
    }
}