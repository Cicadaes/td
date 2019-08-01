import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperRolesTableComponent } from './super-roles-table.component';
import { SuperRolesTableService } from './super-roles-table.service';
import { SuperRolesTabsModule } from '../tabs/super-roles-tabs.module';
import { SuperRolesTableRoutingModule } from './super-roles-table-routing.module';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';
import { NgZorroAntdModule } from 'ng-cosmos-ui';


@NgModule({
    declarations: [
        SuperRolesTableComponent
    ],
    imports: [
        RouterModule,
        SuperRolesTableRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        SuperRolesTabsModule,
        NgZorroAntdModule
    ],
    providers: [SuperRolesTableService],
    exports: [SuperRolesTableComponent]
})
export class SuperRolesTableModule {

}
