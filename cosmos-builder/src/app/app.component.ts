import { Component } from '@angular/core';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { AppService } from './app.service';
import { CRUDService } from './service/crud.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.less']
})
export class AppComponent {

	constructor(private nofication: CmNotificationService,
		private appService: AppService) {
		

		let params = CRUDService.that.getUrlParams();
		if (params['token']) {
			sessionStorage.setItem('x-client-token', params['token']);
		} 

		let param = {
			modelCode: "appbuilder",
			key: "component.url"
		}
		appService.queryParam(param).then(data => {
			if ("200" == data["status"] && data["_body"]) {
				appService.globalUrlIp = data["_body"];
			}
		}).catch(err => {
			console.log("获取参数系统appbuilder参数失败!");
		});

	}

}
