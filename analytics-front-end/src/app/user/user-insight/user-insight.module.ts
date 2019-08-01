import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInsightComponent } from './user-insight.component';
import { UserInsightRoutingModule } from './user-insight.routing';
import { UserInsightService } from './user-insight.service';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChartModule } from '../../common/chart/chart.module';
import { AttributeBuilderModule } from '../crowd-create/attribute-builder/attribute-builder.module';
import { UserListComponent } from './user-list/user-list.component';
import { NumberToThousandsPipeModule } from '../../../pipes/number-to-thousands-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ChartModule,
    AttributeBuilderModule,
    UserInsightRoutingModule,
    NumberToThousandsPipeModule
  ],
  declarations: [UserInsightComponent, UserListComponent],
  providers: [UserInsightService]
})
export class UserInsightModule {}
