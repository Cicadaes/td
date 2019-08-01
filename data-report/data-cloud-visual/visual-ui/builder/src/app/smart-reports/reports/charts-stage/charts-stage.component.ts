import { Component, OnInit } from '@angular/core';
import { StageResourceService } from '../..//services/stage-service/stage.resource.service';
import { StageService } from './../../services/stage.service';

@Component({
	selector: 'charts-stage',
	templateUrl: 'charts-stage.component.html',
	styles:[`
	:host/deep/ .smart-stagedata-pic{
		pointer-events: none !important;
		}
    `]
})

export class ChartsStageComponent implements OnInit {
	public dataStyleView: any = { data: [], container: {} };
	public stageDataPic:boolean = true;

	constructor(private stageService: StageService, private stageResourceService: StageResourceService) {
		this.stageService.DragChart$.subscribe((b:any)=>{
			if(b){
				this.stageDataPic = true
			}else{
				this.stageDataPic = false
			}

		})
	}
	ngOnInit() {
		this.stageService.StageInstance.createStage('.stage');
		this.stageService.StageInstance.getParameter({
			getFilterMethod:"old"
		});

		let that = this;
		this.stageResourceService.get(this.stageService.reportId).then((d: any) => {
			that.stageService.initStage(d)

		});
	}


}