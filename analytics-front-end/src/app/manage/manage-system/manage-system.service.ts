import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../curd.service';

@Injectable()
export class ManageSystemService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }
}
