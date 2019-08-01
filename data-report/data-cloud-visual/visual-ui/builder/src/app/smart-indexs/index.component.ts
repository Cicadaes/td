import { StageService } from './../smart-reports/services/stage.service';
import { StageResourceService } from './../smart-reports/services/stage-service/stage.resource.service';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";


@Component({
	selector: 'index',
	templateUrl: 'index.component.html'
})

export class SmartIndexComponent implements OnInit {
	config: any = {
		status: 1,
		data: {
			backUrl: '',
			reportName:'我的报表',
			reportId: 0
		}
	}
	constructor(private activatedRoute: ActivatedRoute) {

	}

	ngOnInit() {
		this.activatedRoute.params.subscribe(
			(data:any) => {
				this.config.data.reportId =  data.reportID;
			});

	}
}