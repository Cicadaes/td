import { Injectable } from '@angular/core'

import { ElementService } from '../../@core/data/element.service'

@Injectable()
export class ScrollToTopService {
  constructor(private eleSer: ElementService) {

  }

  /**
   * 滚动条滚动到顶部
   * @return {[type]} [description]
   */
  public scrollToTop() {
    const ele: any = document.getElementsByClassName(this.eleSer.scrollBody)
    if (ele && ele.length) {
      ele[0].scrollTo(0, 0)
    }
  }

}
