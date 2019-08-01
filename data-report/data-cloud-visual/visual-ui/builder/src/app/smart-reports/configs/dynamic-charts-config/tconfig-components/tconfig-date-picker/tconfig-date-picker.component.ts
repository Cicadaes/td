import { ConfigChartBase } from './../../config-base.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'tconfig-date-picker',
	templateUrl: 'tconfig-date-picker.component.html',
	// styleUrls: ['tconfig-date-picker.component.css']
	styles:[`
	:host /deep/ .tconfig-date-picker .datePicker #pinput-box .pinput {
		right:0!important;
		left:auto;
		width:36.1em;
		top: auto;
		bottom: 0;
		position: fixed;
	}
	:host /deep/ .datePicker{
		position: static!important;
	}

	`]
})



export class TconfigDatePickerComponent implements OnInit {
	@Input() tconfig: ConfigChartBase
	@Output() onRender = new EventEmitter<any>()
	timePicker: any;
	constructor() {
		this.timePicker = {
			showIcon: true,
			placeholder: '选择时间',
			ranges: [
				{ label: '今天', day: 1 },
				{ label: '最近七天', day: 7 },
				{ label: '最近一个月', day: 30 }
			],
			data: { start: new Date, end: new Date }
		}
	}
	ngOnInit() {
		this.timePicker.data = this.tconfig.value
	}

	onSelect(e: any) {
		this.tconfig.value = { start: e.start, end: e.end };
		this.onRender.emit(e)
	}
}