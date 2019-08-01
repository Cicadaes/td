import {Component} from '@angular/core';
import {Router} from "@angular/router";
import '../../../node_modules/primeng/resources/themes/bootstrap/theme.css';
import '../../../public/css/styles.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/font-awesome/css/font-awesome.min.css';
import '../../../public/iconfont/iconfont.css';
import '../../../public/css/joint.css';
import '../../../public/css/skin-blue.css';

import '../../../public/css/smart/iconfont.css';
import '../../../public/css/smart/smart.reports.css';
import '../../../public/css/smart/skin-blue.css';
import '../../../node_modules/datwill-sdk-charts/public/styles/datwill_style.css';
import {AppCommunicationService} from "../services/app.communication.service";
import {UserCommunicationService} from "../services/user.communication.service";


@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    providers: [
        AppCommunicationService,
        UserCommunicationService
    ],
})
export class AppComponent {
    constructor(public router: Router, appCommunication: AppCommunicationService) {
        this.router.events.subscribe((navEnd) => {
            //console.log(navEnd);
        });
    }

}
