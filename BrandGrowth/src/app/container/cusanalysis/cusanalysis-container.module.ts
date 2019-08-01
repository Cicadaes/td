import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../config/shared/shared.module';

// import Services
import { ShowFilterService } from '../../services/guard/show-filter.service';
import { HideFilterService } from '../../services/guard/hide-filter.service';
import { ShowNavService } from '../../services/guard/show-nav.service';
import { HideNavService } from '../../services/guard/hide-nav.service';
import { ShowTimeService } from '../../services/guard/show-time.service';
import { HideTimeService } from '../../services/guard/hide-time.service';
import { ShowCampService } from '../../services/guard/show-camp.service';
import { HideCampService } from '../../services/guard/hide-camp.service';
import { ShowBreadService } from '../../services/guard/show-bread.service';
import { HideBreadService } from '../../services/guard/hide-bread.service';
import { AdcampSourceService } from '../../services/source/adcamp.source.service';
import { ShowSpecialTimeService } from '../../services/guard/show-special-time.service';
import { HideSpecialTimeService } from '../../services/guard/hide-special-time.service';

import { CusAnalysisContainerComponent } from './cusanalysis-container.component';

import { CUSANALYSIS_ROUTES } from './cusanalysis_routes';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(CUSANALYSIS_ROUTES),
  ],
  providers: [
    ShowNavService,
    HideNavService,
    ShowFilterService,
    HideFilterService,
    ShowTimeService,
    HideTimeService,
    ShowCampService,
    HideCampService,
    ShowBreadService,
    HideBreadService,
    AdcampSourceService,
    ShowSpecialTimeService,
    HideSpecialTimeService
  ],
  declarations: [
    CusAnalysisContainerComponent
  ]
})
export class CusAnalysisContainerModule { }