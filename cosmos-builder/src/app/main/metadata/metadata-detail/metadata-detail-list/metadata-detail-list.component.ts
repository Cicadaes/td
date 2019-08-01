import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MetadataStep3ListService } from '../../metadata-create/metadata-step3-list/metadata-step3-list.service';

@Component({
    selector: 'metadata-detail-list',
    templateUrl: './metadata-detail-list.component.html',
    styleUrls: ['./metadata-detail-list.component.less']
})
export class MetadataDetailListComponent implements OnInit, OnDestroy {

    metaInfo: any = {};//元数据信息
    attributeList: any = [];//属性列表

    dictionaryMap: any = {};//字典

    queryParam: any = {
        page: 1,
        pageSize: 10
    };//查询条件

    @Input() set metadata(data: any){
        if(data){
            this.metaInfo = data;
            this.attributeList = data.attributes;
        }
    }//元数据详情

    constructor(private metadataStep3ListService: MetadataStep3ListService) {
        metadataStep3ListService.getDictionary().then(data => {
            this.buildDictionaryMap(data["data"]);
        }).catch(err => {});
    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    buildDictionaryMap(data: any){
        for(let i = 0;i < data.length; i++){
            this.dictionaryMap[data[i]["id"]] = data[i]["name"];
        }
    }

}