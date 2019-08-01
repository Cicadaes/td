// import Service
import { ShowNavService } from './../../../services/guard/show-nav.service';
import { HideNavService } from './../../../services/guard/hide-nav.service';
import { ShowFilterService } from './../../../services/guard/show-filter.service';
import { HideFilterService } from './../../../services/guard/hide-filter.service';
import { ShowTimeService } from './../../../services/guard/show-time.service';
import { HideTimeService } from './../../../services/guard/hide-time.service';
import { ShowCampService } from './../../../services/guard/show-camp.service';
import { HideCampService } from './../../../services/guard/hide-camp.service';
import { ShowSpecialTimeService } from './../../../services/guard/show-special-time.service';
import { HideSpecialTimeService } from './../../../services/guard/hide-special-time.service';
import { ShowBreadService } from './../../../services/guard/show-bread.service';
import { HideBreadService } from './../../../services/guard/hide-bread.service';

// import Components
import { CrowdContainerComponent } from './crowd-container.component';

export const CROWD_CONTAINER_ROUTES: any = [
  {
    path: '',
    component: CrowdContainerComponent,
    canActivate: [ShowFilterService, ShowNavService],
    canDeactivate: [HideFilterService, HideNavService]
  },
  {
    path: 'create/:name',
    loadChildren: './create-crowd/create-crowd-container.module#CreateCrowdContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService]
  },
  {
    path: 'edit/:name/:id',
    loadChildren: './create-crowd/create-crowd-container.module#CreateCrowdContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService]
  }
];
