import { formValidatorReducer } from "./formValidator.config";
import { loginReducer } from "./login.config";
import { metadataReducer } from "./metadata.config";
import { msgReducer } from "./msg.config"; 
import { dictionaryReducer } from './dictionary.config';
import { tabsReducer } from './tabs.config';
import { previewReducer } from './preview.config';
import { chartDataReducer } from "./chartData.config";

export const reducers = {
    formValidator: formValidatorReducer,
    dictionary: dictionaryReducer,
    loginValidator: loginReducer,
    metadata: metadataReducer,
    msg: msgReducer,
    reportTabs:tabsReducer,
    preview:previewReducer,
    chartData: chartDataReducer
}