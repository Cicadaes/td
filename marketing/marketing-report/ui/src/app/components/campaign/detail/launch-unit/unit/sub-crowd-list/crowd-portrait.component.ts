import { Component } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { SegmentResourceService } from "../../../../../../services/campaign/segment.resource.service";

@Component({
    selector: 'crowd-portrait',
    templateUrl: 'crowd-portrait.component.html',
    styleUrls: ['crowd-portrait.component.css'],
    providers: [SegmentResourceService]
})

export class CrowdPortraitComponent {

    // src = "http://172.23.5.128/dmp-web/pageapi#/crowd/crowds/227/portrait/%23%252Fcrowd%252Fcrowds%3Fpage=1&count=10&sorting%255Bname%255D=asc"

    defaultUrl: string;

    defaultParams: string = "/portrait/%23%252Fcrowd%252Fcrowds%3Fpage=1&count=10&sorting%255Bname%255D=asc";

    crowdId: string;

    src: string;

    campaignId: string;

    constructor(private activatedRoute: ActivatedRoute, public router: Router, public segmentResourceService: SegmentResourceService) {
        let that = this;
        that.segmentResourceService.config().then((config: any) => {
            that.defaultUrl = `${config.dmpDefaultUrl}/dmp-web/pageapi#/crowd/crowds/`;
            that.crowdId = activatedRoute.params['value'].crowdId;
            that.campaignId = activatedRoute.params['value'].id;
            that.src = that.defaultUrl + that.crowdId + that.defaultParams;
        }).catch();
    }

    goBack() {
        let that = this;
        that.router.navigate(['/marketing', that.campaignId]);
    }
};