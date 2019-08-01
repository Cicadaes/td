import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MainService } from '../../main.service';
import { MetadataService } from '../metadata-list/metadata-list.service';
import { CmNotificationService } from 'ng-cosmos-td-ui/src/cosmos.module';
@Component({
    selector: 'metadata-detail',
    templateUrl: './metadata-detail.component.html',
    styleUrls: ['./metadata-detail.component.less'],
    providers: [MetadataService]
})
export class MetadataDetailComponent implements OnInit, OnDestroy {

    title:Array<any>;
    metadataId: number;

    metadata: any;//元数据详情

    constructor(
        private route:ActivatedRoute, 
        private mainService:MainService,
        private metadataService: MetadataService,
        private _notification: CmNotificationService
    ) {
        this.metadataId = this.route.params['value']['id'];
        this.title = this.route.snapshot.data['title'];
        this.title[1]['url'] = `metadata/${this.route.snapshot.url[0]['path']}/${this.metadataId}`;
    }

    ngOnInit() {
       this.changeTitle(this.title);
       this.metadataService.getMetadataForMapping(this.metadataId).then(data => {
           this.metadata = data;
       }).catch(err =>{
           this._notification.error("错误",err);
       });
    }

    ngOnDestroy() {

    }


    changeTitle(title:Array<any>){
        setTimeout(() => {
            this.mainService.titleMission(title);
        }, 0);
    }

}