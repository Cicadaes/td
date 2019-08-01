import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../config/shared/shared.module';

// import Constants
import { CROWD_CONTAINER_ROUTES } from './crowd_container_routes';

// import Components
import { CrowdContainerComponent } from './crowd-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(CROWD_CONTAINER_ROUTES)
  ],
  declarations: [CrowdContainerComponent]
})
export class CrowdContainerModule { }