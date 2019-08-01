import { CarouselAppManageRoutingModule } from './carousel-app-manage-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { CarouselAppManageService } from './carousel-app-manage.service';
import { CarouselAppManageComponent } from './carousel-app-manage.component';
import { CommonModule } from '@angular/common';
import { CheckboxTreeModule } from '../../checkbox/checkbox-tree/checkbox-tree.module';
import { CheckboxTreeDisModule } from '../../checkbox/checkbox-tree-dis/checkbox-tree-dis.module';
import { CarouselAppAddDialogModule } from './dialog/carousel-app-add-dialog.module';

@NgModule({
    declarations: [
        CarouselAppManageComponent
    ],
    imports: [
        CarouselAppManageRoutingModule,
        CommonModule,
        FormsModule,
        CheckboxTreeModule,
        CheckboxTreeDisModule,
        CarouselAppAddDialogModule,
        NgZorroAntdModule
    ],
    providers: [CarouselAppManageService],
    exports: [CarouselAppManageComponent]
})
export class CarouselAppManageModule {

}
