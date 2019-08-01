import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AttributeViewComponent} from './attribute-view.component';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {FormsModule} from '@angular/forms';
import {TagCreateService} from '../tag-create.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule
    ],
    declarations: [AttributeViewComponent],
    exports: [AttributeViewComponent],
    providers: [TagCreateService]
})
export class AttributeViewModule {
}
