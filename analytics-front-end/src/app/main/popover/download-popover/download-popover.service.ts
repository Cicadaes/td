import { Injectable, Injector } from '@angular/core';
import { CurdService } from '../../../curd.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DownloadPopoverService extends CurdService {
  constructor(private injector: Injector) {
    super(injector);
  }

  download(body: any) {
    const url = `${this.reportBaseUrl}/exportJob/export`;
    return this.http.post(url, body).pipe(catchError(this.handleError));
  }
}
