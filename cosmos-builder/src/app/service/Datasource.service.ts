import { Injectable }     from '@angular/core';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'   
import { Observable } from 'rxjs/Observable';
import { DatasourceCreateComponent } from '../main/datasource/datasource-create/datasource-create.component';
import { DatasourceCreateService } from '../main/datasource/datasource-create/datasource-create.service';

@Injectable()
export class DatasourceProvide implements CanDeactivate<DatasourceCreateComponent> {

    constructor(
      private confirmSrv: CmModalService,
      private datasourceCreateService: DatasourceCreateService
    ){

    }

    canDeactivate(
        component: DatasourceCreateComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return new Observable((observer) => {
            
            if(!this.datasourceCreateService.hasSaved){
                this.confirmSrv.confirm({
                    title: '确认要离开吗？',
                    content: '您已经填写了部分数据源，离开会放弃已经填写的内容。',
                    okText: '离开',
                    cancelText: '取消',
                    onOk: () => {
                        observer.next(true);
                        observer.complete();
                    },
                    onCancel: () => {
                        observer.next(false);
                        observer.complete();
                    }
                });
            }else{
                observer.next(true);
                observer.complete();
            }
        });
    }
}