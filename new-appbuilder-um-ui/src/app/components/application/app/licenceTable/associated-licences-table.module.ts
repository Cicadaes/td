import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AssociatedLicencesTableComponent } from './associated-licences-table.component';
import { AssociatedLicencesTableService } from './associated-licences-table.service';
import { AssociatedLicencesTableRoutingModule } from './associated-licences-table-routing.module';
import { DateFormatPipeModule } from '../../../../pipes/dateFormat-pipe';

@NgModule({
    declarations: [
        AssociatedLicencesTableComponent
    ],
    imports: [
        DateFormatPipeModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        AssociatedLicencesTableRoutingModule,
        NgZorroAntdModule
    ],
    providers: [AssociatedLicencesTableService],
    exports: [AssociatedLicencesTableComponent]
})
export class AssociatedLicencesTableModule {

}
