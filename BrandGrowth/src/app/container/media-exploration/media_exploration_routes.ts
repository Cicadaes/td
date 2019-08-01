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
import { MediaExplorationContainerComponent } from './media-exploration-container.component';
import { ShowBreadAction } from '../../ngrx/action/guard';

export const MEDIA_EXPLORATION_ROUTES: any = [
  {
    path: '',
    component: MediaExplorationContainerComponent,
    canActivate: [ShowBreadService, ShowTimeService],
    canDeactivate: [HideBreadService, HideTimeService]
  },
  // 新建
  {
    path: 'create/:name',
    loadChildren: './create/create-container.module#CreateContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService]
  },
  // 编辑
  {
    path: 'create/:name/:id',
    loadChildren: './create/create-container.module#CreateContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService]
  },
  // 媒体重叠度分析
  {
    path: 'overlap',
    loadChildren: './overlap/overlap-container.module#OverlapContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowCampService,],
    canDeactivate: [HideNavService, HideFilterService, HideCampService,]
  },
  // 媒体和受众关系
  {
    path: 'media-customer',
    loadChildren: './media-customer/media-customer.module#MediaCustomerContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowCampService,],
    canDeactivate: [HideNavService, HideFilterService, HideCampService,]
  }

]