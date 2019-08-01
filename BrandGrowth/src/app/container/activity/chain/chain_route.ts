// import Components
import { ChainContainerComponent } from "./chain-container.component";

// import Services
import { ShowBreadService } from "../../../services/guard/show-bread.service";
import { ShowNavService } from "../../../services/guard/show-nav.service";
import { ShowFilterService } from "../../../services/guard/show-filter.service";
import { ShowTimeService } from "../../../services/guard/show-time.service";
import { ShowCampService } from "../../../services/guard/show-camp.service";
import { HideBreadService } from "../../../services/guard/hide-bread.service";
import { HideNavService } from "../../../services/guard/hide-nav.service";
import { HideFilterService } from "../../../services/guard/hide-filter.service";
import { HideTimeService } from "../../../services/guard/hide-time.service";
import { HideCampService } from "../../../services/guard/hide-camp.service";


export const CHAIN_ROUTE: any = [
  {
    path: '',
    component: ChainContainerComponent,
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowCampService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideCampService]
  }, {
    path: 'details/:name/:id',
    loadChildren: './details/details-container.module#DetailsContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowBreadService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideBreadService]
  }, {
    path: 'frequency/:name/:id',
    loadChildren: './frequency/frequency-container.module#FrequencyContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowBreadService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideBreadService]
  }, {
    path: 'click/:name/:id',
    loadChildren: './click-details/click-details-container.module#ClickDetailsContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowBreadService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideBreadService]
  }, {
    path: 'details/total',
    loadChildren: './details/details-container.module#DetailsContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowBreadService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideBreadService]
  }, {
    path: 'frequency/total',
    loadChildren: './frequency/frequency-container.module#FrequencyContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowBreadService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideBreadService]
  }, {
    path: 'click/total',
    loadChildren: './click-details/click-details-container.module#ClickDetailsContainerModule',
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService, ShowBreadService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService, HideBreadService]
  }, {
    path: 'create/:name',
    loadChildren: './create/create-container.module#CreateContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService],
  }, {
    path: 'edit/:name/:id',
    loadChildren: './create/create-container.module#CreateContainerModule',
    canActivate: [ShowBreadService],
    canDeactivate: [HideBreadService]
  }
]