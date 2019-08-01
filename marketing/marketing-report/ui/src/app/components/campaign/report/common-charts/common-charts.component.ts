import {
	Component,
	Input
} from '@angular/core';
// var bdcharts = require('echarts');
var bdcharts = require('echarts/lib/echarts');
// 引入折线图
require('echarts/lib/chart/line');
import {
	Scope
} from '../../../../../../public/ts/scope';
@Component({
	selector: 'common-charts',
	templateUrl: 'common-charts.component.html',
	styleUrls: ['common-charts.component.css'],
	providers: []
})
export class CommonChartsComponent {
	seriesList: any;
	legendList: any;
	@Input() lists: any;
	@Input() xdata: any;
	@Input() set legend(legend: any){
		this.legendList = legend;
	}

	@Input() 
	set formatter(fn: any) {
		this.chartData.tooltip['formatter'] = fn;
	}

	@Input() 
	set color(color: any) {
		this.chartData['color'] = color;
	}
 
	//@Input() series:any;
	@Input()
	set series (series: any){
		this.seriesList = series;
	}
	get series(): any {
		return this.seriesList
	}

	myChart:any;
	scopeID:any;
	constructor(){
		
	};
	ngOnInit(){
	};

	ngOnChanges() {
		let that = this;
		if(that.scopeID){
			that.chartData.xAxis[0].data = that.xdata;
			that.chartData.series = that.seriesList;
			that.chartData.legend.data = that.legendList;
			that.myChart.setOption(that.chartData,true);
		}else{
			that.scopeID = Scope.getInstance().scopeID;
		}
	}

	ngAfterViewInit(){
		this.myChart = bdcharts.init(document.getElementById(this.scopeID));
		this.chartData.xAxis[0].data = this.xdata;
		this.chartData.series = this.seriesList;
		this.chartData.legend.data = this.legendList;
		this.myChart.setOption(this.chartData);
		let that = this;
		setTimeout(function(){
			that.myChart.resize();
		},0);
		
	};

	chartData = {
		//数据提示框配置  
		tooltip: {
			trigger: 'axis',
			backgroundColor: '#fff',
			padding: [16, 20],
			extraCssText: 'box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);',
			textStyle: {
				color: '#464c5b'
			},
		},
		legend:{
			top:5,
			right:20,
			data:''
		},
		grid: {
			top: '30',
			left: '30',
			right: '30',
			bottom: '36',
			containLabel: true
		},
		//轴配置  
		xAxis: [{
			type: 'category',
			data: '',
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
			name: "",
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
		//图表Series数据序列配置
		series: ''

	};
}

