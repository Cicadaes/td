import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { ClickDetailsContainerComponent } from './click-details-container.component';

@NgModule({
  declarations: [
    ClickDetailsContainerComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: ClickDetailsContainerComponent,
    }])
  ],
  exports: [
    ClickDetailsContainerComponent
  ]
})
export class ClickDetailsContainerModule { };
