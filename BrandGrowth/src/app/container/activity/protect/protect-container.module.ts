import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule} from '@angular/common'
// import Modules
import { SharedModule } from '../../../config/shared/shared.module';
import { ShowBreadService } from '../../../services/guard/show-bread.service';
import { HideBreadService } from '../../../services/guard/hide-bread.service';
import { ShowFilterService } from '../../../services/guard/show-filter.service';
import { HideFilterService } from '../../../services/guard/hide-filter.service';
import { ShowNavService } from '../../../services/guard/show-nav.service';
import { HideNavService } from '../../../services/guard/hide-nav.service';
import { ShowTimeService } from '../../../services/guard/show-time.service';
import { HideTimeService } from '../../../services/guard/hide-time.service';
import { ShowCampService } from '../../../services/guard/show-camp.service';
import { HideCampService } from '../../../services/guard/hide-camp.service';

// import Components
import { ProtectContainerComponent } from './protect-container.component';
@NgModule({
    declarations: [
        ProtectContainerComponent,
    ],
    imports: [
        SharedModule,
        CommonModule,
        RouterModule.forChild([{
            path: '',
            component: ProtectContainerComponent,
            canActivate:[ShowCampService],
            canDeactivate: [HideBreadService,HideCampService]
        },{
          path: 'protect-detail/:name/:id',
          loadChildren: './protect-detail/protect-detail.module#ProtectDetailModule',
          canActivate: [ShowBreadService],
          canDeactivate: [HideBreadService,HideCampService]
      }
    ])
    ],
    exports: [
        ProtectContainerComponent
    ]
})
export class ProtectContainerModule { }
