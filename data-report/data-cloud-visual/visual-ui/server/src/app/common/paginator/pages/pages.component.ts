import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Paginator } from 'primeng/primeng'

@Component({
	selector: 'x-pages',
	templateUrl: 'pages.component.html',
	styleUrls: ['pages.component.css']
})

export class PagesComponent extends Paginator implements OnInit {
	@Input() configs: any;
	@Output() onPagesChage = new EventEmitter<any>();
	public numberPage:number = 10;
	ngOnInit() {
		this.changePageToPrev
	}

	paginate(e: any) {
		//event.first = Index of the first record
		//event.rows = Number of rows to display in new page
		//event.page = Index of the new page
		//event.pageCount = Total number of pages
		this.onPagesChage.emit(e)
	}

	onChange(e: any){
		console.log(e);
		this.configs.rows = e.target.value;
		console.log(this.configs)
	}


	changeToPage(e: any, papi: any) {
		if (e.keyCode === 13) {
			let val = e.target.value;
			if (val) {
				papi.changePage(parseInt(val) - 1, e)
			}


		}

	}

	changePrev(e:any, papi:any) {
		papi.changePageToPrev(e)
	}

	changeNext(e:any, papi:any) {
		papi.changePageToNext(e)
	}
}