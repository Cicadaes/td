import {debug} from 'util';
import {StageService} from './../../services/stage.service';
import {StageResourceService} from './../../services/stage-service/stage.resource.service';
import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {DatasourceBaseService} from "../../services/config-service/datasource.base.service";
import {ChartsConfigService} from "../../services/config.service";

@Component({
    selector: 'datasource-config',
    templateUrl: 'datasource-config.component.html',
    providers: [DatasourceBaseService],
    styles: [`
	
		:host/deep/ .ui-button-icon-right{
			right:25px !important;
		}
		:host/deep/ .datasource_list_layer{
			top:-40px !important;
			position:absolute !important;
		}
    

	`]
})

export class DatasourceConfigComponent implements OnInit, OnDestroy {
    dataSourceView: Array<any> = [];
    chartType: any;
    todoViewMetaData: any;
    subscription: Subscription;
    currentScopeID: any;
    viewName: any;
    viewType: any;

    constructor(private stageService: StageService,
                private stageResourceService: StageResourceService,
                private datasourceService: DatasourceBaseService,
                private chartConfigService: ChartsConfigService) {

    }

    ngOnInit() {
        let that = this;
        this.stageService.TagChangeStage$.subscribe((d: any) => {
            if (d.scopeID === this.stageService.chartScopeId) {
                return
            }
            this.chartType = this.stageService.chartType = d.type;
        });

        this.stageService.TagChangeStage$.subscribe((d: any) => {
            that.currentScopeID = d.scopeID;
            that.viewType = d.type;
            that.viewName = d.viewName;

            if (that.stageService.DataSourceViewCurrent) {
                that.dataSourceView = that.stageService.DataSourceViewCurrent;
                if (that.stageService.DataSourceMetadata && that.stageService.DataSourceMetadata.length > 0) {
                    that.dataSourceView[0].fields[0].optionValues = that.stageService.DataSourceMetadata;
                }
            }
        });

    }

    onDataSourceRender(e: any) {
        this.handlerDataChange(e);
    }

    //改变数据
    onRender(e: any) {
        // if (e.tconfig.code == "dataSource" && e.tconfig.viewMetaData !== null) {
        //     this.handlerDataChange(e);
        // }
    }

    todoPostEvent(viewMetaData: any, e?: any) {

        let postEvent: Array<any>
        if (Object.prototype.toString.call(viewMetaData.postEvent) === '[object Object]') {
            postEvent = viewMetaData.postEvent.postEvent.split('|');
            this.todoViewMetaData = viewMetaData.postEvent

        } else if (Object.prototype.toString.call(viewMetaData.postEvent) === '[object String]') {
            postEvent = viewMetaData.postEvent.split('|');
            this.todoViewMetaData = viewMetaData

        }

        if (postEvent.length) {
            postEvent.forEach((item: any) => {
                let _item = item.trim(), that = this;

                switch (_item) {
                    case 'datasource-reload':
                        that.stageService.updateReportDataSourceConfig(e.value.name, () => {
                            that.dataSourceView = that.stageService.DataSourceViewCurrent;
                        });
                        break;
                    case 'datasource-render':

                        break;
                    case 'metadata-render':

                        break;
                }
            })
        }

    }

    handlerPostEvent(viewMetaData: any, e: any) {
        if (viewMetaData.action === 'callBack') {
            this.todoPostEvent(viewMetaData, e)

        } else if (viewMetaData.action === 'event') {

        }

    }

    handlerDataChange(e: any) {
        let tconfig;
        if (e.tconfig) {
            tconfig = e.tconfig
        } else {
            tconfig = e

        }

        this.handlerPostEvent(tconfig.viewMetaData, e)

    }

    ngOnDestroy() {
        this.subscription && (this.subscription.unsubscribe())
    }

}