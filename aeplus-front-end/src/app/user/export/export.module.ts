import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { RouterModule } from '@angular/router';

import { ExportComponent } from './export.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    RouterModule.forChild([{
      path: '',
      component: ExportComponent
    }]),
  ],
  declarations: [ExportComponent]
})
export class ExportModule { }
