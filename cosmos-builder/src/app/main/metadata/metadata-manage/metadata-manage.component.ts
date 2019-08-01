import { Component, OnInit,  OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MainService } from '../../main.service';
import { MetadataCommunicationService } from '../metadata.service';
@Component({
    selector: 'metadata-manage',
    templateUrl: './metadata-manage.component.html',
    styleUrls: ['./metadata-manage.component.less'],
    providers: [MetadataCommunicationService]
})
export class MetadataManageComponent implements OnInit, OnDestroy {
    title:Array<any>;
    constructor(
        private route:ActivatedRoute, 
        private mainService:MainService,
        private metadataCommunicationService: MetadataCommunicationService
    ) {
        this.title = this.route.snapshot.data['title'];
        this.title[0]['url'] = this.route.snapshot.url;
    }

    ngOnInit() {
       this.changeTitle(this.title);
        
    }

    changeTitle(title:Array<any>){
        setTimeout(() => {
            this.mainService.titleMission(title);
        }, 0);
    }

    ngOnDestroy() {

    }
}