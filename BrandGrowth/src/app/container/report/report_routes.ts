// import Service
import { ShowNavService } from './../../services/guard/show-nav.service';
import { HideNavService } from './../../services/guard/hide-nav.service';
import { ShowFilterService } from './../../services/guard/show-filter.service';
import { HideFilterService } from './../../services/guard/hide-filter.service';
import { ShowTimeService } from '../../services/guard/show-time.service';
import { HideTimeService } from '../../services/guard/hide-time.service';
import { ShowCampService } from '../../services/guard/show-camp.service';
import { HideCampService } from '../../services/guard/hide-camp.service';
import { ShowSpecialTimeService } from '../../services/guard/show-special-time.service';
import { HideSpecialTimeService } from '../../services/guard/hide-special-time.service';
import { ShowBreadService } from '../../services/guard/show-bread.service';
import { HideBreadService } from './../../services/guard/hide-bread.service';
import { ShowFilterTimeService } from '../../services/guard/show-filter-time.service';
import { HideFilterTimeService } from '../../services/guard/hide-filter-time.service';

// import Components
import { ReportContainerComponent } from './report-container.component';
import { Routes } from '@angular/router';

export const REPORT_ROUTES: Routes = [
  {
    path: '',
    component: ReportContainerComponent,
    canActivate: [ShowFilterTimeService, ShowBreadService, ShowTimeService],
    canDeactivate: [HideFilterTimeService, HideBreadService, HideTimeService]
  },
  {
    path: 'create',
    loadChildren: './create-report/create-report-container.module#CreateReportContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService]
  },
  {
    path: 'edit',
    loadChildren: './create-report/create-report-container.module#CreateReportContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService]
  }
];

