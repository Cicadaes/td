import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {ChartModule} from '../../common/chart/chart.module';
import {FunnelTableComponent} from './funnel-table/funnel-table.component';
import {FunnelAddComponent} from './funnel-add/funnel-add.component';
import {FunnelSeeComponent} from './funnel-see/funnel-see.component';
import {ModalDialogModule} from '../../common/modal-dialog/modal-dialog.module';
import {SelectCustomModule} from '../../main/select/select-custom/select-custom.module';
import {SelectSearchMultipleModule} from '../../main/select/select-search-multiple/select-search-multiple.module';
import {TransFunnelRoutingModule} from './trans-funnel.routing';

@NgModule({
    imports: [
        CommonModule,

        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        ChartModule,
        ModalDialogModule,
        SelectCustomModule,
        SelectSearchMultipleModule,
        TransFunnelRoutingModule
    ],
    declarations: [
        FunnelTableComponent,
        FunnelAddComponent,
        FunnelSeeComponent
    ]
})
export class TransFunnelModule {
}

