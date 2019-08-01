import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventAttributeBuilderComponent } from './event-attribute-builder.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { EventAnalysisDetailService } from '../../event-analysis-detail.service';
import { EventCrowdCreatePipe } from '../../event-analysis-detail.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, NgZorroAntdModule],
  declarations: [EventAttributeBuilderComponent, EventCrowdCreatePipe],
  exports: [EventAttributeBuilderComponent, EventCrowdCreatePipe],
  providers: [EventAnalysisDetailService]
})
export class EventAttributeBuilderModule {}
