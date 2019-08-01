import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// import Modules
import { SharedModule } from '../../../../../config/shared/shared.module';

// import Components
import { ConnectListComponent } from './connect-list.component';

@NgModule({
    declarations: [
      ConnectListComponent,  
    ],
    imports: [
        SharedModule,
        
        RouterModule.forChild([{
            path: '',
            component: ConnectListComponent,
            
        }])
    ],
    exports: [
      ConnectListComponent
    ]
})
export class ConnectListModule { }
