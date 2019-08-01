import { Routes } from '@angular/router';

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
import { EffectContainerComponent } from './effect-container.component';
import { WxBlogContainerComponent } from './wx-blog/wx-blog-container.component';


export const EFFECT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full', 
    redirectTo: 'app-web',
  },
  {
    path: 'app-web',
    component: EffectContainerComponent,
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowCampService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService ,HideCampService]
  },
  {
    path: 'wx-blog',
    component: WxBlogContainerComponent,
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowCampService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService ,HideCampService]
  }
];

