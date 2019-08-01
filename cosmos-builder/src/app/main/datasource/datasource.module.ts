import { DatasourceDetailModule } from './datasource-detail/datasource-detail.module';
import { DatasourceCreateModule } from './datasource-create/datasource-create.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatasourceComponent } from './datasource.component';
import { DatasourceRoutingModule } from './datasource-routing.module';
import { DatasourceHomeModule } from './datasource-home/datasource-home.module';


@NgModule({
    declarations: [
        DatasourceComponent
    ],
    imports: [
        FormsModule,
        RouterModule,
        DatasourceRoutingModule,
        DatasourceHomeModule,
        DatasourceCreateModule,
        DatasourceDetailModule
    ],
    exports: [DatasourceComponent]
})
export class DatasourceModule {

}