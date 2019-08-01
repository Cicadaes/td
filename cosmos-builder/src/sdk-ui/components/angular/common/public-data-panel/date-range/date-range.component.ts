import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { DataPanel } from "../../data.panel";

@Component({
  selector: "app-date-range",
  templateUrl: "./date-range.component.html",
  styleUrls: ["./date-range.component.less"]
})
export class DateRangeComponent implements OnInit {
  selectedDate: string = ""; //选中的日期维度
  dateRange: any = []; //自定义时间范围
  dateType: string = "default"; //日期范围类型

  dateDimensionsList: any = []; //日期维度列表

  dateParam: any = {}; //日期范围 组件的所有参数

  @Input()
  set list(data: any) {
    this.dateDimensionsList = data;
  }

  @Input()
  set dataConfig(data: any) {
    setTimeout(() => {
      this.selectedDate = data["dateDimension"];
      this.dateType = data["dateType"] || "default";
      this.dateRange = this.handlerDate(data["dateRange"]);
    }, 0);

  }

  @Output() change = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  handlerDate(dates: Array<string>) {
    if (!dates || !dates.length) return [];
    return dates.map(item => new Date(item));
  }

  /**
   * 改变日期维度字段
   * @param value
   */
  changeDate(value: any) {
    this.dateParam["dateDimension"] = this.selectedDate;
    this.dateParam["dateType"] = "default";

    this.dateType = "default";
    this.dateRange = [];
    delete this.dateParam["dateRange"];
    this.change.emit(this.dateParam);
  }

  /**
   * 改变日期类型
   * @param value
   */
  changeDateType(value: any) {
    this.dateParam["dateType"] = value;

    this.dateRange = [];
    delete this.dateParam["dateRange"];
    if ("custom" == value) {
      return;
    }
    this.change.emit(this.dateParam);
  }

  /**
   * 改变自定义日期范围
   * @param value
   */
  changeDateRange(value: any) {
    this.dateParam["dateRange"] = this.dateRange;

    this.change.emit(this.dateParam);
  }
}
