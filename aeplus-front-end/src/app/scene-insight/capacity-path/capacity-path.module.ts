import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {CapacityPathRoutingModule} from './capacity-path.routing';
import {MoreSearchModule} from '../../main/more-search/more-search.module';
import {ModalDialogModule} from '../../common/modal-dialog/modal-dialog.module';
import {CapacityPathTableComponent} from './capacity-path-table/capacity-path-table.component';
import {CapacityPathAddComponent} from './capacity-path-add/capacity-path-add.component';
import {CapacityPathDetailComponent} from './capacity-path-detail/capacity-path-detail.component';
import {CapacityPathService} from './capacity-path.service';
import {SelectSearchMultipleModule} from '../../main/select/select-search-multiple/select-search-multiple.module';
import {DateFormatPipeModule} from '../../../pipes/date-format-pipe';
import {NumberToThousandsPipeModule} from '../../../pipes/number-to-thousands-pipe';
import {CalStatusPathPipeModule} from '../../../pipes/cal-status-path-pipe';
import {CalStatusPipeModule} from '../../../pipes/cal-status-pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        MoreSearchModule,
        ModalDialogModule,
        CapacityPathRoutingModule,
        CalStatusPipeModule,
        DateFormatPipeModule,
        NumberToThousandsPipeModule,
        SelectSearchMultipleModule
    ],
    declarations: [CapacityPathTableComponent, CapacityPathAddComponent, CapacityPathDetailComponent],
    providers: [
        CapacityPathService
    ]
})
export class CapacityPathModule {
}
