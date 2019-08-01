import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagePathComComponent } from './page-path-com.component';
import { TransversalTreeModule } from './TransversalTree/TransversalTree.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
@NgModule({
  declarations: [PagePathComComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TransversalTreeModule, NgZorroAntdModule],
  exports: [PagePathComComponent]
})
export class PagePathComModule {}
