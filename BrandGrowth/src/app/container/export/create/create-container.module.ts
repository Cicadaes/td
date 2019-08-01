import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import Modules
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { CreateContainerComponent } from './create-container.component';

@NgModule({
  declarations: [
    CreateContainerComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: CreateContainerComponent
    }])
  ],
  providers: [
  ],
  exports: [
    CreateContainerComponent
  ]
})
export class CreateContainerModule { }
