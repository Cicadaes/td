import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CapacityPathRoutingModule } from './capacity-path.routing';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { ModalDialogModule } from '../../common/modal-dialog/modal-dialog.module';
import { CapacityPathTableComponent } from './capacity-path-table/capacity-path-table.component';
import { CapacityPathAddComponent } from './capacity-path-add/capacity-path-add.component';
import { CapacityPathDetailComponent } from './capacity-path-detail/capacity-path-detail.component';
import { CapacityPathService } from './capacity-path.service';
import { CapacityPathComponent } from './capacity-path.component';
import { SelectSearchMultipleModule } from '../../main/select/select-search-multiple/select-search-multiple.module';
import { DateFormatPipeModule } from '../../../pipes/date-format-pipe';
import { NumberToThousandsPipeModule } from '../../../pipes/number-to-thousands-pipe';
import { CalStatusPipeModule } from '../../../pipes/cal-status-pipe';
import { TransFunnelModule } from '../trans-funnel/trans-funnel.module';
// tslint:disable-next-line
import { CapacityPathFunnelDialogComponent } from './capacity-path-detail/funnel/dialog/capacity-path-funnel-dialog.component';
import { CapacityPathFunnelAddComponent } from './capacity-path-detail/funnel/capacity-path-funnel-add.component';

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
    SelectSearchMultipleModule,
    TransFunnelModule
  ],
  declarations: [
    CapacityPathTableComponent,
    CapacityPathAddComponent,
    CapacityPathComponent,
    CapacityPathDetailComponent,
    CapacityPathFunnelDialogComponent,
    CapacityPathFunnelAddComponent
  ],
  providers: [CapacityPathService]
})
export class CapacityPathModule {}
