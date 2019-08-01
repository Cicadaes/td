import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HelpPopoverComponent } from './help-popover.component';
import { HelpPopoverService } from './help-popover.service';

@NgModule({
  declarations: [HelpPopoverComponent],
  imports: [ReactiveFormsModule, FormsModule, CommonModule, NgZorroAntdModule],
  providers: [HelpPopoverService],
  exports: [HelpPopoverComponent]
})
export class HelpPopoverModule {}
