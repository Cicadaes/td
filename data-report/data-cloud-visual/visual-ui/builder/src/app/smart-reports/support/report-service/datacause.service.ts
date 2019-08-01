import {SchedulerTaskLogModel} from '../report-models/scheduler_task_log.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Message } from 'primeng/primeng';

@Injectable()
export class DatacauseCommunicationService {

    dispatcherName:any;

    private missionAddLayerShowSource = new Subject<any>();

    missionAddLayerShowSource$ = this.missionAddLayerShowSource.asObservable();

    private missionDispatchingLogConfirmedSource = new Subject<any>();
    private missionUpdateListConfirmedSource = new Subject<any>();

    // 分页和查询
    private setQueryObjSource = new Subject<any>();
    private changePageSource = new Subject<number>();

    private missionMessageSource = new Subject<any>();
    private missionShowAddDatasourceSource = new Subject<any>();
    private missionAddDatasourceAdapterSource = new Subject<any>();
    private missionShowGetSqlSyntaxSource = new Subject<any>();
    private missionAddConnectionsSource = new Subject<any>();

    private missionShowDataPrviewe = new Subject<any>();

    private missionHideAllLayerSource = new Subject<any>();
    private missionPreviewConnectionsSource = new Subject<any>();
    private missionHidePreviewSource = new Subject<any>();
    private missionHideDatasource = new Subject<any>();


    missionUpdateListConfirmed$ = this.missionUpdateListConfirmedSource.asObservable()
    setQueryObjSource$ = this.setQueryObjSource.asObservable();
    changePageSource$ = this.changePageSource.asObservable();
    missionMessage$ = this.missionMessageSource.asObservable();

    missionShowAddDatasource$ = this.missionShowAddDatasourceSource.asObservable();
    missionAddDatasourceAdapter$ = this.missionAddDatasourceAdapterSource.asObservable();

    missionShowGetSqlSyntax$ = this.missionShowGetSqlSyntaxSource.asObservable();
    missionShowDataPrviewe$ =this.missionShowDataPrviewe.asObservable()
    missionAddConnections$ = this.missionAddConnectionsSource.asObservable();
    missionHideAllLayer$ = this.missionHideAllLayerSource.asObservable();
    missionPreviewConnections$ = this.missionPreviewConnectionsSource.asObservable();

    missionHidePreview$ = this.missionHidePreviewSource.asObservable();
    missionHideDatasource$ = this.missionHideDatasource.asObservable();

    addLayerMission(data:any){
        this.missionAddLayerShowSource.next(data);
    }

    layerConfirmMission(data: SchedulerTaskLogModel) {
        this.missionDispatchingLogConfirmedSource.next(data)
    }


    setQueryObj(queryObj: any) {
        this.setQueryObjSource.next(queryObj)
    }

    changePage(newPage: number) {
        this.changePageSource.next(newPage)
    }

    addMessage(msg: Message) {
        this.missionMessageSource.next(msg);
    }

    updateList(){
        this.missionUpdateListConfirmedSource.next();
    }

    showAddDatasource(data:any){
        this.missionShowAddDatasourceSource.next(data);
    }

    addDatasourceAdapter(data:any){
        this.missionAddDatasourceAdapterSource.next(data);
    }

    addConnections(data:any){
        this.missionAddConnectionsSource.next(data);
    }

    showGetSqlSyntax(data:any){
        this.missionShowGetSqlSyntaxSource.next(data);
    }
    showDataPrview(data:any){
        this.missionShowDataPrviewe.next(data);
    }

    hideAllLayer(){
        this.missionHideAllLayerSource.next();
    }

    previewConnections(data:any){
        this.missionPreviewConnectionsSource.next(data);
    }

    hidePreview(){
        this.missionHidePreviewSource.next();
    }

    hideDatasource(){
        this.missionHideDatasource.next();
    }

}
