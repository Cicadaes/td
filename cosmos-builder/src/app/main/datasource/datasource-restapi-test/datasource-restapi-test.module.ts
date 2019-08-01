import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DatasourceRestapiTestService } from './datasource-restapi-test.service';
import { datasourceRestapiTestComponent } from './datasource-restapi-test.component';
import { FormsModule } from '@angular/forms';

import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';

@NgModule({
    declarations: [
        datasourceRestapiTestComponent
    ],
    imports: [
        FormsModule,
        CommonModule, 
        FormModule,       
        ModalModule
    ],
    providers: [DatasourceRestapiTestService],
    exports: [datasourceRestapiTestComponent]
})
export class DatasourceRestapiTestModule {

}
