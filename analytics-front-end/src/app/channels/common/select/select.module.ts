import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { selectComponent } from './select.component';
import { subcontractChannelsService } from '../../subcontract-channels/subcontract-channels.service';

@NgModule({
  declarations: [selectComponent],
  imports: [CommonModule, FormsModule, NgZorroAntdModule],
  exports: [selectComponent],
  providers: [subcontractChannelsService]
})
export class selectModule {}
