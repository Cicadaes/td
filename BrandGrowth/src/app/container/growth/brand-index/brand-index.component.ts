import { ShowBreadAction } from './../../../ngrx/action/guard';
import { Component, OnInit, Renderer2, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import * as reducer from './../../../ngrx/reducer';
// import Services
import { BrandSourceService} from "../../../services/source/brand.source.service";

@Component({
  selector: 'brand-index',
  templateUrl: './brand-index.component.html',
  styleUrls: ['./brand-index.component.less'],
  providers: [BrandSourceService]
})
export class BrandIndexComponent implements OnInit {

  @Output() click = new EventEmitter();
  // global 状态管理数据
  private _store: any;
  private _startTime: string = '';
  private _endTime: string = '';

  private tableData: any = [];    // 品牌指数table数据
  private chartData: any = {};    // 品牌指数chart数据
  private hotWordList: any = [];  // 品牌指数热词数据
  private hotWordIndex: any = 0;  // 品牌指数热词索引
  private hotWordLength: any = 0; // 品牌指数热词数量
  private addHotWordFlag: boolean = true;  // 新建、添加框的显示隐藏
  private hotWordName: any = 0;  // 热词名字
  
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private store$: Store<reducer.State>,
    private brandSourceService: BrandSourceService
  ) {
    this._store = this.store$.select('global').debounceTime(1000).subscribe(result => {
      this._startTime = moment(new Date(result.startTime)).format('YYYY-MM-DD');
      this._endTime = moment(new Date(result.endTime)).format('YYYY-MM-DD');
    });
  }

  ngOnInit(): void {
    // 前端数据模拟
    // 模拟热词数据
    this.hotWordList = [
      {
        keyword: "京东双十二",
        id: 1,
      },
      {
        keyword: "天猫购物节",
        id: 2,
      },
      {
        keyword: "苏宁电器",
        id: 3,
      }
    ]

    this.hotWordLength = this.hotWordList.length;

    this.tableData = [
      {
        name    : '微信指数',
        average : '21,000,000',
        total : '20.00%',
        per: '20.00%',
        per2: '20.00%',
        tAverage: '21,000,000',
        totalType: 'up',
        perType: 'up',
        per2Type: 'down'
      }, {
        name    : '微博指数',
        average : '21,000,000',
        total : '20.00%',
        per: '20.00%',
        per2: '20.00%',
        tAverage: '21,000,000',
        totalType: 'up',
        perType: 'up',
        per2Type: 'down'
      },
      {
        name    : '搜狐指数',
        average : '21,000,000',
        total : '20.00%',
        per: '20.00%',
        per2: '20.00%',
        tAverage: '21,000,000',
        totalType: 'up',
        perType: 'up',
        per2Type: 'down'
      }
    ]

    let a = '2018-03-04';
    let b = '2018-03-11';
    this.chartData = {
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '10%', // 有图例为20
        top: '15%'
      },
      xAxis: {
        type: 'category',
        data: ['2018-03-01','2018-03-02','2018-03-03','2018-03-04','2018-03-05','2018-03-06','2018-03-07','2018-03-08','2018-03-09','2018-03-10','2018-03-11','2018-03-12'],
        axisLabel: {
          margin: 20,
        },
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#E9EAEC'],
            type: 'solid',
          }
        }
      },
      series: [
        {
          name:'微信指数',
          type:'line',
          stack: '总量2',
          data:[80, 78, 87, 90, 69, 96, 98, 83, 73, 79, 73, 90],
          smooth: true,
          markArea: {
            data: [
                [{
                    xAxis: '1'
                }, {
                    xAxis: '3'
                }]
            ],
            itemStyle: {
              color: 'rgba(45,140,240,.2)'
            }
          }
        },
        {
          name:'微博指数',
          type:'line',
          stack: '总量3',
          data:[60, 65, 78, 85, 84, 78, 74, 70, 85, 62, 73, 85],
          smooth: true
        },
        {
          name:'搜狐指数',
          type:'line',
          stack: '总量4',
          data:[20, 23, 34, 30, 62, 36, 24, 30, 50, 62, 38, 47],
          smooth: true
        }
      ]
    };

    for(let i = 0; i < this.chartData.xAxis.data.length; i++){
      if(this.chartData.xAxis.data[i] == a){
        this.chartData.series[0].markArea.data[0][0].xAxis = i;
      }

      if(this.chartData.xAxis.data[i] == b){
        this.chartData.series[0].markArea.data[0][1].xAxis = i;
      }
    }
  }

  // 获取关键字（热词）列表
  getHostWord(){
    
  }

  // 根据关键字和时间查询指标数据
  getBrandIndex(params: any){
    this.brandSourceService.getBrandIndex(params).then((data: any)=>{
      if (data.code == 200 && data.result) {
        
      }
    })
  }

  // 删除某个热词
  deleteOne(item: any, event: Event){
    event.stopPropagation();
    console.log("======>id",item.id)
    this.hotWordList = this.hotWordList.filter((old: any) => {
      return old.id !== item.id;
    })
    this.hotWordLength = this.hotWordList.length;
    
  }

  // 添加某个热词
  addOne(){
    this.hotWordName = "";
    if(this.hotWordLength >= 5) {
      return;
    }
    this.addHotWordFlag = false;
  }

  // 切换热词
  switcHoverOne(one: any, index: any, event: Event){
    event.stopPropagation();
    this.hotWordIndex = index;
  }

  // 回车添加新的热词
  addNewHotWord(value: any){
    if(value == ""){
      return;
    }
    event.stopPropagation();
    event.stopPropagation();
    let obj: any = {};
    obj['keyword'] = value;
    obj['id'] = this.hotWordLength + 1;
    this.hotWordList.push(obj);
    this.hotWordLength = this.hotWordList.length;
    this.addHotWordFlag = true;
  }

  // 取消添加热词
  cancel(){
    this.hotWordName = "";
    this.addHotWordFlag = true;
  }
}
