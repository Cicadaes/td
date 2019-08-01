import {Component,OnInit,Input} from '@angular/core';
import {Router} from "@angular/router";
import {DatasourceCommunicationService} from "../../report-service/datasource.communication.service";
import {DatacauseCommunicationService} from "../../report-service/datacause.service";


@Component({
    selector:'report-detial',
    templateUrl:'report-detail.component.html',
    styles: [`
        .datasource_detail{
            line-height: 30px;
            padding: 0 24px;
            margin-bottom: 20px;
        }
    `]
})

export class DatareportDetialComponent  implements OnInit  {
    @Input() config:any;

    searchText:string;
    dataSourceName: string;
    datareportId:any;
    datareportName:any;

    constructor(
        private communication: DatasourceCommunicationService,
        private datacauseCommunicationService: DatacauseCommunicationService,
        private router: Router){

    }

    ngOnInit() {
        let getDataName = this.router.url.substring(this.router.url.lastIndexOf('/') + 1);
        let getArr = getDataName.split("?");
        this.dataSourceName =decodeURI( getArr[0]);
        this.datareportId = this.router.url.substring(this.router.url.lastIndexOf("=") + 1);
        console.log(this.dataSourceName)
        this.getdataSource();
    }

    reportListRouter(){
        this.router.navigateByUrl(this.config.url)
    }

    addDataSourceDialog(project:any){
        this.datacauseCommunicationService.addLayerMission(this.datareportId);
    }

    getdataSource(){
        this.communication.querydataspec(this.datareportId).then(res => {
            console.log(res)
            this.datareportName = res;

        }).catch(err => {
            console.log(err)
        })
    }

}