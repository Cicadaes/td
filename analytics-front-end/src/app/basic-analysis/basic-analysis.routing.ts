import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomAnalysisComponent } from './custom-analysis/custom-analysis.component';
import { UserRetentionComponent } from './user-retention/user-retention.component';
import { UseAnalysisComponent } from './use-analysis/use-analysis.component';
import { EventAnalysisComponent } from './event-analysis/event-analysis.component';
import { EventAnalysisDetailComponent } from './event-analysis/detail/event-analysis-detail.component';

const appRoutes: Routes = [
  {
    path: 'user-retention',
    component: UserRetentionComponent
  },
  {
    path: 'event-analysis',
    component: EventAnalysisComponent
  },
  {
    path: 'event-analysis-detail',
    component: EventAnalysisDetailComponent
  },
  {
    path: 'behavior-analysis',
    component: EventAnalysisComponent
  },
  {
    path: 'custom-analysis',
    component: CustomAnalysisComponent
  },
  {
    path: 'use-analysis',
    component: UseAnalysisComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class BasicAnalysisRoutingModule {}
