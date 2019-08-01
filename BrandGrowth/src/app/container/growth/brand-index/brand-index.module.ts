import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { BrandIndexComponent } from './brand-index.component';

// import Contants
import { BRAND_INDEX_ROUTE } from './brand_index_route';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(BRAND_INDEX_ROUTE)
  ],
  declarations: [
    BrandIndexComponent,
  ]
})
export class BrandIndexModule { }