import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { CreateReportContainerComponent } from './create-report-container.component';
import { SelectTypeContainerComponent } from './select-type/select-type-container.component';
import { ReportEditContainerComponent } from './report-edit/report-edit-container.component';
import { ReportPreviewComponent } from './report-preview/report-preview.component';

// import Services
import { ReportModelService } from '../../../services/model/report.model.service';
import { CustomTemplateComponent } from './custom-template/custom-template.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      pathMatch: 'full',
      redirectTo: '/report/create-report/select-type'
    }, {
      path: 'select-type/:name',
      component: SelectTypeContainerComponent
    }, {
      path: 'edit-data/:name',
      component: ReportEditContainerComponent
    }, {
      path: 'select-type/:name/:id',
      component: SelectTypeContainerComponent
    }, {
      path: 'edit-data/:name/:id',
      component: ReportEditContainerComponent
    }])
  ],
  declarations: [
    CreateReportContainerComponent,
    SelectTypeContainerComponent,
    ReportEditContainerComponent,
    ReportPreviewComponent,
    CustomTemplateComponent,
],
  providers: [
    ReportModelService
  ]
})
export class CreateReportContainerModule { }