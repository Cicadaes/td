import { Component, OnInit, Input, OnDestroy,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { Store } from '@ngrx/store';
import * as reducer from '../../../../ngrx/reducer';

import { MonitorgroupSourceService } from '../../../../services/source/monitorgroup.source.service'
@Component({
  selector: 'create-connect',
  templateUrl: './create-connect.component.html',
  styleUrls: ['./create-connect.component.less'],
  providers: [
    MonitorgroupSourceService
  ],

})
export class CreateConnectComponent implements OnInit {
  private validateForm: FormGroup;
  private monitorgroupName: any;
  private usedMonitorgroupName: any;
  private _store: any;
  private parmas: any = {};
  public groupMapParameters: any;
  private id: any;
  public detail: any;
  private levelId: any = null;
  constructor(
    private monitorgroupSourceService: MonitorgroupSourceService,
    private store$: Store<reducer.State>,
    private router: Router,
    private fb: FormBuilder,
  ) {
    sessionStorage.setItem("TD_BG_ACTIVITY_SETTING_INDEX",'3');
    this._store = this.store$.select('secondLevel').debounceTime(1000).distinctUntilChanged().subscribe((result: any) => {
      this.levelId = result.secondLevelId;
      if (this.levelId) {
        this.monitorgroupSourceService.getMonitorgroupById(this.levelId).then((res: any) => {
          if (res.code == 200 && res.result) {
            this.monitorgroupName = res.result.group.name;
            this.usedMonitorgroupName = res.result.group.name;
            this.detail = res.result.detail;  
          }
        })
      }
    })
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      monitorGroupName: [null, [Validators.required]],
    });
  }
  _submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
    }
  }

  getCaptcha(e: MouseEvent) { e.preventDefault(); }

  getFormControl(name: any) {
    return this.validateForm.controls[name];
  }
  ngOnDestroy() {
    this._store.unsubscribe();
  }
  onVoted(data: any) {
    this.groupMapParameters = data;
  }
  save() {
    this._submitForm();
    if (this.validateForm.invalid) return;
    if (this.usedMonitorgroupName) {
    this.parmas = {
      id: this.levelId,
      name: this.monitorgroupName,
      activityKey: JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION')).value,
      groupMapParameters: this.groupMapParameters,
    }
      this.monitorgroupSourceService.updateMonitorgroup(this.parmas).then((data: any) => {
        this.router.navigate(['activity/setting/connect-setting'])
        sessionStorage.setItem("TD_BG_ACTIVITY_SETTING_INDEX",'3');
      })
    } else {
      this.parmas = {
        name: this.monitorgroupName,
        activityKey: JSON.parse(localStorage.getItem('TD_BG_ACTIVITY_OPTION')).value,
        groupMapParameters: this.groupMapParameters,
      }
      this.monitorgroupSourceService.insertMonitorgroup(this.parmas).then((data: any) => {
        this.router.navigate(['activity/setting/connect-setting'])
        sessionStorage.setItem("TD_BG_ACTIVITY_SETTING_INDEX",'3');
      })
    }

  }

  cancel() {
    this.router.navigate(['activity/setting'])
    sessionStorage.setItem("TD_BG_ACTIVITY_SETTING_INDEX",'2');
  }

}
