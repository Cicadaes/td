import { Component, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import * as secondLevel from '../../../../ngrx/action/secondLevel';
import { Store } from '@ngrx/store';
import * as reducer from '../../../../ngrx/reducer';
import { CmMessageService } from 'ng-cosmos-td-ui';
// import services;
import { ActpageSourceService } from '../../../../services/source/actpage.source.service'
@Component({
  selector: 'create-landing',
  templateUrl: './create-landing.component.html',
  styleUrls: ['./create-landing.component.less'],
  providers: [
    ActpageSourceService,
  ]
})
export class CreateLandingComponent implements OnInit, OnDestroy {
  private validateForm: FormGroup;
  private _store: any;
  private secondLevelId: number;
  private textCode: string = '无内容'
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store$: Store<reducer.State>,
    private actpageSourceService: ActpageSourceService,
    private _message: CmMessageService,
  ) {
    // 编辑状态重置表单
    this._store = this.store$.select('secondLevel').debounceTime(1000).distinctUntilChanged().subscribe((result: any) => {
      if (result.secondLevelId) {
        this.secondLevelId = result.secondLevelId;
        this.actpageSourceService.getActpageGetById(result.secondLevelId).then((res: any) => {
          if (res.code === 200 && res.result) {
            const data = res.result;
            this.validateForm.reset({
              landingName: data.name || '',
              address: data.link || '',
            });
            this.textCode = data.key ;
          }
        })
      }else{
        this.actpageSourceService.getAppIDKey().then((res:any) =>{
          if(res.code ==200 && res.result){
            this.textCode = res.result;
          }
        })
      }
    })
 
  }
  ngOnInit() {
    // 表单验证
    this.validateForm = this.fb.group({
      landingName: [null, [Validators.required]],
      address: [null, [Validators.required]],
      monitorCode: [null],
      email: [null],
    });
  }

  ngOnDestroy() {
    this._store.unsubscribe();
  }

  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }
  getFormControl(name: any) {
    return this.validateForm.controls[name];
  }
  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }

  cancel() {
    this.router.navigate(['/manage-center/landing'])
  }
  save() {
    this._submitForm();
    if (this.validateForm.invalid) return;
    let insertParams: any;
    if (this.secondLevelId) {
      // 编辑
      insertParams = {
        id: this.secondLevelId,
        name: this.validateForm.get('landingName').value,
        url: this.validateForm.get('address').value,
      }
      this.actpageSourceService.updateActpage(insertParams).then(res => {
        if (res.code == 200) {
          this.router.navigate(['/manage-center/landing'])
        }
      })
    } else {
      // 新建
      insertParams = {
        name: this.validateForm.get('landingName').value,
        url: this.validateForm.get('address').value,
        key: this.textCode
      }
      this.actpageSourceService.insertActpage(insertParams).then(res => {
        if (res.code == 200) {
          this.router.navigate(['/manage-center/landing'])
        }
      })
    }


  }
}