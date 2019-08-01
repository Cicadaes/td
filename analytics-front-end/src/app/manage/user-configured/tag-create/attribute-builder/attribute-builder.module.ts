import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttributeBuilderComponent } from './attribute-builder.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { TagCreateService } from '../tag-create.service';
import { TagCreatePipe } from '../tag-create.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, NgZorroAntdModule],
  declarations: [AttributeBuilderComponent, TagCreatePipe],
  exports: [AttributeBuilderComponent, TagCreatePipe],
  providers: [TagCreateService]
})
export class AttributeBuilderModule {}
