import {
  Component, 
  OnInit,
  Input,
} from '@angular/core';

@Component({
  selector: 'chart-bubble',
  templateUrl: './chart-bubble.component.html',
  styleUrls: ['./chart-bubble.component.less']
})
export class ChartBubbleComponent implements OnInit {
  private data: any[] = [];
  @Input() bubbleAnimation: boolean = false;
  @Input() bubbleData: any[] = [
    {
      name: 'a',
      value: 12,
    },
    {
      name: 'a',
      value: 12,
    },
    {
      name: 'a',
      value: 12,
    },
    {
      name: 'a',
      value: 12,
    },
    {
      name: 'a',
      value: 12,
    },
    {
      name: 'a',
      value: 12,
    },
  ];

  constructor() { }

  ngOnInit() {
    this.data = this.bubbleData;
  }

}
