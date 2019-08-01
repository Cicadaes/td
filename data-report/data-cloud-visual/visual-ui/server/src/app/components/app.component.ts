import {Component} from '@angular/core';
import '../../../node_modules/primeng/resources/themes/bootstrap/theme.css';
import '../../../public/css/styles.css';
import '../../../node_modules/primeng/resources/primeng.min.css';
import '../../../public/font-awesome/css/font-awesome.min.css';
import '../../../public/iconfont/iconfont.css';
import '../../../public/css/skin-blue.css';

import '../../../node_modules/datwill/img/smart.reports.css';


import {AppCommunicationService} from "../services/app.communication.service";
import {UserCommunicationService} from "../services/user.communication.service";
import {Router} from "@angular/router";

import {DialogCommunicationService} from "../services/dialog/dialog.communication.service";

@Component({
    selector: 'my-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    providers: [
        UserCommunicationService,
        DialogCommunicationService
    ],
})
export class AppComponent {
    constructor(public router: Router, public appCommunication: AppCommunicationService) {
    }
}
