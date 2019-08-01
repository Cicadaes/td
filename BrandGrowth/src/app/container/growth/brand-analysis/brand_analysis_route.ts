// import Components
import { BrandAnalysisComponent } from "./brand-analysis.component";

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


export const BRAND_ANALYSIS_ROUTE: any = [
  {
    path: '',
    component: BrandAnalysisComponent,
    canActivate: [ShowNavService, ShowFilterService, ShowTimeService],
    canDeactivate: [HideNavService, HideFilterService, HideTimeService]
  }
]