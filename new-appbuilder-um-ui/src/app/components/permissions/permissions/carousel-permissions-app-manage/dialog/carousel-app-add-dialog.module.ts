import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { CarouselAppAddDialogService } from './carousel-app-add-dialog.service';
import { CarouselAppAddDialogComponent } from './carousel-app-add-dialog.component';
import { CommonModule } from "@angular/common";
import { CheckboxTreeModule } from '../../../../../main/checkbox/checkbox-tree/checkbox-tree.module';

@NgModule({
    declarations: [
        CarouselAppAddDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        CheckboxTreeModule,
        NgZorroAntdModule
    ],
    providers: [CarouselAppAddDialogService],
    exports: [CarouselAppAddDialogComponent]
})
export class CarouselAppAddDialogModule {

}