import { StageService } from './../../services/stage.service';
import { ChartsPreviewService } from './../../services/preview-service/preview.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'preview-stage',
	templateUrl: 'preview-stage.component.html'
})

export class PreviewStageComponent implements OnInit {

	constructor(private chartsPreviewService:ChartsPreviewService,
				private stageService: StageService) {

	}
	ngOnInit() {
		this.stageService.StageInstance.createStage('.preview-stage');
		this.stageService.StageInstance.getParameter({
			getFilterMethod:"old"
		});
	}
}