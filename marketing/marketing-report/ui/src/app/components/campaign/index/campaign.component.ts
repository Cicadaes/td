import { Component, ViewChild } from "@angular/core";
import {Message} from 'primeng/primeng';
import { IndexSerivice } from "../../../services/campaign/index.service";
import { CampaignResourceService } from './../../../services/campaign/campaign.resource.service';
import { CampaignDeleteCommunicationService } from "../../../services/communication/campaign-delete.communication.service";
import { ConfigService } from "../../../services/communication/config.communication.service";

@Component({
    selector: 'campaign',
    templateUrl: 'campaign.component.html',
    styleUrls: ['campaign.component.css'],
    providers: [CampaignResourceService, CampaignDeleteCommunicationService]
})

export class CampaignComponent {
    showNewMarketing: boolean;

    loading: boolean = true;

    show: boolean = false;

    msgs: Message[] = [];

    @ViewChild('overview') overview: any; // 获取子组件活动总览 实例
    
    constructor(
        public indexSerivice: IndexSerivice,
        public configService: ConfigService
    ) {
        this.show = indexSerivice.show;
    }

    hideMarketingDialog(show :boolean){
        this.showNewMarketing =show;
    }

    changeLoading(bl: boolean) {
        this.loading = bl;
    }

    errorMessage(err: any) {
        let that = this;
        let errMsg = '';
        if (err && err.msgDes) {
            errMsg = err.msgDes;
        } else if (err.message) {
            errMsg = err.message;
        } else if ((typeof err == 'string') && err.constructor == String) {
            errMsg = err;
        }
        that.msgs.push({severity:'error', summary:'错误', detail: err});
    }

    updateCampaignList() {
        let that = this;
        //默认获取甘特图请求参数
        let queryParams: any = {
            orderBy: 'startTime',
            order: 'asc',
            startTimeLong: new Date(`${new Date().getFullYear()}-01-01`).getTime(),
            endTimeLong: new Date(`${new Date().getFullYear()}-12-31`).getTime(),
            page: 1,
            pageSize: 10
        };


        that.overview.queryCampaigns(queryParams);
    }
}