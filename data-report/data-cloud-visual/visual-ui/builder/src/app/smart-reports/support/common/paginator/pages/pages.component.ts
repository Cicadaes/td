import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Paginator } from 'primeng/primeng'

@Component({
	selector: 'x-pages',
	templateUrl: 'pages.component.html',
	styles: [`
		.x-pages {
			text-align: center
		}
		
		:host /deep/ .x-pages .x-pages-pign {
			margin: 20px 10px !important
		}
		
		.x-pages-info,
		.x-pages p-paginator,
		.x-pages-oprs {
			display: inline-block;
			position: relative;
		}
		
		.x-pages-oprs .ui-inputtext {
			margin: 0 10px;
			width: 28px;
			height: 26px;
			padding: 0;
			text-align: center
		}
		
		:host /deep/ .x-pages-pign .ui-paginator-first,
		 :host /deep/ .x-pages-pign .ui-paginator-prev,
		:host /deep/ .x-pages-pign .ui-paginator-next,
		 :host /deep/ .x-pages-pign .ui-paginator-last {
			display: none !important
		}
		
		:host /deep/ .x-pages-pign .ui-paginator-pages a.ui-state-default {
			background: #fff;
			border: 1px solid #dfe7f2
		}
		
		:host /deep/ .x-pages-pign .ui-paginator-pages a.ui-state-active {
			background: #5697f1
		}
		
		:host /deep/ .x-pages-pign .ui-paginator-pages a:not(:last-child) {
			margin-right: 5px
		}
		
		.x-pages .x-pages-prev {
			margin-left: 10px
		}
		
		.x-pages .x-pages-next {
			margin-right: 10px
		}
		
		.x-pages .x-pages-prev,
		.x-pages .x-pages-next {
			display: inline-block;
			box-sizing: border-box;
			width: 28px;
			height: 28px;
			line-height: 28px;
			border-radius: 3px;
			background: #fff;
			border: 1px solid #dfe7f2;
			cursor: pointer;
			text-align: center;
			user-select: none;
			-webkit-user-select: none
		}
		
		.x-pages-in .iconfont {
			font-size: 14px;
			color: #657180
		}
		
		.x-pages-in .icon-fanhui {
			padding-left: 2px
		}
		
		.x-pages-in .icon-gengduo {
			padding-right: 2px
		}
		
		:host /deep/ .ui-paginator .ui-paginator-rpp-options{
			position: absolute;
			left: -123px;
			top: 19px;
			width: 50px;
			height: 30px;
			border: 1px solid rgba(0, 0, 0, 0.15);
			border-radius: 3px;
			padding-left: 10px;
			cursor: pointer;
			/*在选择框的最右侧中间显示小箭头图片*/
			background: url("/public/images/arrow.png") no-repeat scroll right center transparent;
			/*为下拉小箭头留出一点位置，避免被文字覆盖*/
			padding-right: 14px;
		}
		
		:host /deep/ .x-pages-select{
			display: inline-block;
			width: 60px;
		}
	`]
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
      let reg = /\D/g;

      if (!reg.test(val)) {
        papi.changePage(val - 1, e)

      } else {
        e.target.value = ""
      }


    }

  }


	changePrev(e:any, papi:any) {
		papi.changePageToPrev(e)
	}

	changeNext(e:any, papi:any) {
		papi.changePageToNext(e)
	}


	onKeyup(e: any) {
    e.target.value = e.target.value.replace(/[^\d]*$/g, '')
    let count = Math.ceil(parseInt(this.configs.totalRecords) / this.configs.rows)
    if (count < e.target.value) {
      e.target.value = count
    }
  }
}