import { Component, OnInit, OnChanges, SimpleChange, Input, Output, ElementRef, Renderer, ViewChild, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
//--api--
// value:{
// 	showIcon:true,
//  placeholder:'',
// 	ranges:[
// 		{label:'今天',day:1},
// 		{label:'最近七天',day:7},
// 		{label:'最近一个月',day:30}
// 		{label:'季度',day:90}
// 	]
//  dateRanges:{max:null, min:null}
//  data:null
// }
// disabled: true //是否禁止选择
//demo
//<datePicker [value]="value" [disabled]="disabled" (onSelect)="onSelect($event)"></datePicker>
@Component({
	selector: 'datePicker',
	templateUrl: 'datePicker.component.html',
	styleUrls: ['datePicker.component.css']
})

export class DatePickerComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() value: any;
	@Input() disabled: boolean;
	@Output() onSelect = new EventEmitter<any>();
	@Output() onClick = new EventEmitter<any>();

	@ViewChild('container') containerViewChild: ElementRef;

	public container: HTMLDivElement;
	public documentClickListener: any;
	public selfClick: boolean = false;

	private show: boolean;
	// private time: any = { start: Date, end: Date };

	constructor(public el: ElementRef, public renderer: Renderer) {
		// this.time.start = null;
		// this.time.end = null
	
	}

	ngOnInit() {

		if (!this.value.data) {
			this.value.data = {start: null, end: null};
		}

	}

	// ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
	// 	// let cl = setInterval(() => {
	// 	// 	if (changes.value.currentValue.data) {
	// 	// 		this.time = changes.value.currentValue.data;console.log('dfffff')
	// 	// 		clearInterval(cl)

	// 	// 	}
	// 	// },200)


	// }


	ngAfterViewInit() {
		this.container = <HTMLDivElement>this.containerViewChild.nativeElement;
	}

	setDomflag(e: any) {
        e.stopPropagation();
		if (this.disabled) {
			return;
		}
		if (!e.target.dataset.et) {
			this.selfClick = true
		}
	}
	
	bindDocumentClickListener() {
		if (!this.documentClickListener) {
			this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
				if (!this.selfClick) {
					this.show = false;
					this.onClick.emit(this.show);
					this.unbindDocumentClickListener();
				}

				this.selfClick = false;

			});
		}
	}

	unbindDocumentClickListener() {
		if (this.documentClickListener) {
			this.documentClickListener();
			this.documentClickListener = null;
		}
	}


	showPicker(e: any) {
		if (this.disabled) {
			return;
		}
		if (!this.show) {
			this.show = true;
			this.bindDocumentClickListener()
		} else {
			this.show = false
		}
		this.selfClick = false;
		this.onClick.emit(this.show);
		// console.log(this.container);
		e.stopPropagation()
	}

	onConfirm(d: any) {
		this.value.data = d;
		let date = {};
		date['end'] = moment(d.end).endOf('day').valueOf();
		date['start'] = moment(d.start).startOf('day').valueOf();
		// this.time = d;
		this.showPicker(d.event);
		//EventEmitter
		this.onSelect.emit(date);
	}

	onClose(e: any) {
		this.showPicker(e)
	}

	ngOnDestroy() {
		this.unbindDocumentClickListener()
	}

}