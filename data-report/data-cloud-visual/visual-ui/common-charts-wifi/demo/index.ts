/**
 * Created by wangshouyun on 2017/3/7.
 */


import { DatWillSDK } from '../node_modules/datwill-sdk/lib/datwillsdk';
import { Test } from './test';

DatWillSDK.getInstance().createStage('.stage');
Test.init(DatWillSDK);
window['DatWillSDK'] = DatWillSDK;
