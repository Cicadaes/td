import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../config/shared/shared.module';
// import services
import { ShowBreadService } from '../../../services/guard/show-bread.service';
import { HideBreadService } from '../../../services/guard/hide-bread.service';
import { ShowFilterService } from '../../../services/guard/show-filter.service';
import { HideFilterService } from '../../../services/guard/hide-filter.service';
import { ShowNavService } from '../../../services/guard/show-nav.service';
import { HideNavService } from '../../../services/guard/hide-nav.service';
// import Components
import { DataContainerComponent } from './data-container.component';
 
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: DataContainerComponent,
      canActivate: [ShowFilterService, ShowNavService],
      canDeactivate: [HideFilterService, HideNavService]
    },
 ])
  ],
  declarations: [
    DataContainerComponent,
  ],
  exports: [
    DataContainerComponent
   
]
})
export class DataContainerModule { }