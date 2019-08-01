import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { filtersComponent } from './filters.component';

@NgModule({
  declarations: [filtersComponent],
  imports: [CommonModule, FormsModule, NgZorroAntdModule],
  exports: [filtersComponent]
})
export class filtersModule {}
