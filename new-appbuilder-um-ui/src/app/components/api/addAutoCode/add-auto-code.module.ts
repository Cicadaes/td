import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { AddAutoCodeComponent } from './add-auto-code.component';
import { MoreSearchModule } from '../../../main/more-search/more-search.module';
import { NgZorroAntdModule } from 'ng-cosmos-ui';

@NgModule({
    declarations: [
        AddAutoCodeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule.forRoot(),
        MoreSearchModule,
    ],
    providers: [ ApiService ],
    exports: [ AddAutoCodeComponent ]
})
export class AddAutoCodeModule { }
