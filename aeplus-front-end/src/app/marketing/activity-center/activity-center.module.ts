import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {ActivityCenterRoutingModule} from './activity-center.routing';
import {ActivityCenterComponent} from './activity-center.component';
import {ActivityCenterAddSclComponent} from './activity-center-add-scl/activity-center-add-scl.component';
import {ActivityCenterAddMcpComponent} from './activity-center-add-mcp/activity-center-add-mcp.component';
import {ActivityCenterAppPushComponent} from './activity-center-app-push/activity-center-app-push.component';
import {ActivityCenterSmComponent} from './activity-center-sm/activity-center-sm.component';
import {ActivityCenterAppEdmComponent} from './activity-center-app-edm/activity-center-app-edm.component';
import {ModalDialogModule} from '../../common/modal-dialog/modal-dialog.module';
import {ReportModule} from '../report/report.module';
import { DirectiveModule } from '../../common/directive/directive.module';
import { CKEditorModule } from '../../../../node_modules/ng2-ckeditor';

@NgModule(
    {
        imports: [
            CommonModule,
            FormsModule,
            ReactiveFormsModule,
            NgZorroAntdModule,
            ActivityCenterRoutingModule,
            ModalDialogModule,
            ReportModule,
            DirectiveModule,
            CKEditorModule
        ],
        declarations: [
            ActivityCenterComponent,
            ActivityCenterAddSclComponent,
            ActivityCenterAddMcpComponent,
            ActivityCenterAppPushComponent,
            ActivityCenterSmComponent,
            ActivityCenterAppEdmComponent
        ]
    }
)

export class ActivityCenterModule {

}
