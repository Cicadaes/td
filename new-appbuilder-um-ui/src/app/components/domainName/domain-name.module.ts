import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { MoreSearchModule } from 'src/app/main/more-search/more-search.module';
import { DateFormatPipeModule } from 'src/app/pipes/dateFormat-pipe';
import { SetValueLengthPipeModule } from '../../pipes/setStringLength-pipe';
import { DomainNameComponent } from './domain-name.component';
import { DomainNameService } from './domain-name.service';
import { AddDomainNameComponent } from './add/add-domain-name.component';
import { DetailDomainNameComponent } from './detail/detail-domain-name.component';

const routes: Routes = [
    {
        path: '',
        component: DomainNameComponent
    }
];

@NgModule({
    declarations: [
        DomainNameComponent,
        AddDomainNameComponent,
        DetailDomainNameComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule,
        DateFormatPipeModule,
        MoreSearchModule,
        SetValueLengthPipeModule,
        RouterModule.forChild(routes),
    ],
    providers: [ DomainNameService ],
    exports: [ DomainNameComponent ]
})
export class DomainNameModule { }
