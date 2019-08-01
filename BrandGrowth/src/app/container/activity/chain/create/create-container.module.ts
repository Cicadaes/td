import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../config/shared/shared.module';
import { RouterModule } from '@angular/router';

// import Components
import { CreateContainerComponent } from './create-container.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: CreateContainerComponent,
    }])
  ],
  declarations: [
    CreateContainerComponent
  ]
})
export class CreateContainerModule { }