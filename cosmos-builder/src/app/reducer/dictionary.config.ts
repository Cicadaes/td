import { StoreModule, ActionReducer, Action } from 'ng-cosmos-td-common';
import { dictionary } from '../../config/config.dictionary';

export function dictionaryReducer(state: any = dictionary, action: Action) {
    return state;
}