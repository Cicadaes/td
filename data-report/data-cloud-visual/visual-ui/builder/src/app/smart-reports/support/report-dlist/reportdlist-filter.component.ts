import {Component, OnInit} from '@angular/core'
import {DatacauseCommunicationService} from "../report-service/datacause.service";

@Component({
    selector: 'reportdlist-filter',
    templateUrl: 'reportdlist-filter.component.html',
    styles: [`
      .filter{
            padding: 20px 45px;
            padding-right: 250px;
            position: relative;
            z-index: 3;
            background: #fbfcfe;
            border-bottom: 1px solid #dee6ed;
            border-top: 1px solid #dee6ed;
        }
        .filter-left{
            float: left;
            width: 100%;
        }
        .filter-left  li{
            width:auto !important;
            float: left;
            margin: 6px 20px 6px 0;
            padding-left: 90px;
            height: 32px;
        }
        .filter-left .filterKey{
            display: inline-block;
            width: 74px;
            margin-left: -90px;
            height: 30px;
            line-height: 30px;
            float: left;
            padding-right: 16px;
            text-align: right;
        }
        .filter-left input{
            width:190px !important;
        }
        .filter .drop-down{
            position: relative;
        }
        .filter .selectwrap  .drop-down .fa-calendar{
            position: absolute;
            top:10px;
            right:5px;
            cursor: pointer;
        }
        .filter .selectwrap{
            position: relative;
        }
        .filter  .filter-left .select{
            width: 100%;
            height: 32px;
            border: 1px solid #dfe7f2;
            border-radius: 3px;
            padding-left: 10px;
            cursor: pointer;
            appearance:button;
            -webkit-appearance:button;
        }
        .filter .selectwrap .fa-caret-down{
            position: absolute;
            right: 6px;
            top: 8px;
            cursor: pointer;
        }
        .filter-left  input{
            width: 190px;
            height:32px;
            padding: 0 10px;
        }
        .filter-left .time .showTime{
            width: calc(100% - 22px);
            padding: 0 10px;
        }
        .filter .filterBtnWrap{
            margin-right: 20px;
        }
      :host/deep/  span.ui-inputtext{
          width:170px !important;
          height:32px !important;
          min-width:170px !important;
          margin-left:0px !important;
          padding-top:0 !important;
          padding-bottom:0 !important;
          line-height:32px !important;
        }        
        /*!*时间区间*!*/
        .dateRangeWrap {
            position: relative;
            z-index:1;
            width: 415px;
            border: 1px solid #ccc;
            padding: 6px;
            background: #eee;
            border-radius: 3px;
        }
        .filter .time{
            position: relative;
        }
        .filter .time  .dateRangeWrap{
            position: absolute;
            top: 42px;
            left: 0;
        }
        .dateRangeWrap .dateButton{
            width: 60px;
            height: 25px;
            background: #ccc;
            border-radius: 2px;
            color:#fff;
            margin: 8px 8px 0 8px ;
            float: right;
        }
        .dateRangeWrap .dateButton:hover{
            background: #5697f1;
        }
        .time .timeBoxWrap{
            height: 30px;
            line-height: 30px;
            margin: 5px;
        }
        .time .dateRangeWrap  .timeBox{
            display: inline-block;
            width: 200px;
            height: 30px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding-left: 3px;
            float: left;
        }
        .time .showTime{
            display: inline-block;
            width: 207px;
            height: 29px;
            border: 1px solid #dfe7f2;
            border-radius: 3px;
            float: left;
            line-height: 29px;
            padding-left: 3px;
            background: #fff;
        }
        
        .timeBoxWrap>a {
            float: left;
            margin-left: 5px;
        }



    `]
})

export class ReportdlistFilterComponent implements OnInit {

    name: string // 调度任务名称
    azkabanProjectName: string // 调度平台项目名称
    systemCode: string // 应用系统
    status: string // 状态, 0 禁用 1 正常
    statusList: any[] = [
        {label: "", value: null},
        {label: "有效", value: "1"},
        {label: "无效", value: "0"}
    ]
    creator: string;
    updater: string;
    createTimePicker: any;
    updateTimePicker: any;

    constructor(private communication: DatacauseCommunicationService) {
        this.createTimePicker = {
            showIcon: true,
            placeholder: '选择时间',
            ranges: [
                { label: '今天', day: 1 },
                { label: '最近七天', day: 7 },
                { label: '最近一个月', day: 30 }
            ]
        }
        this.updateTimePicker = {
            showIcon: true,
            placeholder: '选择时间',
            ranges: [
                { label: '今天', day: 1 },
                { label: '最近七天', day: 7 },
                { label: '最近一个月', day: 30 }
            ]
        }
    }

    ngOnInit() { }

    search() {
        let queryObj = {}
        // 模糊查询的字段统一处理
        let likeParams = ["name", "creator", "updater"]
        likeParams.forEach(s => {
            if (this[s]) {
                queryObj[s] = `%${this[s]["replace"](/([%\\_])/g, "\\$1")}%`
                queryObj[s + 'Operator'] = "like"
            }
        })
        // 精确查询的字段统一处理
        // let equalsParams = ["status"]
        // equalsParams.forEach(s => {
        //     if (this[s]) {
        //         queryObj[s] = this[s]
        //     }
        // })
        // 时间范围查询的字段统一处理
        let timeParams = ["createTime"]
        timeParams.forEach(s => {
            if (this[s + 'Picker'].data) {
                if (this[s + 'Picker'].data.start) {
                    queryObj[s + '1'] = this.dateFormat(this[s + 'Picker'].data.start) + " 00:00:00"
                }
                if (this[s + 'Picker'].data.end) {
                    queryObj[s + '2'] = this.dateFormat(this[s + 'Picker'].data.end) + " 23:59:59"
                }
            }
        })
        let timeUpdateParams = ["updateTime"]
        timeUpdateParams.forEach(s => {
            if (this[s + 'Picker'].data) {
                if (this[s + 'Picker'].data.start) {
                    queryObj[s + '1'] = this.dateFormat(this[s + 'Picker'].data.start) + " 00:00:00"
                }
                if (this[s + 'Picker'].data.end) {
                    queryObj[s + '2'] = this.dateFormat(this[s + 'Picker'].data.end) + " 23:59:59"
                }
            }
        })
        this.communication.setQueryObj(queryObj)
        this.communication.changePage(1)
    }

    reset() {
        this.status = null
        this.name = this.creator = this.updater = null
        if (this.createTimePicker.data) {
            this.createTimePicker.data.start = this.createTimePicker.data.end = null
        }
        if (this.updateTimePicker.data) {
            this.updateTimePicker.data.start = this.updateTimePicker.data.end = null
        }
    }

    dateFormat(date: Date): string {
        let year, month, day, endDay
        year = date.getFullYear()
        year = year < 10 ? "0" + year : year
        month = date.getMonth() + 1
        month = month < 10 ? "0" + month : month
        day = date.getDate()
        day = day < 10 ? "0" + day : day
        endDay = date.getDate() + 1
        endDay = endDay < 10 ? "0" + endDay : endDay
        return `${year}-${month}-${day}`
    }

}
