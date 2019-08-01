import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { EventFilterComponent } from './event-filter.component';
import { AttributeBuilderModule } from '../../../../../user/crowd-create/attribute-builder/attribute-builder.module';
import { EventAttributeBuilderModule } from '../event-attribute-builder/event-attribute-builder.module';
import { EventFilterService } from './event-filter.service';

@NgModule({
  declarations: [EventFilterComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgZorroAntdModule,
    AttributeBuilderModule,
    EventAttributeBuilderModule
  ],
  providers: [EventFilterService],
  exports: [EventFilterComponent]
})
export class EventFilterModule {}
