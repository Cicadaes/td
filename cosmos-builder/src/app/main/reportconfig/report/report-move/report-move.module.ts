import { NgModule } from '@angular/core';
import { ReportMoveService } from './report-move.service';
import { ReportMoveComponent } from './report-move.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReportmovelistModule } from './report-move-list/report-move-list.module';

import { ModalModule } from 'ng-cosmos-td-ui/src/base/modal/modal.module';
import { ButtonModule } from 'ng-cosmos-td-ui/src/base/button/button.module';

@NgModule({
    declarations: [
        ReportMoveComponent
    ],
    imports: [
        FormsModule,
        HttpModule,
        ModalModule,
        ButtonModule,
        ReportmovelistModule
    ],
    providers: [ReportMoveService],
    exports: [ReportMoveComponent]
})
export class ReportmoveModule {

}
