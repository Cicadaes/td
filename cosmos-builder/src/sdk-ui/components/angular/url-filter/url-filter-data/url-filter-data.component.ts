import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Component, OnInit, Input } from '@angular/core';
import { DataStore, EventEmitter, EventType } from 'cosmos-td-sdk';
import { ConfigApi } from '../../../../api/config-api';
import { GlobalParamService } from './global-param/global-param.service';
@Component({
    selector: 'url-filter-data',
    templateUrl: './url-filter-data.component.html',
    styleUrls: ['./url-filter-data.component.less'],
})
export class UrlFilterDataComponent implements OnInit {

    paramList: any = [];//参数列表

    title: any = null;//标题

    constructor(
        public configApi: ConfigApi,
        public globalParamService: GlobalParamService,
    ) {
        this.globalParamService.missionShowModal$.subscribe(data => {
			if(!data){
                let globalData = DataStore.getGlobalData();
                this.paramList = globalData["filter"];
			}
		});
    }

    ngOnInit() {
        let globalData = DataStore.getGlobalData();
        this.paramList = globalData && globalData["filter"];
        this.title = globalData && globalData['title'] && globalData['title']['name'];
    }

    /**
     * 构建参数条件，并保存
     */
    buildParamInfo() {
        let data: any[] = [];
        let obj = {
            title: {name: this.title}
        }
        DataStore.saveGlobalData(obj);
    }

    changeTitle(value: any) {
        this.buildParamInfo();
    }

    /**
     * 打开参数查看
     */
    setParam(){
        this.globalParamService.showModal(true);
    }
}

