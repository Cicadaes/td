import { StoreModule, ActionReducer, Action } from 'ng-cosmos-td-common';
import { formValidator } from '../../config/config.form';

export function formValidatorReducer(state: any = formValidator, action: Action) {
    return state;
}