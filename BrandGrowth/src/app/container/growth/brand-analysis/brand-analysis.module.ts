import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../config/shared/shared.module';

// import Components
import { BrandAnalysisComponent } from './brand-analysis.component';

// import Contants
import { BRAND_ANALYSIS_ROUTE } from './brand_analysis_route';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(BRAND_ANALYSIS_ROUTE)
  ],
  declarations: [
    BrandAnalysisComponent,
  ]
})
export class BrandAnalysisModule { }
