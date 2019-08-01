import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
/*
--api--
value = {
   totalRecords:number, //总条数
   rows:number, //每页显示条数
   pageLinkSize:number, //页码显示数量
   rowsPerPageOptions:array //条数切换

}
<x-paginator [value]="value" (onPagesChange)="onPagesChange($event)"></x-paginator>
 */
@Component({
	selector: 'x-paginator',
	templateUrl: 'paginator.component.html'
})

export class PaginatorComponent implements OnInit {
    @Input() value:any;
	@Output() onPagesChange = new EventEmitter<any>()
	ngOnInit() { }

    onPagesChage(e:any) {
		this.onPagesChange.emit(e)
	}



}