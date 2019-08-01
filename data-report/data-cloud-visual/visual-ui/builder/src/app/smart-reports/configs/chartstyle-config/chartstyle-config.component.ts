import {StageService} from './../../services/stage.service';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {DatasourceBaseService} from "../../services/config-service/datasource.base.service";

@Component({
    selector: 'chartstyle-config',
    templateUrl: 'chartstyle-config.component.html',
    providers: [DatasourceBaseService]
})

export class ChartstyleConfigComponent implements OnInit, OnDestroy {
    private dataStyleView: Array<any> = [];
    subscription: Subscription;

    constructor(private stageService: StageService) {

    }

    ngOnInit() {
        this.stageService.TagChangeStage$.subscribe((d: any) => {
            if (d.scopeID === this.stageService.chartScopeId) {
                this.dataStyleView = this.stageService.StyleViewCurrent;
                return;
            }
            this.stageService.chartScopeId = d.scopeID;
            if (this.stageService.StyleViewCurrent) {
                this.dataStyleView = this.stageService.StyleViewCurrent;
            }

        });

        //clear event
        this.subscription = this.stageService.ConfigsControl$.subscribe((data: any) => {
            this.stageService.chartScopeId = "";
            this.dataStyleView = []
        })
    }

    //unused
    onRender(e: any) {
        //collect style change data
        Object.assign(this.stageService._exist.chart.style.data, e);
        //trigger change
        this.stageService.triggerChange(1, {scopeID: this.stageService.chartScopeId, result: e});

    }

    setAxisName(e: any) {
        for (let key in e) {
            if (key == "yAxis_name" && e['yAxis_name'] == true) {
                e[key] = this.stageService.yAxisName.toString();
            }
            if (key == "xAxis_name" && e['xAxis_name'] == true) {
                e[key] = this.stageService.xAxisName.toString();
            }
        }
    }

    ngOnDestroy() {
        this.subscription && (this.subscription.unsubscribe())
    }

}