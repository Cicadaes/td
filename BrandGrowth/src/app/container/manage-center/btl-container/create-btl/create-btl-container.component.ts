import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'create-btl-container',
  templateUrl: './create-btl-container.component.html',
  styleUrls: ['./create-btl-container.component.less']
})
export class CreateBtlContainerComponent implements OnInit {

  private current: number = 0; // 步骤
  private btlType: string = 'probe'; // 选择的区域类型 默认为探针 'probe'

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    const btl = this.activatedRoute.snapshot.params.name;
    // const btl = this.activatedRoute.snapshot.params.type;
    if (!!btl) {
      const type = btl === '探针' ? 'probe' : 'poi';
      // const type = Number(btl) === 1 ? 'probe' : 'poi';
      this.btlType = type;
      this.current = 1;
    }
  }

  /**
   * 执行下一步
   * @param index [当前步骤索引]
   */
  nextStep(index: number) {
    this.current = index + 1;
  }

  // 取消新建/编辑操作，返回列表页面
  goBack() {
    this.router.navigate(['/manage-center/btl']);
  }
}
