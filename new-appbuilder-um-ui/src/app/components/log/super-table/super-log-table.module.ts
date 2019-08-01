import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { SuperLogTableComponent } from './super-log-table.component';
import { SuperLogTableService } from './super-log-table.service';
import { DateFormatPipeModule } from '../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        SuperLogTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NgZorroAntdModule
    ],
    providers: [SuperLogTableService],
    exports: [SuperLogTableComponent]
})
export class SuperLogTableModule {

}
