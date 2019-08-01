import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SelectGroupComponent } from './select-group.component';
import { SelectGroupService } from './select-group.service';
import { KeysPipeModule } from '../../../../pipes/keys-pipe';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroAntdModule, KeysPipeModule],
  declarations: [SelectGroupComponent],
  exports: [SelectGroupComponent],
  providers: [SelectGroupService]
})
export class SelectGroupModule {}
