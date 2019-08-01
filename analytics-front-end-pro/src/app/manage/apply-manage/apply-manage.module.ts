import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {ApplyManageComponent} from './apply-manage.component';
import {ApplyManageRoutingModule} from './apply-manage.routing';
import {ApplyManageService} from './apply-manage.service';
import {TabListModule} from '../../common/tab-list/tab-list.module';
import {AppPushComponent} from './app-push/app-push.component';
import {SmsEdmComponent} from './sms-edm/sms-edm.component';
import {AddSmsComponent} from './add-sms/add-sms.component';
import {AddEdmComponent} from './add-edm/add-edm.component';
import {ModalDialogModule} from '../../common/modal-dialog/modal-dialog.module';
import {SmsDetailComponent} from './detail/sms-detail/sms-detail.component';
import {EdmDetailComponent} from './detail/edm-detail/edm-detail.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
        FormsModule,
        ReactiveFormsModule,
        ApplyManageRoutingModule,
        TabListModule,
        ModalDialogModule
    ],
    declarations: [
        ApplyManageComponent,
        AppPushComponent,
        SmsEdmComponent,
        AddSmsComponent,
        AddEdmComponent,
        SmsDetailComponent,
        EdmDetailComponent
    ],
    providers: [ApplyManageService]
})
export class ApplyManageModule {
}
