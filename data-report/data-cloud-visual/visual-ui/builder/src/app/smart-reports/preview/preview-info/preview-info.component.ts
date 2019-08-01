import { ChartsPreviewService } from './../../services/preview-service/preview.service';
import { StageService } from './../../services/stage.service';
import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {DialogData, DialogConfirm} from "../../common/dialog/dialog_data.model";
import {DialogCommunicationService} from "../../common/dialog/dialog.communication.service";


@Component({
	selector: 'preview-info',
	templateUrl: 'preview-info.component.html',
})

export class PreviewInfoComponent implements OnInit {
	pages: any;
	pageList:boolean = false;
	constructor(private stageService: StageService,
				private dialogCommunicationService: DialogCommunicationService,
				private router: Router,
				private chartsPreviewService:ChartsPreviewService) {

	}
	ngOnInit() {
		this.pages = {};
		this.pages = this.stageService.stagePages;
	}

	changePage(index: number) {
		console.log(this.pages)
		if (index === this.pages.current) {
			return
		}

		//cache stage base data, merge old page data
		this.stageService.clearReportConfigs();

		this.pages.currentIndex = this.pages.current = index;
		let resultData = this.stageService.getStagePageChangeData(index);

		if(resultData.components.length < 1){
			this.stageService.stageDataBoolean = true;
		}else{
			this.stageService.stageDataBoolean = false;
		}
		//review
		this.stageService.StageInstance.changePage(resultData)

		this.pageList = false;
	}

	deleteEditBoolean(){
		let stageData = this.stageService.StageBaseData;
		stageData.stages.forEach((stage: any, index: number) => {
			delete stage.editbool
		});
	}

	returnReport(){	
		
		 this.deleteEditBoolean();
		let returnMd5 = this.stageService.getDataMd5(JSON.stringify(this.stageService.StageBaseData));

		console.log(this.stageService.chartMd5,"===",returnMd5)

		console.log(this.stageService.StageBaseData)

		if(this.stageService.chartMd5 !== returnMd5){
			let dialog = new DialogData();
			dialog.icon = "jinggao";
			dialog.title = "离开当前报表";
			dialog.content = `确定离开当前报表？如有更新，离开当前页面前请确保执行了保存操作`;
			let confirm: DialogConfirm = new DialogConfirm();
			confirm.onConfirm = () => {
				this.router.navigateByUrl("/" + process.env.DIST + '/datareport/reportList');		
			};
			dialog.confirms.push(confirm);
			this.dialogCommunicationService.showDialog(dialog)
		}else{
			this.router.navigateByUrl("/" + process.env.DIST + '/datareport/reportList');
		}
	}

	smartPages(e:any){
		this.pageList = true;
	}
}