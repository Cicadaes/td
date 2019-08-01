import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'pinput',
	templateUrl: 'pinput.component.html',
	styles: [`
		.pinput-sel {
			line-height:30px
		}
		.pinput-sel .ui-inputtext {
			float: left;
			border:none !important;
			padding-left:0
		}
		.pinput-sel .input-range {
			float:right;
		}

		.pinput-sel .input-range li {
			float: left
		}

		.pinput-sel .input-range li a {
			cursor: pointer;
			color:#373a3c
		}

		.pinput-sel .input-range li:not(:last-child) {
			margin-right:10px
		}
		.pcl {
			zoom:1
		}
		.pcl:after {
		content: ".";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
		}

		.input-button {
			margin: 10px 0 0;
			text-align: right
		}

		.input-button .dbtn:not(:last-child) {
			margin-right:15px
		}

		.dbtn {
			display: inline-block;
			padding:6px 20px;
			color:#fff;
			cursor:pointer
		}

		.dbtn.dbtn-blue {
			background:#5697f1
		}
		.dbtn.dbtn-blue:hover {
			background:#427ed6
		}

		.dbtn.dbtn-gray {
			background:#eee;
			color:#333
		}
		.dbtn.dbtn-gray:hover {
			background:#f6f6f6
		}
	`]
})

export class PinputComponent implements OnInit {
	@Input() config: any;
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
			this.time.start = new Date(this.config.data.start);
			this.time.end = new Date(this.config.data.end) || null;
		}
	}

	static getDay(day: number): Date {
		let tday = Math.floor(new Date().getTime() / (24 * 60 * 60 * 1000));
		return new Date((tday + day) * (24 * 60 * 60 * 1000))
	}

	private selDay(day: number) {
		switch (day) {
			case 1: this.time.start = this.time.end = PinputComponent.getDay(0); break;
			case 7: this.time.start = PinputComponent.getDay(-6); this.time.end = new Date(); break;
			case 30: this.time.start = PinputComponent.getDay(-29); this.time.end = new Date(); break;
			case 90: this.time.start = PinputComponent.getDay(-89); this.time.end = new Date(); break;
		}
	}

	public static diffTime(t: any): boolean {
		let start = t.start && t.start.getTime(), end = t.end && t.end.getTime();
		// if (end === start) {
		// 	t.end = null
		// }
		if (!end) {
			return true
		}
		if (start > end) {
			return false
		}
		return true

	}

	private confirm(e: any) {
		if (!PinputComponent.diffTime(this.time)) {
			this.msgs = [];
			return this.msgs.push({ severity: 'warn', summary: '日期选择提示：', detail: '请选择正确的范围参数！' });
		}
		this.time.event = e;
		this.onConfirm.emit(this.time)

	}

	private close(e: any) {
		this.onClose.emit(e)

	}


}