import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {ClipboardModule} from 'ngx-clipboard';
import {MoreSearchModule} from '../../main/more-search/more-search.module';
import {CommonIsnotPipeModule} from '../../../pipes/common-isnot-pipe';
import {PlatformPipeModule} from '../../../pipes/platform-pipe';
import {AttributeTypePipeModule} from '../../../pipes/attribute-type-pipe';
import {AttributeStatusPipeModule} from '../../../pipes/attribute-status-pipe';
import {AttributeResourcePipeModule} from '../../../pipes/attribute-resource-pipe';
import {ManageSystemRoutingModule} from './manage-system.routing';
import {ManageSystemComponent} from './manage-system.component';
import {EventMgtComponent} from './event-mgt/event-mgt.component';
import {EventMgtDiscontinuationComponent} from './event-mgt/event-mgt-discontinuation/event-mgt-discontinuation.component';
import {EventMgtPropModalComponent} from './event-mgt/event-mgt-prop-modal/event-mgt-prop-modal.component';
import {EventMgtImportModalComponent} from './event-mgt/event-mgt-import-modal/event-mgt-import-modal.component';
import {EventAttributeComponent} from './event-attribute/event-attribute.component';
import {EventAttributeTableComponent} from './event-attribute/table/event-attribute-table/event-attribute-table.component';
import {EventAttributeAddFormComponent} from './event-attribute/form/event-attribute-add-form/event-attribute-add-form.component';
import {EventAttributeAddDialogComponent} from './event-attribute/dialog/event-attribute-add-dialog/event-attribute-add-dialog.component';
import {UserAttributeComponent} from './user-attribute/user-attribute.component';
import {UserAttributeTableComponent} from './user-attribute/table/user-attribute-table/user-attribute-table.component';
import {UserAttributeAddFormComponent} from './user-attribute/form/user-attribute-add-form/user-attribute-add-form.component';
import {UserAttributeAddDialogComponent} from './user-attribute/dialog/user-attribute-add-dialog/user-attribute-add-dialog.component';
import {SourceMgtComponent} from './source-mgt/source-mgt.component';
import {ActivityMgtComponent} from './activity-mgt/activity-mgt.component';
import {PageMgtComponent} from './page-mgt/page-mgt.component';
import {UserClickMapComponent} from './user-click-map/user-click-map.component';
import {UserClickMapTableComponent} from './user-click-map/table/user-click-map-table/user-click-map-table.component';
import {UserClickMapFormComponent} from './user-click-map/form/user-click-map-form/user-click-map-form.component';
import {UserClickMapDialogComponent} from './user-click-map/dialog/user-click-map-dialog/user-click-map-dialog.component';
import {QrcodeComponent} from './qrcode/qrcode.component';
import {CreateQrcodeComponent} from './qrcode/create-qrcode/create-qrcode.component';
import {EditQrcodeComponent} from './qrcode/edit-qrcode/edit-qrcode.component';
import {AppInfoComponent} from './app-info/app-info.component';
import {AppInfoFormComponent} from './app-info/form/app-info-form/app-info-form.component';
import {ModalDialogModule} from '../../common/modal-dialog/modal-dialog.module';
import {FastSearchModule} from '../../main/fast-search/fast-search.module';
import {TabListModule} from '../../common/tab-list/tab-list.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ClipboardModule,
        MoreSearchModule,
        CommonIsnotPipeModule,
        PlatformPipeModule,
        AttributeTypePipeModule,
        AttributeStatusPipeModule,
        AttributeResourcePipeModule,
        ManageSystemRoutingModule,
        ModalDialogModule,
        FastSearchModule,
        TabListModule
    ],
    declarations: [
        ManageSystemComponent,
        EventMgtComponent,
        EventMgtDiscontinuationComponent,
        EventMgtPropModalComponent,
        EventMgtImportModalComponent,
        EventAttributeComponent,
        EventAttributeTableComponent,
        EventAttributeAddFormComponent,
        EventAttributeAddDialogComponent,
        UserAttributeComponent,
        UserAttributeTableComponent,
        UserAttributeAddFormComponent,
        UserAttributeAddDialogComponent,
        SourceMgtComponent,
        ActivityMgtComponent,
        PageMgtComponent,
        UserClickMapComponent,
        UserClickMapTableComponent,
        UserClickMapFormComponent,
        UserClickMapDialogComponent,
        QrcodeComponent,
        CreateQrcodeComponent,
        EditQrcodeComponent,
        AppInfoComponent,
        AppInfoFormComponent
    ]
})

export class ManageSystemModule {

}
