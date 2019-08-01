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

// import Components
import { ActivityContainerComponent } from './activity-container.component';

export const ACTIVITY_ROUTES: any = [
  {
    path: '',
    component: ActivityContainerComponent,
    canActivate: [ShowFilterService, ShowTimeService, ShowSpecialTimeService],
    canDeactivate: [HideFilterService, HideTimeService, HideSpecialTimeService]
  },
  {
    path: 'overview',
    loadChildren: './overview/overview-container.module#OverviewContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowCampService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideCampService]
  },
  {
    path: 'chain',
    loadChildren: './chain/chain-container.module#ChainContainerModule',
  },
  {
    path: 'analyze',
    loadChildren: './analyze/analyze-container.module#AnalyzeContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowCampService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideCampService]
  },
  {
    path: 'detection',
    loadChildren: './detection/detection-container.module#DetectionContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowCampService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideCampService]
  },
  {
    path: 'protect',
    loadChildren: './protect/protect-container.module#ProtectContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowCampService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideCampService]
  },
  {
    path: 'setting',
    loadChildren: './setting/setting-container.module#SettingContainerModule',
  },
  {
    path: 'create/:name',
    loadChildren: './create/create-container.module#CreateContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService]
  }
];

