import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Router } from '@angular/router';
import { CampaignResourceService } from './../../../services/campaign/campaign.resource.service';
import { ErrorHandlingService } from "../../../services/exceptional/error-handling.service";

import * as ps from 'perfect-scrollbar';
import * as moment from 'moment';
import { CampaignDeleteCommunicationService } from "../../../services/communication/campaign-delete.communication.service";

@Component({
    selector: 'campaign-overview',
    templateUrl: 'campaign-overview.component.html',
    styleUrls: ['campaign-overview.component.css'],
    providers: []
})

export class CampaignOverviewComponent {

    message:string = "暂无数据";

    @Input() 
    set seleted(bl: boolean) {
        if (bl && this.isUpdate) {
            this.isUpdate = false;
            this.campaignList = [];
            this.queryParams.page = 1;
            this.queryCampaigns(this.queryParams);
            this.campaignResourceService.getCurrYearOverview().then(data => {
                this.campaignOverview = data;
            }).catch();
        }
    }

    @Output() changeLoading = new EventEmitter<boolean>();

    @Output() errorMessage = new EventEmitter<any>();

    isUpdate: boolean = false;

    loading: boolean = true;

    campaignOverview: any = {};

    campaignList: any = [];  //活动列表
    
    count: number;  //当前日期下活动总数量

    width: number; //甘特图每一个小div的宽度

    left: number; //甘特图左边第一个div宽度

    contentWidth: number; //甘特图整个外层div宽度

    isLoading: boolean = false;   //判断是否在获取数据中 防止多次请求

    resizeFlag: any;  //用于页面resize时 记录timeout    

    //默认获取甘特图请求参数
    queryParams: any = {
        orderBy: 'startTime',
        order: 'asc',
        startTimeLong: new Date(`${new Date().getFullYear()}-01-01`).getTime(),
        endTimeLong: new Date(`${new Date().getFullYear()}-12-31`).getTime(),
        page: 1,
        pageSize: 10
    };

    monthList: any[] = [1,2,3,4,5,6,7,8,9,10,11,12];

    yearList: any[] = [{
        year: new Date().getFullYear(),
        count: 12,
        width: `calc(((100% - 347px)/12) * 12)`
    }];

    content: any;

    constructor(
        public campaignResourceService: CampaignResourceService,
        public errorHandlingService: ErrorHandlingService,
        public campaignDeleteCommunicationService: CampaignDeleteCommunicationService,
        public router: Router
    ){
        let that = this;
        campaignResourceService.getCurrYearOverview().then(data => {
            that.campaignOverview = data;
        }).catch();
        campaignDeleteCommunicationService.deletCampaign$.subscribe((data: any) => {
            if (data) {
                that.isUpdate = true;
            }
        })
        document.addEventListener('ps-y-reach-end', function () {
            //滚动条到底部的条件即为scrollTop + clientHeight == scrollHeight。  防止有时到底少一像素
            if (that.content.scrollTop + that.content.clientHeight >= that.content.scrollHeight - 1 && !that.isLoading) {
                if (!that.count || that.queryParams.page + 1 > Math.ceil(that.count/10)) {
                    return;
                }
                that.queryParams.page += 1;
                that.queryCampaigns(that.queryParams);
            }
        });
        //页面size改变 需要重绘页面
        window.onresize = function () {
            that.width = null;
            that.left = null;
            that.contentWidth = null;
            that.calcTime(that.campaignList);
            ps.update(that.content);
        }
    }


    ngOnInit () {
        this.queryCampaigns(this.queryParams);
    }

    ngAfterViewInit() {
        let that = this;
        that.content = document.getElementById('content');
        ps.initialize(that.content);
    }

    ngOnDestroy() {
        window.onresize = ()=>{};
        document.removeEventListener('ps-y-reach-end', () => {});
    }

    //计算甘特图
    calcTime(data: any) {
        if (!this.width) {
            this.width = document.getElementsByClassName('content-table')[0]['offsetWidth'];
        }
        if (!this.left) {
            this.left = document.getElementsByClassName('content-name')[0]['offsetWidth'];
        }
        if (!this.contentWidth) {
            this.contentWidth = document.getElementById('content')['offsetWidth'];
        }
        let length = data.length;
        let time = new Date();
        let flag = false;
        for (let i = 0; i < length; i++) {
            let tempWidth = 0;
            let startTime = new Date(data[i].startTime);
            let endTime = new Date(data[i].endTime);
            let lastTime = this.queryParams.endTimeLong;     //当前日期选择器最后一天
            let nowTime = new Date();
            //如果结束时间超过了最大时间 则显示到最大时间
            if (endTime > lastTime) {
                flag = true;
                endTime = lastTime;
            }
            let startLeft = this.calcLeftWidth(startTime, this.left, this.width, 1);
            let endLeft = this.calcLeftWidth(endTime, this.left, this.width, 2);
            let nowLeft = this.calcLeftWidth(new Date(), this.left, this.width, 1);
            let endRight = this.contentWidth - endLeft;
            if (endLeft == startLeft) {
                let tempFullDate = this.calcPercent(endTime);
                endLeft += +(this.width * (1/tempFullDate)).toFixed(2);
            }
            if (endTime <= time || startTime >= time) {
                tempWidth = endLeft - startLeft;
                if (endTime <= time) {
                    data[i]['endLeft'] = startLeft + 'px';
                    data[i]['endWidth'] = tempWidth + 'px';
                } else {
                    data[i]['futureLeft'] = startLeft + 'px';
                    data[i]['futureWidth'] = tempWidth + 'px';
                }
            } else {
                if (nowLeft == startLeft) {
                    let tempFullDate = this.calcPercent(nowTime);
                    nowLeft = nowLeft + +((this.width * (1/tempFullDate)).toFixed(2))
                }
                data[i]['endLeft'] = startLeft + 'px';
                data[i]['endWidth'] = nowLeft - startLeft + 'px';
                data[i]['futureLeft'] = nowLeft + 'px';
                data[i]['futureWidth'] = endLeft - nowLeft + 'px';
            }
            if (endRight > 245) {
                data[i]['tipLeft'] = endLeft + 14 + 'px';
                data[i]['left'] = true;
            } else {
                data[i]['tipLeft'] = startLeft - 242 + 'px';
                data[i]['left'] = false;
            }
            data[i]['tipShow'] = false;
        }
    }

    //获取当前月份有多天
    calcPercent(time: any) {
        let tempTime = new Date(time);
        let curMonth = tempTime.getMonth();
        let curDate = tempTime.getDate();
        if (curDate == 31) {
            return curDate;
        } else {
            tempTime.setMonth(curMonth + 1);
            tempTime.setDate(0);
            return tempTime.getDate();
        }
    }

    //获取日期到距离左边的距离  type 1 计算开始时间  2计算结束时间
    calcLeftWidth(time: any, left: number, tableWidth: number, type: number): number {
        let tempTime = new Date(time);
        let date = tempTime.getDate();
        let month = tempTime.getMonth() + 1;        //获取月份 因为这里的是从0开始所以需要+1
        let count = this.monthList.indexOf(month);  //获取当前月份 前面还有多少个月份
        let fullDate = this.calcPercent(time);      //获取当前月份天数
        let data;
        if (type === 1) {
            if (date == 1) {
                data = document.getElementsByClassName('content-table')[count]['offsetLeft'];
            } else {
                data = left + tableWidth * count + (+(tableWidth * ((date - 1)/fullDate)).toFixed(2));
            }
        } else if (type === 2) {
            //当时间为一个月最后一天时 直接获取下个div到table最左边距 如果是最后一个月的话 直接获取整个table的宽度
            if (date == fullDate) {
                if (count == 11) {
                    data = document.getElementsByClassName('table-title')[0]['offsetWidth'];
                } else {
                    data = document.getElementsByClassName('content-table')[count + 1]['offsetLeft'];
                }
            } else {
                data = left + tableWidth * count + (+(tableWidth * ((date)/fullDate)).toFixed(2));
            }
        }
        return data;
    } 

    //跳转详情页
    detail(id: number){
        let that = this;
        //跳转详情页现在和创建页面一样 需要通过参数来判断是创建还是详情页 参数未加
        this.router.navigate(['/marketing', id]);
        this.changeLoading.emit(true);
    }

    //跳转报告页
    report(id: number) {
        //跳转营销效果报告 需要通过参数来让页面知道是哪个活动 参数未加
        //感觉需要加loading
        this.router.navigate(['/marketing/report', id]);
        this.changeLoading.emit(true);
    }

    //时间轴向前推一个月
    beforeMonth() {
        let tempMonth = this.monthList.pop();
        let tempYear = this.yearList[0].year;
        if(tempMonth == 12){
            this.yearList[0].count--;
            this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`
            let json = {
                year: tempYear - 1,
                count: 1,
                width: `calc(((100% - 347px)/12) * 1)`
            };
            this.yearList.unshift(json);
        } else if (tempMonth == 1) {
            this.yearList.pop();
            this.yearList[0].count = 12;
            this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`
        } else {
            this.yearList[0].count++;
            this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`
            this.yearList[1].count--;
            this.yearList[1].width = `calc(((100% - 347px)/12) * ${this.yearList[1].count})`
        }
        this.monthList.unshift(tempMonth);
        this.queryParams.startTimeLong = new Date((moment().set({'year': this.yearList[0].year, 'month': this.monthList[0] - 1}).startOf('month')).toString()).getTime();
        this.queryParams.endTimeLong = new Date((moment().set({'year': this.yearList[this.yearList.length - 1].year, 'month': this.monthList[11] - 1}).endOf('month')).toString()).getTime();
        this.campaignList = [];
        this.queryParams.page = 1;
        this.queryCampaigns(this.queryParams);
    }
    
    //时间轴向后推一个月
    afterMonth() {
        let tempMonth = this.monthList.shift();
        let tempYear = this.yearList[0].year;
        if (tempMonth == 1) {
            this.yearList[0].count--;
            this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`
            let json = {
                year: tempYear + 1,
                count: 1,
                width: `calc(((100% - 347px)/12) * 1)`
            };
            this.yearList.push(json);
        } else if (tempMonth == 12) {
            this.yearList.shift();
            this.yearList[0].count = 12;
            this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`
        } else {
            this.yearList[0].count--;
            this.yearList[0].width = `calc(((100% - 347px)/12) * ${this.yearList[0].count})`
            this.yearList[1].count++;
            this.yearList[1].width = `calc(((100% - 347px)/12) * ${this.yearList[1].count})`
        }
        this.monthList.push(tempMonth);
        this.queryParams.startTimeLong = new Date((moment().set({'year': this.yearList[0].year, 'month': this.monthList[0] - 1}).startOf('month')).toString()).getTime();
        this.queryParams.endTimeLong = new Date((moment().set({'year': this.yearList[this.yearList.length - 1].year, 'month': this.monthList[11] - 1}).endOf('month')).toString()).getTime();
        this.campaignList = [];
        this.queryParams.page = 1;
        this.queryCampaigns(this.queryParams);
    }

    //获取营销活动
    queryCampaigns(queryParam: any) {
        let that = this;
        that.isLoading = true;
        that.campaignResourceService.query(queryParam)
        .then((data: any) => {
            if(data && (data.retCode || data.msgDes)) {
                let err = that.errorHandlingService.getMsg(data);
                that.errorMessage.emit(err.message);
                return;
            }
            if (!data.data || data.data.length === 0) {
                return;
            }
            that.campaignList = that.campaignList.concat(data.data);
            that.count = data.total;
            setTimeout(function () {
                that.calcTime(that.campaignList);
                ps.update(that.content);
                that.isLoading = false;
            }, 100);
        }).catch(err => {
            let error = that.errorHandlingService.getMsg(err);
            that.errorMessage.emit(error.message);
        });
    }
}