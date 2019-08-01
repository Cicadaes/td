import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicAnalysisRoutingModule } from './basic-analysis.routing';
import { CustomAnalysisModule } from './custom-analysis/custom-analysis.module';
import { UserRetentionModule } from './user-retention/user-retention.module';
import { UseAnalysisModule } from './use-analysis/use-analysis.module';
import { EventAnalysisModule } from './event-analysis/event-analysis.module';

@NgModule({
  imports: [
    CommonModule,
    BasicAnalysisRoutingModule,
    CustomAnalysisModule,
    UserRetentionModule,
    UseAnalysisModule,
    EventAnalysisModule
  ],
  declarations: []
})
export class BasicAnalysisModule {}
