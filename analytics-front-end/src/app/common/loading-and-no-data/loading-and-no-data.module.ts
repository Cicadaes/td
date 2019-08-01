import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingAndNoDataComponent } from './loading-and-no-data.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule],
  declarations: [LoadingAndNoDataComponent],
  exports: [LoadingAndNoDataComponent]
})
export class LoadingAndNoDataModule {}
