import {
  Component,
  OnInit,
  HostBinding,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Renderer2
} from '@angular/core';

@Component({
  selector: 'common-card',
  templateUrl: './common-card.component.html',
  styleUrls: ['./common-card.component.less']
})
export class CommonCardComponent {
  @Input()
  cardTitle: string;
}
