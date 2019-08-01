/**
 *
 * @param eventInfo          传入的data
 */
function saveMessage(eventInfo: any) {
  const data = eventInfo.data;
  const len = Object.keys(data).length;
  for (let i = 0; i < len; i++) {
    window.localStorage.setItem(Object.keys(data)[i], JSON.stringify(data[Object.keys(data)[i]]));
  }
}

/**
 *
 * @param eventInfo          传入的data
 */

function getMessage(eventInfo: any) {
  const msgData = {};
  for (let i = 0; i < eventInfo.data.length; i++) {
    msgData[eventInfo.data[i]] = window.localStorage.getItem(eventInfo.data[i]);
  }
  const obj = {
    eventType: 'response',
    eventInfo: {
      sourceType: eventInfo.sourceType,
      data: msgData
    }
  };
  return obj;
}

function getMessageByEventType(eventType: any) {
  const messageData = {
    eventType: eventType,
    eventInfo: {}
  };
  window.parent.postMessage(JSON.stringify(messageData), '*');
}

export { saveMessage, getMessage, getMessageByEventType };
