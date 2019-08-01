import {NgModule} from '@angular/core';
import {
    RouterModule, Routes
} from '@angular/router';


let appRoutes: Routes;
console.log(process.env.ENV)
if(process.env.ENV === 'developer_server'){
    appRoutes =  [
        {
            path: '',
            redirectTo: process.env.DIST + 'datareport',
            pathMatch: 'full'
        },
        {
            path: process.env.DIST + 'datareport',
            loadChildren: '../modules/datareport/datareport.module#DatareportModule'
        }

    ]
}else if(process.env.ENV == "test_server"){
    appRoutes =  [
        {
            path: '',
            redirectTo: process.env.DIST + '/datareport',
            pathMatch: 'prefix'
        },
        {
            path: process.env.DIST + '/datareport',
            loadChildren: '../modules/datareport/datareport.module#DatareportModule'
        }

    ]
}



function errorHandler(e: any){
    console.log(e)
    if(process.env.ENV === 'developer_server'){
        this.navigateByUrl('/datareport');
    }if(process.env.ENV === 'test_server'){
        this.navigateByUrl('/'+ process.env.DIST + '/datareport');
    }

}

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes,{errorHandler:errorHandler})
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {

}
