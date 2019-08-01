import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';
import { SharedModule } from '../../../../config/shared/shared.module';

// import Components
import { CreateLandingComponent } from './create-landing.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ClipboardModule,
    RouterModule.forChild([{
      path: '',
      component: CreateLandingComponent
    }])
  ],
  declarations: [CreateLandingComponent]
})
export class CreateLandingModule { }