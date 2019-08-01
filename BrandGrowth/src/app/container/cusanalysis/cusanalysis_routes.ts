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
import { HideBreadService } from '../../services/guard/hide-bread.service';
import { ShowFilterTimeService } from '../../services/guard/show-filter-time.service';
import { HideFilterTimeService } from '../../services/guard/hide-filter-time.service';

// import Components
import { CusAnalysisContainerComponent } from './cusanalysis-container.component';

export const CUSANALYSIS_ROUTES: any = [
  {
    path: '',
    component: CusAnalysisContainerComponent,
    canActivate: [ShowTimeService, ShowBreadService, ShowFilterTimeService],
    canDeactivate: [HideTimeService, HideBreadService, HideFilterTimeService],
  },
  { // 创建
    path: 'operation-cus-analysis',
    loadChildren: './cusanalysis-operation-container/cusanalysis-operation-container.module#CusanalysisOperationContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService],
    data: {
      type: 'create',
    },
  },
  { // 编辑
    path: 'edit-cus-analysis/:name',
    loadChildren: './cusanalysis-operation-container/cusanalysis-operation-container.module#CusanalysisOperationContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService],
    data: {
      type: 'edit',
    },
  },
  { // 详情
    path: 'cus-analysis-details/:name',
    loadChildren: './cusanalysis-details-container/cusanalysis-details-container.module#CusanalysisDetailsContainerModule',
    canActivate: [ShowTimeService, ShowBreadService],
    canDeactivate: [HideTimeService, HideBreadService],
    data: {
      type: 'details',
    },
  },
];
