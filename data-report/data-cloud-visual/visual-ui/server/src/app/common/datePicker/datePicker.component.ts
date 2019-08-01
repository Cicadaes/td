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
	styleUrls: ['datePicker.component.css']
})

export class DatePickerComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() value: any;
	@Output() onSelect = new EventEmitter<any>();

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
			this.value.data = { start: null, end: null }		
		}

		if(!this.value.disable) {
			this.value.disable = false
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
		if (!e.target.dataset.et) {
			this.selfClick = true
		}
	}
	bindDocumentClickListener() {
		if (!this.documentClickListener) {
			this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
				if (!this.selfClick) {
					this.show = false;
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
		if(this.value.disable) {
			return
		}
		if (!this.show) {
			this.show = true;
			this.bindDocumentClickListener()
		} else {
			this.show = false
		}
		this.selfClick = false;
		// console.log(this.container);
		e.stopPropagation()
	}

	onConfirm(d: any) {
		this.value.data = d;
		// this.time = d;
		this.showPicker(d.event);
		//EventEmitter
		this.onSelect.emit(d)
	}
	onClose(e: any) {
		this.showPicker(e)
	}

	ngOnDestroy() {
		this.unbindDocumentClickListener()
	}

}