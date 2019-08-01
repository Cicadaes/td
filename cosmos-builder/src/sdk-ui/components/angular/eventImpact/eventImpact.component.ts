import { Component, OnInit, OnDestroy, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { CosmosChartComponent } from 'ng-cosmos-td-ui/src/chart/cm-chart/chart.component';
import { Communication, EventEmitter, EventType, ComponentEvent, DomEvent } from "cosmos-td-sdk";
@Component({
	templateUrl: './eventImpact.component.html',
	styleUrls: ['./eventImpact.component.less']
})
export class EventImpactComponent extends Communication implements OnInit, OnDestroy {

	constructor(
		private changeDetectorRef: ChangeDetectorRef
	) {
		super();
	}
	private alignStyle: any = {};

	public onDataChange(scope: string, data: any) {

	}


	@ViewChild('filters') filters: any;
	public onStyleChange(scope: string, data: any) {
	}

	public onSizeChange() {

	}

	public onVisualArea(scope: string) {
		EventEmitter.trigger(EventType.VISUALAREAINIT, { scope: scope });
	}

	ngOnInit() {

	}

	ngOnDestroy() {

	}
	query(event:any) {
		event.stopPropagation();
		EventEmitter.trigger('showFilter');

	}

}
