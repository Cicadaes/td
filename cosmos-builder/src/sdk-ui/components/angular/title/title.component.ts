import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ViewChild, Input, ChangeDetectorRef, forwardRef, ViewEncapsulation } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType, ComponentEvent, DomEvent } from "cosmos-td-sdk";
import { TitleGraph } from './title.graph';
import { DOWN_ARROW, ENTER, TAB } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { measureScrollbar } from './mesureScrollBar';
import { ReportConfigService } from './../../../../sdk-ui/service/report-config.service';
import { ConfigApi } from '../../../api/config-api';
import { AppService } from '../../../../app/app.service';

@Component({
	encapsulation: ViewEncapsulation.None,
	templateUrl: './title.component.html',
	styleUrls: ['./title.component.less'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => TitleComponent),
			multi: true
		}
	],
})
export class TitleComponent extends Communication implements OnInit, OnDestroy {
	DownloadY: any = false;//下载
	DownloadN: any = true;//下载
	scopeIdDown: any;
	hrefs: any = '';
	downloadNumber: any = 0;
	private dataObj: any = {
		data: {},
		style: {}
	};
	private option: TitleGraph = new TitleGraph();

	constructor(
		private changeDetectorRef: ChangeDetectorRef,
		private elementRef: ElementRef,
		private reportConfigService: ReportConfigService,
		public configApi: ConfigApi,
		private appService: AppService
	) {
		super();
		// "http://172.23.6.236/aeplus/#/download";
		this.hrefs = "http://" + `${appService.globalUrlIp}` + "/aeplus/#/download-data";
	}

	public onDataChange(scope: string, data: any) {
		if (data == "下载成功") {
			this.DownloadY = true;
			this.DownloadN = false;
		} else {
			this.DownloadY = false;
			this.DownloadN = true;
		};
	}

	helpTitle: any;

	public onStyleChange(scope: string, data: any) {
		if (data.gridHelp) {
			if (data.gridHelp['title']) {
				this.helpTitle = data.gridHelp['title'];
			}
			// else{
			// 	this.helpTitle = '帮助';
			// }
		}
		this.scopeIdDown = scope;
		this.dataObj.style = data;
		this.downloadNumber = data["gridDownload"]["number"] ? data["gridDownload"]["number"] : 0;
		this.option = new TitleGraph(this.dataObj);
		// this.changeDetectorRef.markForCheck();
		// this.changeDetectorRef.detectChanges();

	}

	public onSizeChange() {
		// if (this.cmchart && this.cmchart.echarts) {
		//     this.cmchart.echarts.resize();
		// }
	}

	public onVisualArea(scope: string, data?: any) {
		EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope, componentFilter: data });
	}

	/**
	 * 帮助
	 */
	@ViewChild('title') title: any;
	/**
	* 下载
	* @param 
	*/
	private download() {
		this.DownloadY = false;
		this.DownloadN = false;
		DomEvent.fireEvent(this.title.nativeElement, ComponentEvent.COMFILTERCHANGE,
			{
				data: {
					"scopeIdDown": this.scopeIdDown,
					"down": "Yes"
				},
				bubble: true,
				download: true
			});
		setTimeout(() => {
			DomEvent.fireEvent(this.title.nativeElement, ComponentEvent.COMFILTERCHANGE,
				{
					data: {
						"scopeIdDown": this.scopeIdDown,
						"down": "No"
					},
					bubble: false,
					download: true
				});
		}, 10);
	}

	private close() {
		this.option = new TitleGraph(this.dataObj);
		// this.changeDetectorRef.markForCheck();
		// this.changeDetectorRef.detectChanges();
	}

	private jump() {
		const obj = {
			eventType: 'router',
			eventInfo: {
				data: this.hrefs
			}
		};
		console.log(JSON.stringify(obj))
		window.parent.postMessage(JSON.stringify(obj), '*');
	}
	ngOnInit() {

	}

	ngOnDestroy() {

	}
}
