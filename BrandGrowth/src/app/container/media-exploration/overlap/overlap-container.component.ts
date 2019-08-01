import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as reducer from '../../../ngrx/reducer';
import * as global from '../../../ngrx/action/global';
import * as moment from 'moment';
// import services
import { MediaExploreSourceService} from '../../../services/source/mediaExplore.source.service' 
@Component({
  selector: 'overlap-exploration',
  templateUrl: './overlap-container.component.html',
  styleUrls: ['./overlap-container.component.less'],
  providers:[
    MediaExploreSourceService,
  ]
})
export class OverlapContainerComponent implements OnInit {
  private percentageColor: any = [];  // 表格颜色T度值
  private max: any;  // 百分比的最大值
  private min: any;  // 百分比的最小值
  private percentageArr: any = [];  // 百分比数组
  private tableData: any = [];  // 表格数据
  private tableDataFlag: boolean = false;  // 表格数据
  // global 状态管理数据
  private _store: any;
  private _startTime: string = '';
  private _endTime: string = '';
  private mediaExploreId: string = '';  // 媒体探索Id
  private mediaExploreName:  string = '';;  // 媒体探索名称

	constructor(
    private store$: Store<reducer.State>,
    private mediaExploreSourceService: MediaExploreSourceService,
  ) {
    this._store = this.store$.select('global').debounceTime(1000).subscribe(result => {
      this.mediaExploreId = result.mediaExploreId;
      this.mediaExploreName = result.mediaExploreName;
      if (!!this.mediaExploreId) {
        this.getData();
      }
    });
  }
  
	ngOnInit() {
    
  }

  // 获取数据
  getData(){
    
    this.mediaExploreSourceService.getMediaOverlap(this.mediaExploreId).then((data: any) => {
      if (data.code == 200 && data.result) {
        this.tableData = data.result;
        if(this.tableData.length > 0){
          this.tableDataFlag = true;
          // 获取最大最小值
          this.getMaxMin(this.tableData);
          // 设置颜色值
          this.makeColor(this.max,this.min);
        }
      }
    })
    
  }
  
  // 获取最大值最小值
  getMaxMin(arr: any){
    arr.forEach((one: any) => {
      one.forEach((el: any) => {
        if(el['value'] && el['value'] != -1){
          this.percentageArr.push(el['value']);
        }
      });
    });
    this.max = Math.max.apply(null, this.percentageArr);
    this.min = Math.min.apply(null, this.percentageArr);
  }
	
  // 处理表格颜色T度值
  makeColor(max: any,min: any){
    let one = (Number(this.max)*10 - Number(this.min)*10)/50;
    for(let i = 0; i < 5; i++){
      this.percentageColor.push(Number(this.min*100 + one*i*100)/100)
    }
  }

  ngOnDestroy() {
    this._store.unsubscribe();
  }

}
