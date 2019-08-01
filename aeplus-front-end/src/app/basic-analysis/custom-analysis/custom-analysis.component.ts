import {Component, Injector, OnInit, OnChanges} from '@angular/core';
import {CustomAnalysisService} from './custom-analysis.service';
import {saveMessage} from '../../utils/post-message';
import {BaseComponent} from '../../common/base-component';

@Component({
    selector: 'app-custom-analysis',
    templateUrl: './custom-analysis.component.html',
    styleUrls: ['./custom-analysis.component.less'],
    providers: [CustomAnalysisService]
})
export class CustomAnalysisComponent extends BaseComponent implements OnInit, OnChanges {

    reportId: number; // 报表id
    isVisible = false; // 弹框显示变量
    dialogType: string; // 弹窗类型

    dialogName = '创建报表'; // 弹框名称
    dialogWidth = '378px'; // 弹框宽度

    searchName: string; // 查询的名称

    reportList: any = []; // 报表列表

    reportUrl: any; // 报表配置url

    constructor(private customAnalysisService: CustomAnalysisService,
                private injector: Injector) {

        super(injector);
        this.initRouterList('自定义分析');

    }

    ngOnInit() {

        this.reportUrl = localStorage.getItem('analytics_custom_report_url');

        this.getReportList();
    }

    onSearch(event: any) {
        this.getReportList();
    }

    /**
     * 获取报表列表
     */
    getReportList() {
        const that = this;
        const queryParam = {
            rows: 1000, // 查询全部
            productId: that.productId
        };
        if (this.searchName) {
            queryParam['name'] = this.searchName;
        }
        this.customAnalysisService.getList(queryParam).subscribe(data => {
            this.reportList = data['list'];
            if (this.reportList) {
                this.reportList.forEach(element => {
                    // 保存一份报表名称
                    element['beforName'] = element['name'];
                    element['isEditName'] = false;
                });
            }
        });
    }

    /**
     * 添加报表
     */
    addReport() {
        this.dialogName = '创建报表';
        this.dialogWidth = '378px'; // 保真图的宽度
        this.isVisible = true;
        this.dialogType = 'addReport';
    }

    /**
     * 分享报表
     */
    share(report: any, index: number) {
        this.reportId = report['reportId'];
        this.dialogName = '分享到业务概览';
        this.dialogWidth = '910px'; // 保真图的宽度
        this.isVisible = true;
        this.dialogType = 'shareReport';
    }

    /**
     * 取消分享
     */
    cancelShare(report: any, index: number) {
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: '确定要取消分享？',
            nzOnOk: () => {
                this.customAnalysisService.cancelReportToUser(report['reportId']).subscribe(data => {
                    this.getReportList();
                });
            }
        });
    }

    /**
     * 修改分享
     */
    editShare(report: any, index: number) {
        this.dialogName = '分享到业务概览';
        this.dialogWidth = '910px'; // 保真图的宽度
        this.isVisible = true;
        this.dialogType = 'shareReport';
        this.reportId = report['reportId'];
    }

    /**
     * 删除报表
     * @param data
     * @param index
     */
    deleteReport(data: any, index: number) {
        this.modalService.confirm({
            nzTitle: '提示',
            nzContent: `确定要删除报表"${data['name']}"？`,
            nzIconType: 'anticon anticon-warning',
            nzOnOk: () => {
                this.customAnalysisService.deleteReport({id: data['id']}).subscribe((result: any) => {
                    this.reportList.splice(index, 1);
                });
            }
        });
    }

    /**
     * 修改名称
     */
    toEditName(index: number) {
        this.reportList[index]['isEditName'] = true;
    }

    /**
     * 修改报表
     */
    toEditReport(data: any) {
        const that = this;
        const aepUrl = window.location.origin + `/aeplus/#/basic-analysis/custom-analysis`;

        const json = {
            customReport: {
                url: aepUrl,
                header: [
                    {name: '自定义分析', url: aepUrl},
                    {name: data.name, url: ''}
                ],
                reportId: data['reportId']
            },
            cache: true
        };
        saveMessage('customReport', json);

        const src = that.reportUrl + '/report-mop/#/report-detail-mop/' + data.reportId;
        const token = localStorage.getItem('token');
        const product_id = localStorage.getItem('productId');
        const param = '?product_id=' + product_id + '&token=' + token;
        this.commonService.goReportPage(src + param, aepUrl);
//        window.location.href = src + param;
    }

    /**
     * 修改报表名称
     * @param data 报表对象
     * @param index
     */
    editName(data: any, index: number) {
        const that = this;
        this.reportList[index]['isEditName'] = false;
        // TODO请求
        const param = {
            id: data['id'],
            name: data['name'],
            productId: that.productId
        };
        this.customAnalysisService.checkName(param).subscribe((result: any) => {
            if (result.success) {
                this.customAnalysisService.updateReport(param).subscribe();
            } else {
                this.reportList[index]['name'] = this.reportList[index]['beforName'];
                this.notification.create('warning', '错误提示', result.msg);
            }
        });
    }

    /**
     * 取消修改
     * @param index
     */
    cancelEdit(index: number) {
        this.reportList[index]['isEditName'] = false;
        this.reportList[index]['name'] = this.reportList[index]['beforName'];
    }

    handleCancel(): void {
        this.isVisible = false;
        this.globals.resetBodyStyle();
    }

    cancelModal() {
        this.isVisible = false;
        this.globals.resetBodyStyle();
        this.getReportList();
    }

    /**
     * 关闭创建报表弹框
     * 为true 是 创建成功后关闭；false 是 未创建就关闭
     */
    closeSaveModel(event: boolean) {
        if (event) {
            this.getReportList();
        }
        this.isVisible = false;
        this.globals.resetBodyStyle();
    }

}
