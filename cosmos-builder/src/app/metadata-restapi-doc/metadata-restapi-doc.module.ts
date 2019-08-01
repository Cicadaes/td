import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MetadataRestapiDocComponent } from './metadata-restapi-doc.component';
import { CommonModule } from '@angular/common';
import { MetadataRestapiDocRoutingModule } from './metadata-restapi-doc-routing.module';

@NgModule({
    declarations: [
        MetadataRestapiDocComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        MetadataRestapiDocRoutingModule
    ],
    exports: [MetadataRestapiDocComponent]
})
export class MetadataRestapiDocModule {

}