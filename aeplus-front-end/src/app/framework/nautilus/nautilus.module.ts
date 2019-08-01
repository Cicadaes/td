import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-cosmos-ui';
import {CommonService} from '../../common/services/common.service';
import {NautilusService} from './nautilus.service';
import {TrainComponent} from './train/train.component';
import {NautilusRoutingModule} from './nautilus.routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NautilusRoutingModule,
        NgZorroAntdModule.forRoot()
    ],
    declarations: [TrainComponent],
    providers: [NautilusService, CommonService]
})
export class NautilusModule {
}
