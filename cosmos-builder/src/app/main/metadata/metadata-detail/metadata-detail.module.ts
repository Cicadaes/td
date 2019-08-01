import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetadataDetailComponent } from './metadata-detail.component';
import { MetadataDetailInfoModule } from './metadata-detail-info/metadata-detail-info.module';
import { MetadataDetailListModule } from './metadata-detail-list/metadata-detail-list.module';

@NgModule({
    declarations: [
        MetadataDetailComponent
    ],
    imports: [
        FormsModule,
        MetadataDetailInfoModule,
        MetadataDetailListModule
    ],
    exports: [MetadataDetailComponent]
})
export class MetadataDetailModule {

}