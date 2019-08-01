import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { LandingContainerComponent } from './landing-container.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: LandingContainerComponent
    },
  ])
  ],
  declarations: [LandingContainerComponent]
})
export class LandingContainerModule { }