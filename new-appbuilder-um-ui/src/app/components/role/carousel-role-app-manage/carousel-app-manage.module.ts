import { CarouselAppManageRoutingModule } from './carousel-app-manage-routing.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-cosmos-ui';
import { CarouselAppManageService } from './carousel-app-manage.service';
import { CarouselAppManageComponent } from './carousel-app-manage.component';
import { CommonModule } from '@angular/common';
import { CarouselAppAddDialogModule } from './dialog/carousel-app-add-dialog.module';
import { CheckboxTreeModule } from '../../../main/checkbox/checkbox-tree/checkbox-tree.module';
import { CheckboxTreeDisModule } from '../../../main/checkbox/checkbox-tree-dis/checkbox-tree-dis.module';


@NgModule({
    declarations: [
        CarouselAppManageComponent
    ],
    imports: [
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
