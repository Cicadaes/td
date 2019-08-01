import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CrowdFilterComponent } from './crowd-filter.component';
import { CrowdCreatePipeModule } from '../../../pipes/crowd-create-pipe';
import { AttributeBuilderModule } from '../../user/crowd-create/attribute-builder/attribute-builder.module';
import { CrowdFilterService } from './crowd-filter.service';

@NgModule({
  declarations: [CrowdFilterComponent],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgZorroAntdModule,
    CrowdCreatePipeModule,
    AttributeBuilderModule
  ],
  providers: [CrowdFilterService],
  exports: [CrowdFilterComponent]
})
export class CrowdFilterModule {}
