import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectSearchService } from './select-search.service';

@Component({
  selector: 'select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.css'],
  providers: [SelectSearchService]
})

export class SelectSearchComponent implements OnInit {
  @Input() select: any;
  @Input() selectDisabled: boolean=false;
  @Output() onSelect = new EventEmitter<any>();
  @Output() selectOptions = new EventEmitter<any>();

  @Output() refreshOptions = new EventEmitter<any>();

  selectedOption: any;
  searchOptions: any = [];
  dataList: any[];

  @Input() set refresh(_refresh: EventEmitter<any>) {
    _refresh && _refresh.subscribe && _refresh.subscribe((data: any) => {
      this.querySelectDatas();
    })
  }


  constructor(private service: SelectSearchService) { }

  searchChange(searchText: any) {
    let data$ = Observable.create((observer: any) => {
      observer.next(this.dataList);
    }).throttleTime(1000).map((heroes: any) => {
      return heroes.filter((item: any) => {
        return new RegExp(searchText, 'gi').test(item.label)
      });
    }).delay(2000);
    data$.subscribe((result: any) => {
      this.searchOptions = result;
    });
  }

  querySelectDatas() {
    console.log('querySelectDatas');
    if( this.select ) {
      if (this.select.apiData) {
        this.service.getDatas(this.select.apiUrl, this.select.apiParam).subscribe((data: any) => {
          this.dataList = data.result;
          this.searchOptions = this.dataList;
          if(this.select.apiData && this.select.search){
              this.dataList.unshift({label: "全部", value: ""})
              this.searchOptions = this.dataList;
          }
        })
      } else {
        this.dataList = this.select.selectOptions;
        this.searchOptions = this.dataList;
      }
    }
    
  }

  ngOnInit() {
    this.querySelectDatas();
    this.selectedOption = this.select && this.select.initValue ? this.select.initValue : '';

    this.onSelect.emit(this.selectedOption);
    this.selectOptions.emit(this.dataList);
  }

  changeSelect(data: any) {
    // this.querySelectDatas();

    this.onSelect.emit(this.selectedOption);
    this.selectOptions.emit(this.dataList);
  }

}
