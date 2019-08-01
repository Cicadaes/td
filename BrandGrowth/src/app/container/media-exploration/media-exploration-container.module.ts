import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../config/shared/shared.module';
import { RouterModule } from '@angular/router';

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

// import Routes
import { MEDIA_EXPLORATION_ROUTES } from './media_exploration_routes';

// import Components
import { MediaExplorationContainerComponent } from './media-exploration-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(MEDIA_EXPLORATION_ROUTES),
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
    MediaExplorationContainerComponent,
  ],
  exports: [
    MediaExplorationContainerComponent,
  ]
})
export class MediaExplorationContainerModule { }