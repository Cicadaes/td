import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatasourceOperateService } from './datasource-operate.service';
import { DatasourceOperateComponent } from './datasource-operate.component';


import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';

@NgModule({
    declarations: [
        DatasourceOperateComponent
    ],
    imports: [
        FormsModule,
        RouterModule,
        CommonModule,
        ButtonModule
    ],
    providers: [DatasourceOperateService],
    exports: [DatasourceOperateComponent]
})
export class DatasourceOperateModule {

}