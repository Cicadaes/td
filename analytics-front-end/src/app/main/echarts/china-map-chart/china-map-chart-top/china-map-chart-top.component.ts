import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'china-map-chart-top',
  templateUrl: './china-map-chart-top.component.html',
  styleUrls: ['./china-map-chart-top.component.css']
})
export class ChinaMapChartTopComponent implements OnInit {
  @Input() datas: any[];

  _chinaMapChartTopDatas: any[];

  ngOnChanges() {
    // if(changes.datas){
    //     // this._chinaMapChartTopDatas = changes.datas.currentValue;
    //     // console.dir([this._chinaMapChartTopDatas,'this._chinaMapChartTopDatas']);
    // }
  }

  ngOnInit(): void {}
}
