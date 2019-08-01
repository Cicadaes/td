import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { UserRetentionService } from './user-retention.service';
import { UserRetentionComponent } from './user-retention.component';
import { UserRetentionFilterComponent } from './user-retention-filter/user-retention-filter.component';
import { UserRetentionTableComponent } from './user-retention-table/user-retention-table.component';
import { SelectSearchModule } from '../../main/select/select-search/select-search.module';
import { SelectCustomModule } from '../../main/select/select-custom/select-custom.module';
import { DateFormatPipeModule } from '../../../pipes/date-format-pipe';
import { NumberToThousandsPipeModule } from '../../../pipes/number-to-thousands-pipe';
import { RouterModule } from '@angular/router';
import { SelectSearchMultipleModule } from '../../main/select/select-search-multiple/select-search-multiple.module';
import { MoreFilterModule } from '../../main/more-filter/more-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    SelectSearchModule,
    SelectCustomModule,
    DateFormatPipeModule,
    NumberToThousandsPipeModule,
    SelectSearchMultipleModule,
    RouterModule,
    MoreFilterModule
  ],
  declarations: [UserRetentionComponent, UserRetentionFilterComponent, UserRetentionTableComponent],
  providers: [UserRetentionService]
})
export class UserRetentionModule {}
