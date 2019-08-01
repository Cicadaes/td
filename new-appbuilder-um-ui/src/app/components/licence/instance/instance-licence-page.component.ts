import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { InstanceLicencePageService } from './instance-licence-page.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ScrollToTopService } from '../../../@themes/scroll-service'

@Component({
  selector: 'instance-licence-page',
  templateUrl: './instance-licence-page.component.html',
  styleUrls: ['./instance-licence-page.component.css'],
  providers: [FormBuilder]
})

export class InstanceLicencePageComponent implements OnInit {
  @Output() onClose = new EventEmitter<any>();
  @Input() _dataSet: any = [];
  @Input() isShow: boolean = false;
  @Input() tenant: any;
  @Input() licenceId: any;
  licenceInstance: any;
  isVisible = false;
  isConfirmLoading = false;
  isEdit = false;
  constructor(private scrollSer: ScrollToTopService, private fb: FormBuilder, private service: InstanceLicencePageService, private router: Router) {

  }

  showModal = () => {
    this.isConfirmLoading = false;
    this.isVisible = true;
    //this.licence.statusboo=this.licence.status==1 ? true:false;
    this.queryTenantsInstance();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isShow && changes.isShow.currentValue) {
      this.isShow = changes.isShow.currentValue;
    } else {
      this.isShow = false;
    }
    if (this.isShow) {
      this.showModal();
    };
  }

  handleCancel = (e: any) => {
    this.isVisible = false;
    this.onClose.emit(this.isVisible);
  }
  ngOnInit() {

  }
  queryTenantsInstance() {
    let id = 0;
    if (this.tenant) {
      id = this.tenant.id;
    }
    let param = {
      licenceId: this.licenceId,
      tenantId: id
    }
    this.service.queryTenantsInstance(param).then((data: any) => {
      if (data.success == '200') {
        this.licenceInstance = data.result;
        this._dataSet = this.licenceInstance.tenantLicenceAttributeList;
        this.scrollSer.scrollToTop()
      } else {
        alert(data.result);
      }
    }).catch((err: any) => {
      console.log(err);
    });
  }



}
