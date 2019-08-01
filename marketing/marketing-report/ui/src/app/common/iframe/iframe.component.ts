/** 
 * Created by wangshouyun on 2017/3/6.
 */
import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {IFrameCommunicationService} from "./iframe.communication.service";

@Component({
    selector: 'my-iframe',
    templateUrl: 'iframe.component.html',
    styleUrls: ['iframe.component.css']
})
export class IFrameComponent implements OnInit {

    @Input() 
    set src (url: string) {
        if (url) {
            let that = this;
            let iframe = document.createElement('iframe');
            iframe.id = 'iframs';
            iframe.setAttribute('style', 'width: 100%; height: 100%;');
            iframe.src = url;
            document.querySelector('#iframe-content').appendChild(iframe);
            setTimeout(function () {
                document.getElementById('iframs').onload = function () {
                    that.loading = false;
                }
            }, 1);
        }
    };

    loading: boolean = true;

    iframe: string = '';

    constructor(private iframeCommunication: IFrameCommunicationService, private domSanitizer: DomSanitizer) {
        let that = this;
    }

    ngOnInit() {
        // let that = this;
        // let iframe = document.createElement('iframe');
        // iframe.id = 'iframs';
        // iframe.setAttribute("class",'size');
        // iframe.src = 'http://172.23.5.128/dmp-web/pageapi#/crowd/lookalikeCrowd/new';
        // document.querySelector('#iframe-content').appendChild(iframe);
    }

    get sanitize() {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(this.src);
    }

}