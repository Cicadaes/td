import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { DetailsContainerComponent } from './details-container.component';

@NgModule({
  declarations: [
    DetailsContainerComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: DetailsContainerComponent,
    }])
  ],
  exports: [
    DetailsContainerComponent
  ]
})
export class DetailsContainerModule { };
