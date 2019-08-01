import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetadataManageComponent } from './metadata-manage.component';
//子模块
import { MetadataListModule } from '../metadata-list/metadata-list.module';
import { MetadataOperateModule } from '../metadata-operate/metadata-operate.module';
import { MetadataSearchModule } from '../metadata-search/metadata-search.module';



@NgModule({
    declarations: [
        MetadataManageComponent
    ],
    imports: [
        FormsModule,

    //    子模块
        MetadataListModule,
        MetadataOperateModule,
        MetadataSearchModule
    ],
    exports: [MetadataManageComponent]
})
export class MetadataManageModule {

}