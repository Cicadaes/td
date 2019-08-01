import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
	selector: 'pinput',
	templateUrl: 'pinput.component.html',
	styleUrls: ['pinput.component.css']
})

export class PinputComponent implements OnInit {
	@Input() 
	set config(config: any) {
		// 时间范围最大值要格式化成第二天前一秒
		let max = config.dateRanges ? config.dateRanges.max : null;
		if(max) {
			config.dateRanges.max = new Date(moment(max).startOf('days').valueOf() + 86399999);
		}
		this._config = config;		
	}
	get config() {
		return this._config;
	}
	private _config: any;

	@Output() onConfirm = new EventEmitter<any>();
	@Output() onClose = new EventEmitter<any>();

	public msgs: Array<any>;

	private time: any = { start: Date, end: Date };

	constructor() {
		this.time.start = new Date;
		this.time.end = new Date
	}
	ngOnInit() {
		if (this.config.data && this.config.data.start) {
			this.time.start = this.config.data.start;
			this.time.end = this.config.data.end || null;
		}
	}

	static getDay(day: number, start?: any): Date {
		let tday = Math.floor(new Date().getTime() / (24 * 60 * 60 * 1000));
		let date = new Date((tday + day) * (24 * 60 * 60 * 1000));
		if(start) {
			let startDay = Math.floor(new Date(start).getTime() / (24 * 60 * 60 * 1000));
			if (date < start && tday <= startDay) {
				date = new Date((Math.floor(new Date(start).getTime() / (24 * 60 * 60 * 1000)) + (-day)) * (24 * 60 * 60 * 1000));
			} else if (date < start) {
				date = start;
			}
		}
		return date
	}

	private selDay(day: number) {
		switch (day) {
			case 1: this.time.start = PinputComponent.getDay(0); this.time.end = PinputComponent.getDay(0); break;
			case 7: {
				this.time.start = PinputComponent.getDay(-7, this.config.dateRanges.min);
				this.time.end = new Date();
				if (this.time.end < this.config.dateRanges.min) {
					this.time.end = this.config.dateRanges.min;
				}
				if(this.time.start > this.time.end) {
					let temp = this.time.end;
					this.time.end = this.time.start;
					this.time.start = temp;
				}
				break;
			}
			case 30: {
				this.time.start = PinputComponent.getDay(-29, this.config.dateRanges.min);
				this.time.end = new Date();
				if (this.time.end < this.config.dateRanges.min) {
					this.time.end = this.config.dateRanges.min;
				}
				if(this.time.start > this.time.end) {
					let temp = this.time.end;
					this.time.end = this.time.start;
					this.time.start = temp;
				}
				break;
			}
			case 90: {
				this.time.start = PinputComponent.getDay(-89, this.config.dateRanges.min);
				this.time.end = new Date(); 
				if (this.time.end < this.config.dateRanges.min) {
					this.time.end = this.config.dateRanges.min;
				}
				if(this.time.start > this.time.end) {
					let temp = this.time.end;
					this.time.end = this.time.start;
					this.time.start = temp;
				}
				break;
			}
		}

		this.checkTheTimeRange();
	}

	// 检查选中时间是否在范围之内
	private checkTheTimeRange() {
		let dateRanges = this.config.dateRanges;
		let min = dateRanges.min ? dateRanges.min : -Infinity;
		let max = dateRanges.max ? dateRanges.max : Infinity;
		let start = this.time.start;
		let end = this.time.end;

		let minUnix = new Date(min).getTime();
		let maxUnix = new Date(max).getTime();
		let startUnix = new Date(start).getTime();
		let endUnix = new Date(end).getTime();

		if(startUnix < minUnix) {
			this.time.start = min;
		}
		if(startUnix > maxUnix) {
			this.time.start = max;
		}
		if(endUnix > maxUnix) {
			this.time.end = max;
		}
		if(endUnix < minUnix) {
			this.time.end = min;
		}
	}

	// 
	public static diffTime(t: any, min: any, max: any): boolean {
		let start = t.start && t.start.getTime(), end = t.end && t.end.getTime();
		end = moment(end).endOf('days').valueOf(); //选择结束日期到24点前一秒(之前只到0点)
		min = moment(min).startOf('days').valueOf();
		if (end === start) {
			t.end = null
		}
		if (!end) {
			return true
		}
		if (start > end) {
			return false
		}
		if (min && (start < min || end < min)) {
			return false;
		}
		if (max && (start > max || end > max)) {
			return false;
		}
		return true
	}

	private confirm(e: any) {
		if (!PinputComponent.diffTime(this.time, this.config.dateRanges.min, this.config.dateRanges.max)) {
			this.msgs = [];
			return this.msgs.push({ severity: 'warn', summary: '日期选择提示：', detail: '请选择正确的范围参数！' });
		}
		this.time.event = e;
		this.onConfirm.emit(this.time);
	}

	private close(e: any) {
		this.onClose.emit(e)

	}


}