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

// import Components
import { ManageCenterContainerComponent } from './manage-center-container.component';

export const MANAGE_CENTER_ROUTES: any = [
  {
    path: '',
    pathMatch: 'full', 
    redirectTo: 'data',
    // redirectTo: 'auth',
  },
  {
    path: 'auth',
    loadChildren: './auth-container/auth-container.module#AuthContainerModule',
  },
  {
    path: 'data',
    loadChildren: './data-container/data-container.module#DataContainerModule',
    canActivate: [ShowFilterService, ShowNavService],
    canDeactivate: [HideFilterService, HideNavService]
  },
  {
    path: 'data/create-data/:name',
    loadChildren: './data-container/create-data/create-data-container.module#CreateDataContainerModule',
    canActivate:  [ShowBreadService],
    canDeactivate: [HideBreadService]
  },
  {
    path: 'data/create-data/:name/:id',
    loadChildren: './data-container/create-data/create-data-container.module#CreateDataContainerModule',
    canActivate:  [ShowBreadService],
    canDeactivate: [HideBreadService]
  },
  {
    path: 'crowd',
    loadChildren: './crowd-container/crowd-container.module#CrowdContainerModule',
  },
  {
    path: 'btl',
    loadChildren: './btl-container/btl-container.module#BtlContainerModule',
    canActivate: [ShowFilterService, ShowNavService],
    canDeactivate: [HideFilterService, HideNavService]
  },
  {
    path: 'btl/operation-btl',
    loadChildren: './btl-container/create-btl/create-btl-container.module#CreateBtlContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService],
    data: {
      type: 'create',
    },
  },
  {
    path: 'btl/edit-btl/:name',
    loadChildren: './btl-container/create-btl/create-btl-container.module#CreateBtlContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService],
    data: {
      type: 'edit',
    },
  },
  {
    path: 'landing',
    loadChildren: './landing-container/landing-container.module#LandingContainerModule',
    canActivate: [ShowFilterService, ShowNavService],
    canDeactivate: [HideFilterService, HideNavService]
  },
  {
    path: 'landing/create-landing/:name',
    loadChildren: './landing-container/create-landing/create-landing.module#CreateLandingModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService],
  },
  {
    path: 'landing/create-landing/:name/:id',
    loadChildren: './landing-container/create-landing/create-landing.module#CreateLandingModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService],
  },
];
