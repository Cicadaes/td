import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrowdDimensionalityComponent } from './crowd-dimensionality/crowd-dimensionality.component';
import { MarketingManageComponent } from './marketing-manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { MoreSearchModule } from '../../main/more-search/more-search.module';
import { ModalDialogModule } from '../../common/modal-dialog/modal-dialog.module';
import { MarketingManageRoutingModule } from './marketing-manage.routing';
import { MarketingManageService } from './marketing-manage.service';
// tslint:disable-next-line
import { AddCrowdDimensionalityComponent } from './crowd-dimensionality/add-crowd-dimensionality/add-crowd-dimensionality.component';
import { IndexConfigComponent } from './index-config/index-config.component';
import { EventConfigComponent } from './event-config/event-config.component';
import { AscribeConfigComponent } from './ascribe-config/ascribe-config.component';
import { AddIndexConfigComponent } from './index-config/add-index-config/add-index-config.component';
import { AddEventConfigComponent } from './event-config/add-event-config/add-event-config.component';
import { TabListModule } from '../../common/tab-list/tab-list.module';

@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    MarketingManageRoutingModule,
    MoreSearchModule,
    ModalDialogModule,
    TabListModule
  ],
  declarations: [
    MarketingManageComponent,
    CrowdDimensionalityComponent,
    AddCrowdDimensionalityComponent,
    IndexConfigComponent,
    EventConfigComponent,
    AscribeConfigComponent,
    AddIndexConfigComponent,
    AddEventConfigComponent
  ],
  providers: [MarketingManageService]
})
export class MarketingManageModule {}
