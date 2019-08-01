import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../curd.service';

@Injectable()
export class HelpPopoverService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }
}
