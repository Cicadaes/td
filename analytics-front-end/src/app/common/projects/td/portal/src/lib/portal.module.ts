import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PortalComponent } from './portal.component';
import { UserAccountModalModule } from './user/user-account-modal/user-account-modal.module';
import { ResetPasswordModalModule } from './user/reset-password-modal/reset-password-modal.module';

@NgModule({
  imports: [FormsModule, CommonModule, NgZorroAntdModule, ResetPasswordModalModule, UserAccountModalModule],
  declarations: [PortalComponent],
  exports: [PortalComponent]
})
export class PortalModule {}
