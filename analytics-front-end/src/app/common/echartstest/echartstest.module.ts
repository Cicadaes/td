import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EchartsTestComponent } from './echartstest.component';
import { EchartsConfigModule } from '../echarts-config/echarts-config.module';

const appRoutes: Routes = [
  {
    path: '',
    component: EchartsTestComponent
  }
];

@NgModule({
  declarations: [EchartsTestComponent],
  imports: [CommonModule, EchartsConfigModule, RouterModule.forChild(appRoutes)],
  exports: [EchartsTestComponent, RouterModule]
})
export class EchartsTestModule {}
