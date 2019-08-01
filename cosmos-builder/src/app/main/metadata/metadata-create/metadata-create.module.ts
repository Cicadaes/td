import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MetadataCreateComponent } from './metadata-create.component';
//子模块
import { MetadataStep1ListModule } from './metadata-step1-list/metadata-step1-list.module';
import { MetadataStep1InfoModule } from './metadata-step1-info/metadata-step1-info.module';
import { MetadataStep2InfoModule } from './metadata-step2-info/metadata-step2-info.module';
import { MetadataStep2ListModule } from './metadata-step2-list/metadata-step2-list.module';
import { MetadataStep3InfoModule } from './metadata-step3-info/metadata-step3-info.module';
import { MetadataStep3ListModule } from './metadata-step3-list/metadata-step3-list.module';
import { MetadataRestapiTestModule } from './metadata-restapi-test/metadata-restapi-test.module';

import { MetadataCreateService } from './metadata-create.service';
import { MetadataService } from '../metadata-list/metadata-list.service';

import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';
import { StepsModule } from 'ng-cosmos-td-ui/src/base/steps/steps.module';
import { GridModule } from 'ng-cosmos-td-ui/src/base/grid/grid.module';

@NgModule({
    declarations: [
        MetadataCreateComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        StepsModule,
        ButtonModule,
        GridModule,
        //子模块
        MetadataStep1ListModule,
        MetadataStep1InfoModule,
        MetadataStep2InfoModule,
        MetadataStep2ListModule,
        MetadataStep3InfoModule,
        MetadataStep3ListModule,
        MetadataRestapiTestModule
    ],
    providers:[
        MetadataService,
        MetadataCreateService
    ],
    exports: [
        MetadataCreateComponent
    ]
})
export class MetadataCreateModule {

}