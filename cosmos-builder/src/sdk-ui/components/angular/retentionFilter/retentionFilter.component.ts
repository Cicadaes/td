import { Component, OnInit, OnDestroy, ViewChild ,Input,ChangeDetectorRef} from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType } from "cosmos-td-sdk";
import { RetentionFilterGraph } from './retentionFilter.graph';

@Component({
	templateUrl: './retentionFilter.component.html',
	styleUrls: ['./retentionFilter.component.less']
})
export class RetentionFilterComponent extends Communication implements OnInit, OnDestroy {

	private data: any[] = [
		{
			"date": "20180408",
			"sum_new_user": 824,
			"keep_user_1": 39.19,
			"keep_user_2": 32.4,
			"keep_user_3": 26.45,
			"keep_user_4": 24.15,
			"keep_user_5": 19.53,
			"keep_user_6": 8,
			"keep_user_7": 6.91,
			"keep_user_14": 0,
			"keep_user_30": 0
		},
		{
			"date": "20180409",
			"sum_new_user": 735,
			"keep_user_1": 33.06,
			"keep_user_2": 39.18,
			"keep_user_3": 23.26,
			"keep_user_4": 14.69,
			"keep_user_5": 12.24,
			"keep_user_6": 7.07,
			"keep_user_7": 0,
			"keep_user_14": 0,
			"keep_user_30": 0
		}
	]
	private dataObj: any = {
		data: this.data,
		style: {
			content: {
				fontSize: 12, fontFamily: "Microsoft YaHei"
			},
			heatmap: {
				show: true, color: "#349ffd"
			}
		}
	};
	private _dateRange: Array<any> = [new Date(Date.now() - 3600 * 24 * 5 * 1000),new Date()];
	private option: RetentionFilterGraph = new RetentionFilterGraph(this.dataObj);
	private visitor:string = 'create';
	private behavior:string = 'startUp';
	private visitors:any = [
		{
			label:'新增访客',
			value:'create'
		},
		{
			label:'活跃访客',
			value:'active'
		}
	]
	private behaviors:any = [
		{
			label:'启动应用',
			value:'startUp'
		},
		{
			label:'执行了事件',
			value:'events'
		}
	]
	constructor(
		private changeDetectorRef:ChangeDetectorRef
	) {
		super();
	}

	public onDataChange(scope: string, data: any) {
		// this.dataObj.data = data;
		// this.option = new RetentionGraph(this.dataObj);
	}

	public onStyleChange(scope: string, data: any) {
		this.dataObj.style = data;
		this.option = new RetentionFilterGraph(this.dataObj);
		// this.changeDetectorRef.markForCheck(); 
		// this.changeDetectorRef.detectChanges(); 
		// console.log(this.option)
	}

	public onSizeChange() {
		// if (this.cmchart && this.cmchart.echarts) {
		//     this.cmchart.echarts.resize();
		// }
	}

	public onVisualArea(scope: string) {
		EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope });
	}

	ngOnInit() {
		
	}

	ngOnDestroy() {

	}

}
