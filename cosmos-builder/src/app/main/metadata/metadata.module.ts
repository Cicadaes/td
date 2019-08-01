import { MetadataCreateModule } from './metadata-create/metadata-create.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetadataComponent } from './metadata.component';
import { MetadataRoutingModule } from './metadata-routing.module';
import { MetadataManageModule } from './metadata-manage/metadata-manage.module';
import { MetadataDetailModule } from './metadata-detail/metadata-detail.module';


@NgModule({
    declarations: [
        MetadataComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MetadataRoutingModule,
        MetadataManageModule,
        MetadataCreateModule,
        MetadataDetailModule
    ],
    exports: [MetadataComponent]
})
export class MetadataModule {

}