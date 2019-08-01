import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatasourceDetailService } from './datasource-detail.service';
import { DatasourceDetailComponent } from './datasource-detail.component';

import { FormModule } from 'ng-cosmos-td-ui/src/base/form/form.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';

@NgModule({
    declarations: [
        DatasourceDetailComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        FormModule,
        ButtonModule,
        ReactiveFormsModule
    ],
    providers: [DatasourceDetailService],
    exports: [DatasourceDetailComponent]
})
export class DatasourceDetailModule {

}
