import { Component, OnInit, OnChanges, SimpleChange, Input, Output, ElementRef, Renderer, ViewChild, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
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
//  disable:false
//  data:null
// }
//demo
//<datePicker [value]="value" (onSelect)="onSelect($event)"></datePicker>
@Component({
	selector: 'datePicker',
	templateUrl: 'datePicker.component.html',
	styles: [`
		.datePicker {
			position:relative;
			display: inline-block;
			width: 100%;
		}
		
		.datePicker .pinput {
			padding:10px;
			position:absolute;
			top:28px;
			left:0;
			background:#fefefe;
			border: 1px solid #dfe7f2;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
			width: 34.6em;
			z-index: 100;
		}
		
		.datePicker .date-box {
			position:relative
		}
		.datePicker .date-box .ui-inputtext {
			display: inline-block;
			min-width: calc(100% - 32px);
			margin-left: 10px;
			line-height: 1.5;
			border: 1px solid #dfe7f2;
			cursor: pointer;
			padding: 6px 10px;
		}
		.datePicker .date-box .ui-inputtext.disable {
			background: #f8f8f8;
			cursor: not-allowed
		}
		.datePicker .date-box .ui-inputtext label {
			color:#dfe7f2
		}
		.datePicker .date-box .ui-button-icon-right {
			position:absolute;
			right:8px;
			top:9px;
			cursor: pointer
		}


	`]
})

export class DatePickerComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() value: any;
	@Output() onSelect = new EventEmitter<any>();

	@ViewChild('container') containerViewChild: ElementRef;

	public container: HTMLDivElement;
	public documentClickHandleBind: any;

	private show: boolean = false;
	private currentButton:any;
	constructor(public el: ElementRef, public renderer: Renderer) {

	}

	ngOnInit() {
		if (!this.value.data) {
			this.value.data = { start: null, end: null }
		}

		if(!this.value.disable) {
			this.value.disable = false
		}
	}

	ngAfterViewInit() {
		this.container = <HTMLDivElement>this.containerViewChild.nativeElement;
		//监听BODY click事件
		this.bindDocumentClickListener();
	}

	bindDocumentClickListener() {
		this.documentClickHandleBind = this.documentClickHandle.bind(this);
		document.addEventListener('click',this.documentClickHandleBind);
	}

	unbindDocumentClickListener() {
		document.removeEventListener('click',this.documentClickHandleBind);
	}

	private documentClickHandle(e:any):void{
		if(this.currentButton != e.target){
			this.hiddenPicker();
		}
	}

	hiddenPicker(){
		this.show = false;
	}

	showPicker(e: any) {
		if(this.value.disable) {
			return;
		}
		this.show = true;
		this.currentButton = e.target;
	}

	stopDatePropagation(e:any){
		e.stopPropagation();
	}

	onConfirm(d: any) {
		this.value.data = d;
		this.hiddenPicker();
		// this.time = d;
		// this.showPicker(d.event);
		//EventEmitter
		d.start = this.formatDate(d.start);
		d.end = this.formatDate(d.end);
		this.onSelect.emit(d)
	}
	onClose(e: any) {
		this.hiddenPicker();
	}

	formatDate(date:any):any {
		let Y = date.getFullYear() + '-';
		let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		let D = date.getDate() + ' ';
		let h = date.getHours() + ':';
		let m = date.getMinutes() + ':';
		let s = date.getSeconds();
		return Y+M+D+h+m+s
	}

	ngOnDestroy() {
		this.unbindDocumentClickListener()
	}

}