import { StoreModule, ActionReducer, Action } from 'ng-cosmos-td-common';
import { msg } from '../../config/config.msg';

export function msgReducer(state: any = msg, action: Action) {
    return state;
}