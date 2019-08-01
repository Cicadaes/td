import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-wx-blog-container',
  templateUrl: './wx-blog-container.component.html',
  styleUrls: ['./wx-blog-container.component.less']
})
export class WxBlogContainerComponent implements OnInit {

  constructor(private nzModalService: NzModalService) { }

  ngOnInit() {
  }

  /**
   * 打开新建的对话框
   * @param type wx blog
   */
  openCreateModel(type: string, contentTpl: any) {
    let that = this;
    if (type === 'wx') {
      this.nzModalService.open({
        title: '添加公众号',
        content: contentTpl,
        onOk() {
          console.log('ok');
        }
      });
    } 
    if (type === 'blog'){
      this.nzModalService.open({
        title: '添加微博',
        content: contentTpl,
        onOk() {
          console.log('ok');
        }
      });
    }
  }

}
