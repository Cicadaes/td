import { Injectable } from "@angular/core";
import { Subject } from 'rxjs/Subject';

import { Http } from '@angular/http';
import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { dictionary } from '../../../config/config.dictionary';

@Injectable()
export class MetadataCommunicationService {

    typeList: any;//元数据类型
    datasourceTypeList: any;//数据源类型
    statusList: any;//元数据对象状态

    constructor(){
        this.typeList = dictionary.metaObjectTypeSearch;
        this.datasourceTypeList = dictionary.dataSourceTypeSearch;
        this.statusList = dictionary.statusSearch;
    }

    private missionSearchMetaList = new Subject<any>();//查询列表

    missionSearchMetaList$ = this.missionSearchMetaList.asObservable();

    searchMetaListMission(data: any) {
        this.missionSearchMetaList.next(data);
    }

}