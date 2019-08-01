import { Component } from '@angular/core';
// import { MarketingCommunicationService } from "../../../../services/marketing/marketing.communication.service";
import {SelectItem} from "primeng/components/common/api";
var Clipboard = require("clipboard");

@Component({
    selector: 'internet-push-marketing',
    templateUrl: 'internet-push.component.html',
    styleUrls: ['internet-push.component.css'],
    providers: [
        // MarketingCommunicationService
    ]
})
export class InternetPushComponent {

    pushChannels: SelectItem[];

    selectedChannel: string[];

    secretKey: string = "这个是密钥";

    constructor() {
        this.pushChannels = [];
        this.pushChannels.push({label:'talkingData广告接入商', value:'advertiser'});
        this.pushChannels.push({label:'广告商1', value:'advertiser1'});
        this.pushChannels.push({label:'广告商2', value:'advertiser2'});
        this.pushChannels.push({label:'广告商3', value:'advertiser3'});
    }

    ngOnInit() {
        var clipboard = new Clipboard('.secretkey-btn');
        //复制后处理事件
        // clipboard.on('success', function(e: any) {
        //     // console.info('Action:', e.action);
        //     // console.info('Text:', e.text);
        //     // console.info('Trigger:', e.trigger);

        //     // e.clearSelection();
        // });

        // clipboard.on('error', function(e: any) {
        //     // console.error('Action:', e.action);
        //     // console.error('Trigger:', e.trigger);
        // });
    }

    copySecretKey(){

    }

}