import {Component} from '@angular/core';
import '../../../public/css/quill.bubble.css'
import '../../../public/css/quill.snow.css'
import '../../../node_modules/primeng/resources/themes/bootstrap/theme.css';
import '../../../public/css/styles.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/font-awesome/css/font-awesome.min.css';
import '../../../public/iconfont/iconfont.css';
import '../../../public/css/joint.css';
import '../../../public/css/skin-blue.css';
import { ChangeBreadNameCommunicationService } from "../services/communication/change-bread-name.communication.service"
import { IndexSerivice } from "../services/campaign/index.service";

import {AppCommunicationService} from "../services/app.communication.service";
import { AllDetailDataCommunication } from '../services/communication/all-detail-data.communication.service';
import { ConfigService } from '../services/communication/config.communication.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    providers: [
        AppCommunicationService,
        ChangeBreadNameCommunicationService,
        IndexSerivice,
        AllDetailDataCommunication,
        ConfigService
    ]
})
export class AppComponent {

    setPage: boolean = false;//如果是配置页面就不显示菜单

    constructor(appCommunication: AppCommunicationService,
        public indexSerivice: IndexSerivice,
        allDetailDataCommunication: AllDetailDataCommunication,
        configService: ConfigService
        //ChangeBreadNameCommunicationService: ChangeBreadNameCommunicationService
    ) {
        let that = this;
        let urlPath = window.location.href;
        that.isSetPage(urlPath);
    }

    /**
     * 判断是否是配置页面
     */
    isSetPage(url: string){
        let that = this;
        let path = url.substring(url.lastIndexOf("/")+1);
        if(path == "effectAdmin" || path == "funnelAdmin" || path == "campaignAdmin" || path == "mktProcessAdmin" || path == "eventConfig" || path == "indexConfig" || path == "applyPushConfig" || path == "crowdDimension"){
            that.setPage = true;
        }
    }

}
