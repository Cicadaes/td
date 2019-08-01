import { Component, OnInit, Renderer2, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import * as reducer from './../../../ngrx/reducer';
// import Services
import { BrandSourceService } from '../../../services/source/brand.source.service';

@Component({
  selector: 'brand-analysis',
  templateUrl: './brand-analysis.component.html',
  styleUrls: ['./brand-analysis.component.less'],
  providers: [AsyncPipe, BrandSourceService]
})
export class BrandAnalysisComponent implements OnInit {
  // global 状态管理数据
  private _store: any;
  private _startTime: string = '';
  private _endTime: string = '';

  private hotWordList: any = [];  // 品牌指数热词数据
  private hotWordIndex: any = 0;  // 品牌指数热词索引
  private hotWordLength: any = 0; // 品牌指数热词数量
  private addHotWordFlag: boolean = true;  // 新建、添加框的显示隐藏
  private hotWordName: any;  // 热词名字
  private brandVolumeList: any = [];  // 品牌声量趋势
  private brandLineChart: any = null; // 品牌声量趋势图表数据
  private brandTableColumn: any = null; // 品牌声量趋势图表格表头数据
  private brandTableData: any = null; // 品牌声量趋势表格内容数据
  private brandRankingChart: any = null; // 品牌声量分布图表数据
  private mediaVolumeChart: any = []; //  媒体声量图表数据
  private mediaBarChart: any = null; //  媒体声量排名和分布图表数据
  private mediaTableColumn: any = []; // 媒体声量排名和分布表头数据
  private mediaTableContent: any = []; //  媒体声量排名和分布表格内容数据
  private popularFeelingsChart: any = null; // 舆情热情分布图标数据
  private popularFeelingsTableColumn: any = []; // 舆情热情分布表头数据
  private popularFeelingsTableContent: any = []; // 舆情热情分布表格数据
  private top5PositiveWord: any = []; //  TOP5正面舆情热词
  private top5NegativeWord: any = []; //  TOP5负面舆情热词

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private store$: Store<reducer.State>,
    private asyncPipe: AsyncPipe,
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

    // 品牌声量趋势数据
    this.brandVolumeList = [
      {
        name: "总声量",
        value: "56,798,000"
      },
      {
        name: "正面声量",
        value: "21,000,000"
      },
      {
        name: "负面声量",
        value: "20,000,000"
      },
      {
        name: "负声量率",
        value: "36.60%"
      },
    ];
    // 品牌声量趋势图表数据
    let data = [
      {
        "total": 100,
        "date": "01",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "02",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "03",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "04",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "05",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "06",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "07",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "08",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "09",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "10",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "11",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }, {
        "total": 100,
        "date": "12",
        "front": 30,
        "frontRate": 30,
        "negative": 40,
        "negativeRate": 40,
        "neutral": 30,
        "neutralRate": 40,
      }
    ]

    let timeData: any[] = [];
    timeData = data.map((x: any) => x['date']);
    const total = this.setQueryData(timeData, data, 'total');
    const front = this.setQueryData(timeData, data, 'front');
    const frontRate = this.setQueryData(timeData, data, 'frontRate');
    const negative = this.setQueryData(timeData, data, 'negative');
    const negativeRate = this.setQueryData(timeData, data, 'negativeRate');
    const neutral = this.setQueryData(timeData, data, 'neutral');
    const neutralRate = this.setQueryData(timeData, data, 'neutralRate');

    // 品牌声量图表数据
    this.brandLineChart = {
      color: ['#2D8CF0','#FCC45F','#E9EAEC'], //'#2D8CF0',蓝色 2DE2C5 绿色
      legend: {
        itemWidth:12,
        itemHeight:12,
        data: [
          {
            name: '总声量',
            icon: 'circle'
          },
          {
            name: '正面声量',
            icon: 'circle'
          },
          {
            name: '负面声量',
            icon: 'circle'
          },
          {
            name: '中性声量',
            icon: 'circle'
          },
        ]
      },
      grid: {
        top: '16%',
        bottom: '0%',
        left: '0%',
        containLabel: true
      },
      tooltip: {
        formatter(value1: any) {
          let str = "";
          let total = "";
          
          value1.forEach((i: any) => {
            data.forEach((one: any) => {
              if(one.date == i.axisValue) { // 某天的值
                //if(i.seriesName == '总声量'){
                  total = `总声量 : ${one.total}`;
                //}
                if(i.seriesName == '正面声量'){
                  str += `<br />${i.marker}${i.seriesName} : ${i.value} (${one.frontRate}%)`;
                }
                if(i.seriesName == '负面声量'){
                  str += `<br />${i.marker}${i.seriesName} : ${i.value} (${one.negativeRate}%)`;
                }
                if(i.seriesName == '中性声量'){
                  str += `<br />${i.marker}${i.seriesName} : ${i.value} (${one.neutralRate}%)`;
                }
                total += str;
              }
            });
          });
          return total;
        },
      },
      xAxis: {
        data: timeData,
        axisLabel: {
          margin: 20,
        },
      },
      yAxis: {
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
          stack: '总量',
          name: '正面声量',
          data: front,
          areaStyle: {normal: {}},
        },
        {
          stack: '总量',
          name: '负面声量',
          data: negative,
          areaStyle: {normal: {}},
        },
        {
          stack: '总量',
          name: '中性声量',
          data: neutral,
          areaStyle: {normal: {}},
        }
      ]
    };
    // 品牌声量表格数据
    this.brandTableColumn = [
      {
        key: 'date',
        title: '时间',
      },
      {
        key: 'total',
        title: '总声量',
      },
      {
        key: 'front',
        title: '正面声量',
      },
      {
        key: 'negative',
        title: '负面声量',
      },
      {
        key: 'neutral',
        title: '中性声量',
      }
    ];
    this.brandTableData = data;
    
    // 品牌声量排名分布表格数据
    setTimeout(() => {
      this.brandRankingChart = {
        color: ['#2D8CF0','#FCC45F','#E9EAEC'],
        series: {
          type: 'pie',
          data: [
            {
              name: "正面声量",
              value: 40
            },
            {
              name: "负面声量",
              value: 30
            },
            {
              name: "中性声量",
              value: 20
            },
          ]
        },
      };
    }, 0);
    
    // 媒体声量图表数据
    this.mediaVolumeChart = {
      series: {
        type: 'pie',
        data: [
          {
            name: "微博",
            value: 12000
          },
          {
            name: "知乎",
            value: 12000
          },
          {
            name: "今日头条",
            value: 12000
          },
          {
            name: "汽车之家",
            value: 12000
          },
          {
            name: "贴吧",
            value: 12000
          },
          {
            name: "其他",
            value: 12000
          }
        ]
      },
    };

    // 媒体声量排名和分布数据
    // 媒体声量排名和分布图表数据
    this.mediaBarChart = {
      color: ['#2D8CF0'],
      tooltip : {
        trigger: 'axis',
        axisPointer : {            
          type : 'line'      
        },
        formatter: '{b}: {c}'
      },
      grid: {
        top: '17%',
        bottom: '0%',
        left: '0%',
        containLabel: true
      },
      xAxis : {
        type : 'category',
        data : ['微博', '知乎', '今日头条', '汽车之家', '贴吧', '其他'],
        axisLabel: {
          margin: 20,
        },
        boundaryGap: true,
        axisTick: {
          alignWithLabel: true
      }
      },
      yAxis : {
        type : 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#E9EAEC'],
            type: 'solid',
          }
        }
      },
      series : [
        {
          name:'',
          type:'bar',
          barWidth: '40',
          data:[8899, 7000, 4900, 2700, 2000, 1200]
        }
      ]
    };
    // 媒体声量排名和分布表头数据
    this.mediaTableColumn = [
      {
        key: "name",
        title: "媒体"
      },
      {
        key: "value",
        title: "声量"
      },
    ];
    // 媒体声量排名和分布表格数据
    this.mediaTableContent = [
      {
        name: "微博",
        value: 8899
      },
      {
        name: "知乎",
        value: 7900
      },
      {
        name: "今日头条",
        value: 4900
      },
      {
        name: "汽车之家",
        value: 2700
      },
      {
        name: "贴吧",
        value: 2000
      },
      {
        name: "其他",
        value: 1200
      }
    ];
    // 舆情热词分布
    // 舆情热词分布图标数据
    this.popularFeelingsChart = {
      color: ['#2DE2C5'],
      tooltip : {
        trigger: 'axis',
        axisPointer : {            
          type : 'line'      
        },
        formatter: '{b}: {c}'
      },
      grid: {
        top: '17%',
        bottom: '0%',
        left: '0%',
        containLabel: true
      },
      xAxis : {
        type : 'category',
        data : ['TalkingData', '大数据', '人工智能', '区块链', '金融', '大数据', 'TalkingData', '大数据', '人工智能', '区块链'],
        axisLabel: {
          margin: 20,
        },
        boundaryGap: true,
        axisTick: {
          alignWithLabel: true
      }
      },
      yAxis : {
        type : 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#E9EAEC'],
            type: 'solid',
          }
        }
      },
      series : [
        {
          name:'',
          type:'bar',
          barWidth: '40',
          data:[90, 80, 75, 65, 60, 50, 45, 40, 25, 20]
        }
      ]
    };
    // 舆情热词分布表头数据
    this.popularFeelingsTableColumn = [
      {
        key: 'word',
        title: '热词',
      },
      {
        key: 'percentage',
        title: '分布',
      }
    ]; 
    // 舆情热情分布表格数据
    this.popularFeelingsTableContent = [
      {
        word: "TalkingData",
        percentage: 90
      },
      {
        word: "大数据",
        percentage: 80
      },
      {
        word: "人工智能",
        percentage: 75
      },
      {
        word: "区块链",
        percentage: 65
      },
      {
        word: "金融",
        percentage: 60
      },
      {
        word: "大数据",
        percentage: 50
      },
      {
        word: "TalkingData",
        percentage: 45
      },
      {
        word: "大数据",
        percentage: 40
      },
      {
        word: "人工智能",
        percentage: 25
      },
      {
        word: "区块链",
        percentage: 20
      },
    ]; 
  
    // TOP5正面舆情热词
    this.top5PositiveWord = [
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      },
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      },
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      },
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      },
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      }
    ];

    // TOP5负面舆情热词
    this.top5NegativeWord = [
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      },
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      },
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      },
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      },
      {
        title: "热词标题",
        time: "2018.02.23",
        source: "汽车之家",
        count: "22条相关",
        contenct: "摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两横文字多的话后面加点，摘要内容固定在最多两,摘要内容固定在最多两横文字多的话后面加点..."
      }
    ];
  }

  // 获取关键字
  getHostWord(){
    
  }

  /**
   * 对原始数据进行排序处理整合为图表 series所需的数据
   * @param time [图表X轴的数据]
   * @param data [请求得到的原始数据]
   * @param key  [当前的指标 key]
   */
  setQueryData(time: any, data: any, key: string) {
    const filterData: any[] = [];
    time.forEach((item: any) => {
      const value = data.filter((x: any) => x['date'] === item)[0];
      filterData.push(value[key]);
    });
    return filterData;
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
