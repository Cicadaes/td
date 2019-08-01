import { StageService } from './../services/stage.service';
import { StageResourceService } from './../services/stage-service/stage.resource.service';
import { ChartsPreviewService } from './../services/preview-service/preview.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'preview-reports',
	templateUrl: 'preview.component.html',
})

export class PreviewComponent implements OnInit {
	@Input() config: any
	@Input() jsonpath:string
	constructor(private chartsPreviewService: ChartsPreviewService,
				private stageService: StageService,
				private stageResourceService: StageResourceService) {
		this.stageResourceService.jsonPath = this.jsonpath;
	}

	ngOnInit() {
		this.stageService.backUrl = this.config.data.backUrl || '/';
		this.stageResourceService.get(this.config.data.reportId).then((d: any) => {
			console.log('get-preview-data:', d);
			this.stageService.initStage(d);
			this.stageService.StageInstance.preViewModel = true;
		});
	}
}