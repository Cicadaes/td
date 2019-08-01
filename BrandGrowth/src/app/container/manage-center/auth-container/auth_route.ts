// import Components
import { AuthContainerComponent } from "./auth-container.component";

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


export const AUTH_ROUTE: any = [
  {
    path: '',
    component: AuthContainerComponent,
    canActivate: [ShowFilterService, ShowNavService],
    canDeactivate: [HideFilterService, HideNavService]
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