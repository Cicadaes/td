import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {TagCreateRoutingModule} from './tag-create.routing';
import {TagCreateFormComponent} from './tag-create-form/tag-create-form.component';
import {TagCreateViewComponent} from './tag-create-view/tag-create-view.component';
import {TagCreateService} from './tag-create.service';
import {AttributeBuilderModule} from './attribute-builder/attribute-builder.module';
import {AttributeViewModule} from './attribute-view/attribute-view.module';
import {CalStatusCrowdPipeModule} from '../../../../pipes/cal-status-crowd-pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TagCreateRoutingModule,
        AttributeBuilderModule,
        AttributeViewModule,
        CalStatusCrowdPipeModule,
        NgZorroAntdModule.forRoot()
    ],
    declarations: [TagCreateFormComponent, TagCreateViewComponent],
    providers: [
        TagCreateService,
    ]

})
export class TagCreateModule {
}
