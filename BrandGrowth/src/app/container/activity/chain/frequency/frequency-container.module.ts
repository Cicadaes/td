import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { FrequencyContainerComponent } from './frequency-container.component';

@NgModule({
  declarations: [
    FrequencyContainerComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: FrequencyContainerComponent,
    }])
  ],
  exports: [
    FrequencyContainerComponent
  ]
})
export class FrequencyContainerModule { };
