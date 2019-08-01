import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import {AddAppFormModule} from '../form/add-app-form.module';
import {DetailAppPageService} from './detail-app-page.service';
import {DetailAppPageComponent} from './detail-app-page.component';
import {DetailAppPageRoutingModule} from './detail-app-page-routing.module';
import {AppAttributeModule} from '../appAttribute/app-attribute.module';
import {MoreSearchModule} from '../../../../main/more-search/more-search.module';
import {applicationTreeModule} from '../applicationTree/applicationTree.module';
import {FunctionTableModule} from '../table/function-table.module';
import {EditAppPageModule} from '../editApp/edit-app-page.module';
import {DateFormatPipeModule} from '../../../../pipes/dateFormat-pipe';
import {ExportActionDialogModule} from '../../action/dialog/export-action-dialog.module';
import {ImportActionDialogModule} from '../../action/dialog/import-action-dialog.module';
import {AssociatedLicencesTableModule} from '../licenceTable/associated-licences-table.module';
import {AdditionalAppsTableModule} from '../additionalAppsTable/additional-apps-table.module';
import { AddAppExtendModule } from '../addAppExtend/add-app-extend.module';
import { AddActionFormModule } from '../../action/form/add-action-form.module';

@NgModule({
    declarations: [
        DetailAppPageComponent
    ],
    imports: [
        ReactiveFormsModule,
        DateFormatPipeModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule,
        AddAppFormModule,
        DetailAppPageRoutingModule,
        AppAttributeModule,
        FunctionTableModule,
        MoreSearchModule,
        EditAppPageModule,
        ImportActionDialogModule,
        ExportActionDialogModule,
        AssociatedLicencesTableModule,
        AdditionalAppsTableModule,
        applicationTreeModule,
        AddAppExtendModule,
        AddActionFormModule
    ],
    providers: [DetailAppPageService],
    exports: [DetailAppPageComponent]
})
export class DetailAppPageModule {

}
