import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SegmentResourceService } from "../../../../../services/campaign/segment.resource.service";

@Component({
	selector: 'personas',
	templateUrl: 'personas.component.html',
    styleUrls: ['personas.component.css'],
    providers: [SegmentResourceService]
})

export class PersonasComponent {
	//该页面感觉可以和子人群中的用户画像复用
	defaultUrl: string;

    defaultParams: string = "/portrait/%23%252Fcrowd%252Fcrowds%3Fpage=1&count=10&sorting%255Bname%255D=asc";

    crowdId: string;

    crowdVersion: string;

    src: string;

    campaignId: string;

    constructor(private activatedRoute: ActivatedRoute, public router: Router, public segmentResourceService: SegmentResourceService) {
        let that = this;
        that.segmentResourceService.config().then((config: any) => {
            // console.log('==>>>', config);
            that.defaultUrl = `${config.dmpDefaultUrl}/dmp-web/pageapi#/crowd/crowds/`;
            that.crowdId = activatedRoute.params['value'].crowdId;
            that.crowdVersion = activatedRoute.params['value'].crowdVersion;
            that.campaignId = activatedRoute.params['value'].id;
            // that.src = that.defaultUrl + that.crowdId + '/' + that.crowdVersion + that.defaultParams;
            that.src = that.defaultUrl + that.crowdId + '/portrait/%23%252Fcrowd%252Fcrowds%3Fpage=1&count=10&sorting%255Bname%255D=asc?tab=crowdPortrait';
        }).catch();
        // if (process.env.ENV == "developer") {
        //     that.defaultUrl = 'http://172.23.5.128/dmp-web/pageapi#/mkt/crowd/crowds/';
        // } else if (process.env.ENV == "production") {
        //     that.defaultUrl = 'http://medemo.tenddata.com/dmp-web/mkt/pageapi#/crowd/crowds/';  //demo环境
        // } else if (process.env.ENV == "test") {
        //     that.defaultUrl = 'http://172.23.5.83/dmp-web/pageapi#/mkt/crowd/crowds/';     //测试环境  
        // }
    }

    goBack() {
        let that = this;
        that.router.navigate(['/marketing', that.campaignId]);
    }
}