import { StageResourceService } from './services/stage-service/stage.resource.service';
import { StageService } from './services/stage.service';
import { Component, OnInit, Input } from '@angular/core';
// import '../../../public/css/smart/iconfont.css';
// import '../../../public/css/smart/smart.reports.css';

@Component({
	selector: 'smart-ng-reports',
	templateUrl: 'smart.component.html',
	styles: [`
		.smart-container dialog-data{
			position: fixed;
			z-index: 2000;
		}
	`]
})

export class SmartComponent implements OnInit {
	@Input() config: any
	@Input() jsonpath:string

	constructor(private stageService: StageService, private stageResourceService: StageResourceService) {
		this.stageResourceService.jsonPath = this.jsonpath;
	}
	ngOnInit() {
		this.stageService.backUrl = this.config.data.backUrl || '/';
		this.stageService.reportId = this.config.data.reportId;


		// let that = this;
		// this.stageResourceService.get(this.config.data.reportId).then((d: any) => {
		// 	that.stageService.initStage(d)
		// });

		let queryObj:any = {
			page: 1,
			pageSize: 100,
			order: 'asc',
			orderBy: 'id'
		}

        this.stageResourceService.queryDatasource(queryObj).then((d: any) => {
			d.data.push({id: 999, name: "无数据源"});
            this.stageService.datasourceData = this.stageService.DataSourceMetadata = d.data;
        })
	}

}