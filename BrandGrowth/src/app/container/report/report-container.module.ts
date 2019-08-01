import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../config/shared/shared.module';

// import Components
import { ReportContainerComponent } from './report-container.component';

// import Routes
import { REPORT_ROUTES } from './report_routes';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(REPORT_ROUTES)
  ],
  declarations: [
    ReportContainerComponent
  ],
  providers: [
  ],
  exports: [
    ReportContainerComponent
  ]
})
export class ReportContainerModule { }