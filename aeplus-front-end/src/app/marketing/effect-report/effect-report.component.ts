import {Component, OnInit, Injector, OnChanges} from '@angular/core';
import {EffectReportService} from './effect-report.service';
import {BaseComponent} from '../../common/base-component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-effect-report',
    templateUrl: './effect-report.component.html',
    styleUrls: ['./effect-report.component.less']
})
export class EffectReportComponent extends BaseComponent implements OnInit, OnChanges {

    campaignId: number;
    campaignInfo: any = {};
    showType: number = 1;

    isVisible = false;
    modalTitle = '添加报表';
    reportTableLoading: boolean;       // 表的loading
    selectReportId: any;               // 选中的报表模板id
    reportTemplateList: any[] = [];    // 报表模板列表
    reportName: string;                // 报表名称
    reportTemplateTotal: number;       // 报表数量
    pageIndex = 1;                     // 当前页码
    pageSize = 10;                     // 显示长度
    src: string;                       // iframe嵌入的链接
    reportDefaultUrl: string;          // 报表的url
    lstFormId: string;                 // 上次保存的报表id

    tabs: any = [];                    // 配置后的报表列表
    iframeUrl: string;                 // url
    showIframe: boolean;

    constructor(private effectReportService: EffectReportService,
                private domSanitizer: DomSanitizer,
                private injector: Injector) {

        super(injector);
        const campaignId = this.route.snapshot.params['campaignId'];
        if (campaignId) {
            this.campaignId = parseInt(campaignId);
        }

    }

    async ngOnInit() {
        this.reportDefaultUrl = localStorage.getItem('user_group_report_url');
        await this.getCampaignInfo();
        this.getConfigReportList();
    }

    /**
     * 获取活动详情
     */
    getCampaignInfo() {
        return new Promise((resolve, reject) => {
            this.effectReportService.getCampaignInfo(this.campaignId).subscribe(data => {
                if (data.code != 200) {
                    this.notification.create('warning', '错误提示', data.message);
                    reject();
                }
                this.campaignInfo = data['data'];
                resolve();
            });
        });
    }

    /**
     * 创建报表弹框
     */
    createDialogShow() {
        this.isVisible = true;
        this.reportTableLoading = true;
        this.getReportTemplateList();
    }

    /**
     * 获取报表列表模板数据
     */
    getReportTemplateList() {
        const that = this;
        const params = {
            page: that.pageIndex,
            pageSize: that.pageSize
        };
        if (that.reportName) {
            params['name'] = that.reportName;
        }
        that.effectReportService.getTemplates(params).subscribe(data => {
            that.reportTableLoading = false;
            if (data.code === 200) {
                that.reportTemplateList = data.data['data'];
                that.reportTemplateTotal = data.data['total'];
            }
        }, err => {
            console.log('err===', err);
        });
    }

    /**
     * 获取配置的报表列表
     */
    getConfigReportList() {
        const that = this;
        that.effectReportService.getSavedReport(this.campaignId).subscribe(data => {
            that.tabs = [];
            if (data.code === 200) {
                const list = data['data']['data'];
                list.forEach(element => {
                    element['src'] = that.domSanitizer.bypassSecurityTrustResourceUrl(
                        that.reportDefaultUrl + `/report/#/publish/${element.formId}`
                        + `?campaignId=${that.campaignId}&tenantId=${that.campaignInfo['tenantId']}`
                        + `&startDate=${that.campaignInfo['startTime'].substring(0, 10)}&endDate=${that.campaignInfo['endTime'].substring(0, 10)}`
                        + '&product_id=' + that.productId + '&token=' + localStorage.getItem('token')
                    );
                    if(element['formId'] === parseInt(that.lstFormId)){
                        that.iframeUrl = element['src'];
                        this.showIframe = false;
                        this.showType = 3;
                        setTimeout(() => {
                            this.showIframe = true;
                        }, 1);
                    }
                });
                that.tabs = list;
            }
        });
    }

    /**
     * 分页组件切换列表
     */
    changeReportPage(params: any) {
        const that = this;
        that.reportTableLoading = true;
        that.getReportTemplateList();
    }

    /**
     * 根据报表名称搜索
     */
    fliterReport(event: any) {
        const that = this;
        if (event.keyCode === 13) {
            that.reportTableLoading = true;
            that.getReportTemplateList();
        }
    }

    /**
     * 保存选中的报表
     */
    selectReport() {
        const that = this;
        const json = {
            campaignId: that.campaignId,
            formId: that.selectReportId,
        };
        that.effectReportService.saveSelectReport(json).subscribe((data: any) => {
            if (data.code != 200) {
                this.notification.create('warning', '错误提示', data.message);
                return;
            }
            that.lstFormId = json.formId;
            that.getConfigReportList();
            that.hideReportDialog();
            setTimeout(() => {
                // that.src = `${that.reportDefaultUrl}/#/publish/${data.formId}?campaignId=${that.campaignId}&tenantId=${that.campaignInfo.tenantId}&startDate=${startDate}&endDate=${endDate}`;
                that.src = `${that.reportDefaultUrl}/#/publish/${data.formId}?campaignId=${that.campaignId}`;
                that.setIframeHeight();
            }, 0);
        });
    }

    /**
     * 关闭弹窗
     */
    hideReportDialog() {
        this.isVisible = false;
        this.reportName = '';
        this.selectReportId = null;
    }

    /**
     * 设置效果分析ifram高度
     */
    setIframeHeight() {
        let tempHeight = document.body.offsetHeight - 65;  // 减去header的高度
        tempHeight = tempHeight - 40;  // 减去灰色背景padding的宽度
        tempHeight = tempHeight - 60;  // 减去白色背景padding的宽度
        tempHeight = tempHeight - 50;  // 减去标题高度
        tempHeight = tempHeight - 35;  // 减去tableview的选项高度
        document.getElementById('tdReportIframe') && (document.getElementById('tdReportIframe').style.height = `${tempHeight}px`);
    }

    /**
     * 删除配置的报表
     * @param tab
     */
    closeTab(tab: any, e: any) {
        e.stopPropagation();
        const that = this;
        that.modalService.confirm({
            nzTitle: '提示',
            nzContent: `确定要删除报表"${tab.name}"？`,
            nzOnOk: () => {
                if(that.showType > 2 && tab.src === that.iframeUrl){
                    that.clcikTab(1);
                }
                that.effectReportService.deleteSavedReport(tab.id).subscribe(data => {
                    if (data.code === 200) {
                        this.notification.create('success', '提示', '操作成功');
                        that.getConfigReportList();
                    } else {
                        this.notification.create('warning', '错误提示', data.message);
                    }
                });
            }
        });
    }

    /**
     * 点击tab
     * @param type 
     */
    clcikTab(type: number){
        this.showType = type;
    }

    /**
     * 点击自定义报表的tab
     * @param tab 
     */
    clcikCustomReportTab(tab: any){
        this.showType = 3;
        this.showIframe = false;
        this.iframeUrl =tab.src;
        setTimeout(() => {
            this.showIframe = true;
        }, 1);
    }

}
