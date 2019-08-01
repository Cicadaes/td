import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignResourceService } from './../../../../services/campaign/campaign.resource.service';
import * as moment from "moment";
import { ErrorHandlingService } from "../../../../services/exceptional/error-handling.service";

@Component({
    selector: 'new-campaign',
    templateUrl: 'new-campaign.component.html',
    styleUrls: ['new-campaign.component.css'],
    providers: [CampaignResourceService]
})

export class NewCampaignComponent {

    private show: boolean;

    campagin: any = {};

    warnTip: any = '';
    warnShow: boolean = false; //名称提示
    desWarnShow: boolean = false;//描述提示
    //一天
    oneDay: number = 1 * 24 * 60 * 60 * 1000;
    isDisabled: boolean = false;     //确定按钮是否禁用

    @Input()
    set showNewMarketingDialog(bl: boolean) {
        this.show = bl;
    }

    @Output() hideNewMarketing = new EventEmitter<boolean>();

    @Output() errorMessage = new EventEmitter<any>();

    @Input()
    set cloneId(campaginId: number) {
        this.cloneCampaginId = campaginId;
    }

    cloneCampaginId: number;//克隆的活动ID

    marketingValue: any = {
        showIcon: true,
        ranges: [{
            label: '今天', day: 1
        },
        {
            label: '最近七天', day: 7
        },
        {
            label: '最近一个月', day: 30
        },
        {
            label: '季度', day: 90
        }],
        dateRanges: { max: null, min: new Date(moment().startOf('day').valueOf() + 3600000 * 24) },
        data: { start: new Date(moment().startOf('day').valueOf() + this.oneDay) }
    };

    constructor(
        private campaginService: CampaignResourceService,
        public router: Router,
        public errorHandlingService: ErrorHandlingService
    ) {
    }

    onSelect(date: any) {
        if (date.start) {
            this.campagin.startTime = date.start;
        }
        if (date.end) {
            this.campagin.endTime = date.end;
        }
    }

    afterHide() {
        this.hideNewMarketing.emit(this.show);
        this.campagin.name = '';
        this.campagin.description = '';
        this.marketingValue.data.start = new Date(moment().startOf('day').valueOf() + this.oneDay);
        this.marketingValue.data.end = '';
        this.warnShow = false;
        this.desWarnShow = false;
    }

    createCampagin() {
        let that = this;
        if (!that.campagin.name) {
            that.warnTip = '请填写活动名称';
            that.warnShow = true;
            return;
        }
        if (that.campagin.name.trim().length == 0) {
            that.warnTip = '活动名称不能都是空格';
            that.warnShow = true;
            return;
        } else {
            that.campagin.name = that.campagin.name.trim();
        }
        if (that.campagin.name.length > 26) {
            that.warnTip = '活动名称不能超过26个中文字符';
            that.warnShow = true;
        } else if (that.campagin.description && that.campagin.description.length > 80) {
            that.desWarnShow = true;
        } else {
            that.warnShow = false;
            that.desWarnShow = false;
            that.campagin.status = 1;
            if (!that.campagin.startTime) {//创建活动前，未触发时间插件
                that.campagin.startTime = moment(that.marketingValue.data.start).startOf('day').valueOf();
                that.campagin.endTime = moment(that.marketingValue.data.start).endOf('day').valueOf();
            }
            if (!that.campagin.endTime) {
                that.campagin.endTime = moment(that.marketingValue.data.start).endOf('day').valueOf();
            };
            that.isDisabled = true;
            if (that.cloneCampaginId) {
                that.campaginService.clone(that.cloneCampaginId, that.campagin)
                    .then((data: any) => {
                        if (data && (data.retCode || data.msgDes)) {
                            let err = that.errorHandlingService.getMsg(data);
                            if (err.code === 1) {
                                that.errorMessage.emit(err.message);
                                that.isDisabled = false;
                            } else {
                                that.warnTip = err.message;
                                that.warnShow = true;
                                that.isDisabled = false;
                            }
                        } else {
                            that.show = false;
                            that.isDisabled = false;
                            that.afterHide();
                            //跳转到创建营销活动页面
                            that.router.navigate(['/marketing', data.id]);
                        }

                    }).catch((err: any) => { });
            } else {
                that.campaginService.create(that.campagin)
                    .then((data: any) => {
                        if (data && (data.retCode || data.msgDes)) {
                            let err = that.errorHandlingService.getMsg(data);
                            if (err.code === 1) {
                                that.errorMessage.emit(err.message);
                                that.isDisabled = false;
                            } else {
                                that.warnTip = err.message;
                                that.warnShow = true;
                                that.isDisabled = false;
                            }
                        } else {
                            that.show = false;
                            that.isDisabled = false;
                            that.afterHide();
                            //跳转到创建营销活动页面
                            that.router.navigate(['/marketing', data.id]);
                        }

                    }).catch((err: any) => { });
            }
        }

    }

    //input输入校验
    inputChange() {
        if (this.campagin.name) {
            this.warnShow = false;
        }
    }
    textareaChange() {
        this.desWarnShow = false;
    }
}