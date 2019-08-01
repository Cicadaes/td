import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ChartModule } from '../../common/chart/chart.module';
import { FunnelTableComponent } from './funnel-table/funnel-table.component';
import { FunnelAddComponent } from './funnel-add/funnel-add.component';
import { FunnelSeeComponent } from './funnel-see/funnel-see.component';
import { ModalDialogModule } from '../../common/modal-dialog/modal-dialog.module';
import { SelectCustomModule } from '../../main/select/select-custom/select-custom.module';
import { SelectSearchMultipleModule } from '../../main/select/select-search-multiple/select-search-multiple.module';
import { TransFunnelRoutingModule } from './trans-funnel.routing';
import { TabListModule } from '../../common/tab-list/tab-list.module';
import { TransFunnelComponent } from './trans-funnel.component';
import { PlatformPipeModule } from '../../../pipes/platform-pipe';
import { FunnelTableService } from './funnel-table/funnel-table.service';

@NgModule({
  imports: [
    CommonModule,
    PlatformPipeModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ChartModule,
    ModalDialogModule,
    SelectCustomModule,
    SelectSearchMultipleModule,
    TransFunnelRoutingModule,
    TabListModule
  ],
  declarations: [TransFunnelComponent, FunnelTableComponent, FunnelAddComponent, FunnelSeeComponent],
  providers: [FunnelTableService],
  exports: []
})
export class TransFunnelModule {}
