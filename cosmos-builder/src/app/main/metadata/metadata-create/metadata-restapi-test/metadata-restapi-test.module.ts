import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MetadataRestapiTestComponent } from './metadata-restapi-test.component';
import { MetadataRestapiService } from './metadata-restapi-test.service';

import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';
@NgModule({
    declarations: [
        MetadataRestapiTestComponent
    ],
    imports: [
        ButtonModule,
        FormModule,
        ModalModule,
        ReactiveFormsModule
    ],
    providers: [MetadataRestapiService],
    exports: [MetadataRestapiTestComponent]
})
export class MetadataRestapiTestModule {

}