import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {CrowdCreateRoutingModule} from './crowd-create.routing';
import {CrowdCreateFormComponent} from './crowd-create-form/crowd-create-form.component';
import {CrowdCreateViewComponent} from './crowd-create-view/crowd-create-view.component';
import {CrowdCreateService} from './crowd-create.service';
import {AttributeBuilderModule} from './attribute-builder/attribute-builder.module';
import {AttributeViewModule} from './attribute-view/attribute-view.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CrowdCreateRoutingModule,
        AttributeBuilderModule,
        AttributeViewModule,
        NgZorroAntdModule.forRoot()
    ],
    declarations: [CrowdCreateFormComponent, CrowdCreateViewComponent],
    providers: [
        CrowdCreateService,
    ]

})
export class CrowdCreateModule {
}
