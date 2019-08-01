import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeBuilderComponent } from './attribute-builder.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { CrowdCreateService } from '../crowd-create.service';
import { CrowdCreatePipe } from '../crowd-create.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, NgZorroAntdModule],
  declarations: [AttributeBuilderComponent, CrowdCreatePipe],
  exports: [AttributeBuilderComponent, CrowdCreatePipe],
  providers: [CrowdCreateService]
})
export class AttributeBuilderModule {}
