import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';
import { CRUDService } from "../../service/crud.service";
import { RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
export interface IChartConfig {
    chartData: any,
    chartSettings: any
}

export interface IChartOptions {
    scopeID: string,
    type: string,
    data?: IChartConfig,
}

@Injectable()
export class ReportDetailTitleService extends CRUDService {

    constructor(
        public http: Http,
        private route: ActivatedRoute,
    ) {
        super(http);
        this.getRouter = "reports/allInfo";//详情页面
        this.chartRouter = "reports/all_info";//修改
    }

    // 监听是否修改图表数据
    private grabbleSource = new Subject<any>();

    missionGrabble$ = this.grabbleSource.asObservable();

    updateChart(value: any) {
        this.grabbleSource.next(value);
    }

    //该service用于传递chart图表配置信息
    private missionChartDefinitionSource = new Subject<IChartOptions>();
    private missionChartConfigSource = new Subject<IChartOptions>();

    missionChartDefinition$ = this.missionChartDefinitionSource.asObservable();
    missionChartConfig$ = this.missionChartConfigSource.asObservable();

    chartConfigMission(conf: IChartOptions) {
        this.missionChartConfigSource.next(conf);
    }

    chartDefinitionMission(conf: IChartOptions) {
        this.missionChartDefinitionSource.next(conf);
    }

    // 初始化数据
    private initData = new Subject<any>();

    missioninitData$ = this.initData.asObservable();

    initdata(data: any) {
        this.initData.next(data);
    }

    // 监听预览状态
    private switchStatus = new Subject<any>();

    missionswitchstatus$ = this.switchStatus.asObservable();

    switchChange(value: any) {
        this.switchStatus.next(value);
    }

    // 监听保存
    private isSave = new Subject<any>();

    missiontoSave$ = this.isSave.asObservable();

    toSave(data: any) {
        this.isSave.next(data);
    }

    //  监听翻页
    private pageChange = new Subject<any>();

    missionpageChange$ = this.pageChange.asObservable();

    pagesChange(pageNum: any) {
        this.pageChange.next(pageNum);
    }

    //  监听重命名
    private pageName = new Subject<any>();

    missionPageName$ = this.pageName.asObservable();

    pageNameChange(page: any) {
        this.pageName.next(page);
    }

    //  监听删除页
    private removePage = new Subject<any>();

    missionRemovePage$ = this.removePage.asObservable();

    removePageChange(page: any, changePage:any) {
        this.removePage.next({
            pageNum:page,
            changePage:changePage
        });
    }

    //  保存成功-回显翻页
    private SAVEOK = new Subject<any>();

    missionsaveOK$ = this.SAVEOK.asObservable();

    saveOK(data: any) {
        this.SAVEOK.next(data);
    }

}