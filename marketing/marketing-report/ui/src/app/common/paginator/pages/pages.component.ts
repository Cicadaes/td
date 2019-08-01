import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Paginator } from 'primeng/primeng'

@Component({
	selector: 'x-pages',
	templateUrl: 'pages.component.html',
	styleUrls: ['pages.component.css']
})

export class PagesComponent extends Paginator implements OnInit {
	@Input() configs: any;
	@Input()
	set page(p: number) {
		if(p && this.api) {
			if (this.pageIndex !== (p - 1)) {
				this.api.changePage(p - 1);
			}
		}
	}
	@Output() onPagesChage = new EventEmitter<any>();
	public numberPage:number = 10;
	ngOnInit() {
	}

	api: any;
	pageIndex: number;

	ngAfterViewInit() {
		document.getElementById('pages-prev').click();
	}

	paginate(e: any) {
		//event.first = Index of the first record
		//event.rows = Number of rows to display in new page
		//event.page = Index of the new page
		//event.pageCount = Total number of pages
		this.pageIndex = e.page;
		this.onPagesChage.emit(e)
	}

	onChange(e: any){
		// console.log(e);
		this.configs.rows = e.target.value;
		// console.log(this.configs)
	}


	changeToPage(e: any, papi: any) {
		if (e.keyCode === 13) {
			let val = e.target.value;
			if (val) {
				papi.changePage(parseInt(val) - 1, e)
			}
		} else {
            let val = e.key;
			if (!/^[0-9]$/.test(val) && val.length == 1) {
				e.target.value = e.target.value.substr(0, e.target.value.length - 1);
				return;
			}
		}
	}
	
	changePrev(e:any, papi:any) {
		if (!this.api) {
			this.api = papi;
		}
		papi.changePageToPrev(e)
	}

	changeNext(e:any, papi:any) {
		papi.changePageToNext(e)
	}
}