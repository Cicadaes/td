import { Component, Injector, OnInit, OnChanges, Input } from '@angular/core';
import { DownloadPopoverService } from './download-popover.service';
import { BaseComponent } from '../../../common/base-component';

@Component({
  selector: 'app-download-popover',
  templateUrl: './download-popover.component.html',
  styleUrls: ['./download-popover.component.less']
})
export class DownloadPopoverComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() params: any;
  constructor(private service: DownloadPopoverService, private injector: Injector) {
    super(injector);
  }

  downloadData() {
    this.service.download(this.params).subscribe(() => {});
  }

  goPage(hash: string) {
    this.commonService.goPage(hash);
  }

  ngOnInit() {}

  ngOnChanges() {}
}
