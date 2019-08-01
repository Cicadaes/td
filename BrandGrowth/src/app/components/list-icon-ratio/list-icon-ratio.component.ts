import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'list-icon-ratio',
  templateUrl: './list-icon-ratio.component.html',
  styleUrls: ['./list-icon-ratio.component.less']
})
export class ListIconRatioComponent implements OnInit {
  @Input() config: { name: string, value: number }[] = [];

  constructor() { }

  ngOnInit() {
  }

}
