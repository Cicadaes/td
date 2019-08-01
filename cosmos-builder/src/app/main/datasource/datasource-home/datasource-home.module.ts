import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatasourceHomeComponent } from './datasource-home.component';
//子模块
import { DatasourceListModule } from '../datasource-list/datasource-list.module';
import { DatasourceOperateModule } from '../datasource-operate/datasource-operate.module';
import { DatasourceDetailModule } from '../datasource-detail/datasource-detail.module';
import { DatasourceSearchModule } from '../datasource-search/datasource-search.module';
import {DatasourceHomeService} from '../datasource-home/datasource-home.service'
@NgModule({
    declarations: [
        DatasourceHomeComponent
    ],
    imports: [
        FormsModule,
        CommonModule,

    //    子模块
        DatasourceListModule,
        DatasourceOperateModule,
        DatasourceDetailModule,
        DatasourceSearchModule
    ],
    providers:[DatasourceHomeService],
    exports: [DatasourceHomeComponent]
})
export class DatasourceHomeModule{

}