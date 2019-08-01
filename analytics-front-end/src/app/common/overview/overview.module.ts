import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [CommonModule, NgZorroAntdModule],
  declarations: [OverviewComponent],
  exports: [OverviewComponent]
})
export class OverviewModule {}
