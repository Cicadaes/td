import { Component, OnInit, OnDestroy } from '@angular/core';
import { MetadataService } from './metadata-list.service';
import { MetadataCommunicationService } from '../metadata.service';
import { dictionary } from '../../../../config/config.dictionary';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';

@Component({
    selector: 'metadata-list',
    templateUrl: './metadata-list.component.html',
    styleUrls: ['./metadata-list.component.less'],
    providers: [MetadataService]
})
export class MetadataListComponent implements OnInit, OnDestroy {

    metadataList: any = [];//列表数据

    totalCount: number;//总条数

    queryParam: any = {
        page: 1,
        pageSize: 10
    };//查询条件


    constructor(
        private metadataService: MetadataService,
        private metadataCommunicationService: MetadataCommunicationService,
        private _notification: CmNotificationService
    ){
        metadataCommunicationService.missionSearchMetaList$.subscribe(data => {
            this.queryParam = data;
            this.queryParam["page"] = 1;
            this.queryParam["pageSize"] = 10;
            this.queryMetadataList();
        })
    }

    ngOnInit() {
        this.queryMetadataList();
    }

    ngOnDestroy() {

    }

    /**
     * 点击分页时触发
     * @param event 
     */
    changePage(event: any){
        this.queryParam.page = event;
        this.queryMetadataList();
    }

    /**
     * 点击一页显示多少条数据时触发
     * @param event 
     */
    changePageSize(event: any){
        this.queryParam.pageSize = event;
        this.queryMetadataList();
    }

    /**
     * 查询元数据列表
     * @param param 
     */
    queryMetadataList(){
        this.metadataService.query(this.formatParamForLike(this.queryParam)).then(data => {
            this.totalCount = data["total"];
            this.metadataList = data["data"];
        }).catch(err => {
            this._notification.error("错误",err);
        });
    }

    /**
     * 格式化参数里需要模糊查询的字段
     * @param data 
     */
    formatParamForLike(param: any){
        let data = Object.assign({},param);
        if(data["name"]){
            data["nameOperator"] = "like";
            data["name"] = `%25${data["name"]}%25`;
        }
        if(data["dataSourceName"]){
            data["dataSourceNameOperator"] = "like";
            data["dataSourceName"] = `%25${data["dataSourceName"]}%25`;
        }
        if(data["creator"]){
            data["creatorOperator"] = "like";
            data["creator"] = `%25${data["creator"]}%25`;
        }
        if(data["createTime"]){
            data["createTime1"] = this.formatDate(data["createTime"][0]);
            data["createTime2"] = this.formatDate(Date.parse(data["createTime"][1])+(1000*60*60*24-1));
            delete data["createTime"];
        }
        data["orderBy"] = "createTime";
        data["order"] = "desc";
        return data;
    }

    /**
     * 格式化时间为yyyy-MM-dd hh:mm:ss
     * @param time 
     */
    formatDate(time: any): any {
        let year, month, day,hours,minutes,seconds;
        if (time) {
            year = new Date(time).getFullYear()
            year = year < 10 ? "0" + year : year
            month = new Date(time).getMonth() + 1
            month = month < 10 ? "0" + month : month
            day = new Date(time).getDate()
            day = day < 10 ? "0" + day : day
            hours=new Date(time).getHours()
            hours = hours < 10 ? "0" + hours : hours
            minutes=new Date(time).getMinutes()
            minutes = minutes < 10 ? "0" + minutes : minutes
            seconds=new Date(time).getSeconds()
            seconds = seconds < 10 ? "0" + seconds : seconds
            return  `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        }
    }

}