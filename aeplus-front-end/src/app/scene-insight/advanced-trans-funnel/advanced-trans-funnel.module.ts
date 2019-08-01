import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {AdvancedTransFunnelRoutingModule} from './advanced-trans-funnel.routing';
import {AdvancedTransFunnelTableComponent} from './table/advanced-trans-funnel-table/advanced-trans-funnel-table.component';
import {AdvancedTransFunnelAddFormComponent} from './advanced-trans-funnel-add-form/advanced-trans-funnel-add-form.component';
import {AdvancedTransFunnelService} from './advanced-trans-funnel.service';
import {CalStatusPipeModule} from '../../../pipes/cal-status-pipe';
import {FastSearchModule} from '../../main/fast-search/fast-search.module';
import {MoreSearchModule} from '../../main/more-search/more-search.module';
import {ModalDialogModule} from '../../common/modal-dialog/modal-dialog.module';
import {AdvancedTransFunnelAddPageComponent} from './page/advanced-trans-funnel-add-page/advanced-trans-funnel-add-page.component';
import {AdvancedTransFunnelAddStepComponent} from './advanced-trans-funnel-add-step/advanced-trans-funnel-add-step.component';
import {SelectSearchMultipleModule} from '../../main/select/select-search-multiple/select-search-multiple.module';
import {DateFormatPipeModule} from '../../../pipes/date-format-pipe';
import {AdvancedTransFunnelViewPageComponent} from './page/advanced-trans-funnel-view-page/advanced-trans-funnel-view-page.component';
import {NumberToThousandsPipeModule} from '../../../pipes/number-to-thousands-pipe';
import {ChartModule} from '../../common/chart/chart.module';
import {RouterModule} from '@angular/router';
import {KeysPipeModule} from '../../../pipes/keys-pipe';
import {AdvancedTransFunnelUsersPageComponent} from './page/advanced-trans-funnel-users-page/advanced-trans-funnel-users-page.component';
import {AdvancedTransFunnelUsersTableComponent} from './page/advanced-trans-funnel-users-page/advanced-trans-funnel-users-table/advanced-trans-funnel-users-table.component';
import {AdvancedTransFunnelTableHeadComponent} from './page/advanced-trans-funnel-users-page/advanced-trans-funnel-table-head/advanced-trans-funnel-table-head.component';
import {AdvancedTransFunnelUserSaveComponent} from './page/advanced-trans-funnel-users-page/advanced-trans-funnel-user-save/advanced-trans-funnel-user-save.component';
import {AdvancedTransFunnelUserFormComponent} from './page/advanced-trans-funnel-users-page/advanced-trans-funnel-user-form/advanced-trans-funnel-user-form.component';
import {AdvancedTransFunnelUserExportComponent} from './page/advanced-trans-funnel-users-page/advanced-trans-funnel-user-export/advanced-trans-funnel-user-export.component';
import {AdvancedTransFunnelUserExportSuccessComponent} from './page/advanced-trans-funnel-users-page/advanced-trans-funnel-user-export-success/advanced-trans-funnel-user-export-success.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdvancedTransFunnelRoutingModule,
        NgZorroAntdModule,
        CalStatusPipeModule,
        FastSearchModule,
        MoreSearchModule,
        ModalDialogModule,
        SelectSearchMultipleModule,
        DateFormatPipeModule,
        RouterModule,
        ChartModule,
        KeysPipeModule,
        NumberToThousandsPipeModule,
        FastSearchModule
    ],
    declarations: [
        AdvancedTransFunnelTableComponent,
        AdvancedTransFunnelAddFormComponent,
        AdvancedTransFunnelAddPageComponent,
        AdvancedTransFunnelAddStepComponent,
        AdvancedTransFunnelViewPageComponent,
        AdvancedTransFunnelUsersPageComponent,
        AdvancedTransFunnelUsersTableComponent,
        AdvancedTransFunnelTableHeadComponent,
        AdvancedTransFunnelUserSaveComponent,
        AdvancedTransFunnelUserFormComponent,
        AdvancedTransFunnelUserExportComponent,
        AdvancedTransFunnelUserExportSuccessComponent,
    ],
    providers: [AdvancedTransFunnelService]
})
export class AdvancedTransFunnelModule {
}

