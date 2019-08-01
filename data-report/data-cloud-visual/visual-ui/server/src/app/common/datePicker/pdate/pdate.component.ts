import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'pdate',
	templateUrl: 'pdate.component.html',
	styleUrls: ['pdate.component.css']
})

export class PdateComponent implements OnInit {
	@Input() config: any;
	@Input() ranges: any;
	private minDate: Date;
	private maxDate: Date;
	private datePickerCn: any

	constructor() { }


	ngOnInit() {
		if (this.config.dateRanges) {
			this.maxDate = this.config.dateRanges.max;
			this.minDate = this.config.dateRanges.min;
		} else {
			this.maxDate = new Date;
			this.minDate = null;
		}
		this.datePickerCn = {
			firstDayOfWeek: 0,
			dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
			dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
			dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
			monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
		}
	}



}