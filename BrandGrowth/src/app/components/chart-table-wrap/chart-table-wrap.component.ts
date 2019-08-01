import {
  Component,
  OnInit,
  ContentChild,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'chart-table-wrap',
  templateUrl: './chart-table-wrap.component.html',
  styleUrls: ['./chart-table-wrap.component.less']
})
export class ChartTableWrapComponent implements OnInit {
  @ContentChild('contentChart') contentChart: TemplateRef<void>;
  @ContentChild('contentTable') contentTable: TemplateRef<void>;

  private buttonType: string = 'chart';
  onChangeButtonType(str: string) {
    this.buttonType = str;
  }

  constructor() { }

  ngOnInit() {
  }

}
