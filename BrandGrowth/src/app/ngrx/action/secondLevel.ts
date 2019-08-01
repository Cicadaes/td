import { Action } from '@ngrx/store';

export const SET_SECOND_LEVEL_ID = 'SET_SECOND_LEVEL_ID';
export const SET_SECOND_LEVEL_NAME = 'SET_SECOND_LEVEL_NAME';

export class SetSecondLevelIdAction implements Action {
  readonly type = SET_SECOND_LEVEL_ID;
  secondLevelId: any;
}

export class SetSecondLevelNameAction implements Action {
  readonly type = SET_SECOND_LEVEL_NAME;
  secondLevelName: any;
}

export type Actions = (
  SetSecondLevelIdAction
  | SetSecondLevelNameAction
);
