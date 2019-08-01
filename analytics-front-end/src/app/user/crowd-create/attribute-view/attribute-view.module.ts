import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeViewComponent } from './attribute-view.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { CrowdCreateService } from '../crowd-create.service';

@NgModule({
  imports: [CommonModule, FormsModule, NgZorroAntdModule],
  declarations: [AttributeViewComponent],
  exports: [AttributeViewComponent],
  providers: [CrowdCreateService]
})
export class AttributeViewModule {}
