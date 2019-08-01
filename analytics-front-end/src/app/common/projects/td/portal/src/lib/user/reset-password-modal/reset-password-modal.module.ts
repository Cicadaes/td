import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ResetPasswordModalComponent } from './reset-password-modal.component';

@NgModule({
  imports: [FormsModule, CommonModule, NgZorroAntdModule],
  declarations: [ResetPasswordModalComponent],
  exports: [ResetPasswordModalComponent]
})
export class ResetPasswordModalModule {}
