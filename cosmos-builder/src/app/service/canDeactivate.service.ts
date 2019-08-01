import { Injectable }     from '@angular/core';
import { CmModalService } from 'ng-cosmos-td-ui/src/cosmos.module';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'   
import { Observable } from 'rxjs/Observable';
import { MetadataCreateComponent } from '../main/metadata/metadata-create/metadata-create.component';
import { MetadataCreateService } from '../main/metadata/metadata-create/metadata-create.service';

@Injectable()
export class CanDeactivateProvide implements CanDeactivate<MetadataCreateComponent> {

    constructor(
      private confirmSrv: CmModalService,
      private metadataCreateService: MetadataCreateService
    ){

    }

    canDeactivate(
        component: MetadataCreateComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return new Observable((observer) => {
            
            if(!this.metadataCreateService.hasSaved){
                this.confirmSrv.confirm({
                    title: '确认要离开吗？',
                    content: '您已经填写了部分表单，离开会放弃已经填写的内容。',
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