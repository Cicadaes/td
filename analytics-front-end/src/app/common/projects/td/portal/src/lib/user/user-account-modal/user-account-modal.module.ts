import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { UserAccountModalComponent } from './user-account-modal.component';

@NgModule({
  imports: [FormsModule, CommonModule, NgZorroAntdModule],
  declarations: [UserAccountModalComponent],
  exports: [UserAccountModalComponent]
})
export class UserAccountModalModule {}
