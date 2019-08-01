import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSearchMoreComponent } from './app-search-more.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule],
  declarations: [AppSearchMoreComponent],
  exports: [AppSearchMoreComponent]
})
export class AppSearchMoreModule {}
