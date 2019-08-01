import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportconfigService } from './reportconfig.service';
import { ReportconfigComponent } from './reportconfig.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        ReportconfigComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    providers: [ReportconfigService],
    exports: [ReportconfigComponent]
})
export class ReportconfigModule {

}
