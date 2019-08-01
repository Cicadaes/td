import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { AddOrganizationDialogService } from './add-organization-dialog.service';
import { AddOrganizationDialogComponent } from './add-organization-dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AddOrganizationDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule
    ],
    providers: [AddOrganizationDialogService],
    exports: [AddOrganizationDialogComponent]
})
export class AddOrganizationDialogModule {

}
