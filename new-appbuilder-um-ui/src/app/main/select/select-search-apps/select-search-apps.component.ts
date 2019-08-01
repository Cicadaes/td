import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { SelectSearchAppsService } from './select-search-apps.service';

@Component({
  selector: 'select-search-apps',
  templateUrl: './select-search-apps.component.html',
  styleUrls: ['./select-search-apps.component.css'],
  providers: [SelectSearchAppsService]
})

export class SelectSearchAppsComponent implements OnInit {
  @Input() select: any;
  @Output() onSelect = new EventEmitter<any>();
  @Output() selectOptions = new EventEmitter<any>();
  @Input() ismultiple: boolean = false;
  selectedOption: any[] = [];
  searchOptions: any[] = [];
  dataList: any[];
  // 是否包含依赖的主应用
  private hasMainApp: boolean = true

  constructor(private service: SelectSearchAppsService) { }

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

      this.addTitle(this.searchOptions)

    });
  }

  querySelectDatas() {
    if (this.select.apiData) {
      this.service.getDatas(this.select.apiUrl, this.select.apiParam).subscribe((data: any) => {
        this.dataList = data.result;
        this.searchOptions = this.dataList;

        this.addTitle(this.searchOptions)

        this.initSelect();
      })
    } else {
      this.dataList = this.select.selectOptions;
      this.searchOptions = this.dataList;

      this.addTitle(this.searchOptions)

      this.initSelect();
    }
  }

  initSelect() {
    this.selectedOption = this.select.initValue || [];
    this.onSelect.emit(this.selectedOption);
    this.selectOptions.emit(this.dataList);
  }

  ngOnInit() {
    this.querySelectDatas();
  }


  /**
   * 加不上类，只能DOM操作
   * 没有办法的的办法
   * @return {[type]} [description]
   */
  ngAfterViewChecked() {
    const selectList = document.getElementsByClassName('ant-select-dropdown-menu-item')
    if (selectList && selectList.length) {
      selectList[0] && selectList[0].classList.add('selectTitle-one')
      selectList[1] && selectList[1].classList.add('selectTitle-two')
    }
  }

  changeSelect(data: any) {
    this.hasMainApp = false;
    if (this.selectedOption && this.selectedOption.length) {
      this.hasMainApp = true
    } else {
      this.hasMainApp = false
    }
    this.onSelect.emit(this.selectedOption);
    this.selectOptions.emit(this.dataList);
  }

  /**
   * 下拉选项添加title
   * @return {[type]} [description]
   */
  private addTitle(data: any) {
    if (data && data.length) {
      data.unshift({
        name: '应用名称',
        version: '版本',
        desc: '描述',
        label: '',
        value: -9999
      })
    }
  }

}
