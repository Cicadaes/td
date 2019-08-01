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
import { GrowthContainerComponent } from './growth-container.component';

export const GROWTH_ROUTES: any = [
  {
    path: '',
    pathMatch: 'full', 
    redirectTo: 'brand-index',
    canActivate: [ShowTimeService],
    canDeactivate: [HideTimeService]
  },
  { // 品牌指数
    path: 'brand-index',
    loadChildren: './brand-index/brand-index.module#BrandIndexModule',
  },
  { // 品牌舆情
    path: 'brand-analysis',
    loadChildren: './brand-analysis/brand-analysis.module#BrandAnalysisModule',
  }
];

