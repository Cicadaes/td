import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AdditionalAppsTableComponent } from './additional-apps-table.component';
import { AdditionalAppsTableService } from './additional-apps-table.service';
import { AdditionalAppsTableRoutingModule } from './additional-apps-table-routing.module';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        AdditionalAppsTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AdditionalAppsTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [AdditionalAppsTableService],
    exports: [AdditionalAppsTableComponent]
})
export class AdditionalAppsTableModule {

}
