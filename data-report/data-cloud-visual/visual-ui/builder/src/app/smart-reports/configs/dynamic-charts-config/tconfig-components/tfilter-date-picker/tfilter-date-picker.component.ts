import { StageService } from './../../../../services/stage.service';
import { ConfigChartBase } from './../../config-base.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'tfilter-date-picker',
	templateUrl: 'tfilter-date-picker.component.html',
	// styleUrls: ['tfilter-date-picker.component.css']
	styles:[`
	.tfilter-date-picker .tfilter-date-box {
    float:left;
    margin-right:20px
}
.tfilter-date-picker .tfilter-date-con {
    margin-top:10px

}
.tfilter-date-picker .tfilter-date-sel {
    color:#ccc
}

:host /deep/ .tfilter-date-picker .tfilter-date-con .tconfig-date-picker .tkey {
    display: none
}


	`]
})

export class TfilterDatePickerComponent implements OnInit {
	@Input() tconfig: ConfigChartBase
	@Output() onRender = new EventEmitter<any>()

	showField: number = 0
	curField: number = 0
	ngOnInit() {
		this.todoSwitch()
	}

	todoSwitch() {
		this.tconfig.value.start = new Date(this.tconfig.value.start)
		this.tconfig.value.end = new Date(this.tconfig.value.end)
		this.showField = this.tconfig.value.status
	}

	onSelect(e: any) {
		let s = parseInt(e)
		if (s == this.curField) {
			return
		}

		this.tconfig.value && (this.tconfig.value.status = s)
		!s && (this.tconfig.value = { start: new Date, end: new Date, status: s }, this.onRender.emit(this.tconfig))
		this.curField = s;
	}
	onRenderFa(e: any) {
		this.tconfig.value.status = this.showField;
		e.tconfig = this.tconfig;
		this.onRender.emit(e)
	}
}