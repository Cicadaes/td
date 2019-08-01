/**
 *
 * @param keyname       传入的key的名称 string          与其他系统协议
 * @param data          传入的data object              其他系统系统需要接受的参数
 * @param souceTtype    传入souceTtype string          souceTtype: 标志为自己要监听的数据
 */
function saveMessage(keyname: any, data: any) {
    const messageData = {
        eventType: 'save',
        eventInfo: {
            data: {
                [keyname]: data,
            },
            sourceType: '*'
        }
    };
    window.parent.postMessage(JSON.stringify(messageData), '*');
}

/**
 *
 * @param keyname       传入的key的名称 string          与其他系统协议
 * @param data          传入的data array               需要取那些key对应的数据
 * @param souceTtype    传入souceTtype string          souceTtype: 标志为自己要监听的数据
 */

function getMessage(keyname: any, data: any, sourceType: any) {
    const messageData = {
        eventType: 'get',
        eventInfo: {
            data: data,
            sourceType: sourceType
        }
    };
    console.log(messageData);
    window.parent.postMessage(JSON.stringify(messageData), '*');
}

function getMessageByEventType(eventType: any) {
    const messageData = {
        eventType: eventType,
        eventInfo: {}
    };
    console.log(messageData);
    window.parent.postMessage(JSON.stringify(messageData), '*');
}

export {
    saveMessage,
    getMessage,
    getMessageByEventType
};
