/* export const Config = Object.freeze({
  BASE_API_URL: 'http://172.20.7.3:8084',
}); */

let config: any;
if (process.env.ENV === 'production') {
  // Production
  config = Object.freeze({
    BASE_API_URL: 'https://www.talkingdata.com/brand',
  });
} else if (process.env.ENV === 'debug') {
  // debug
  config = Object.freeze({
    BASE_API_URL: 'https://debug.talkingdata.com/brand',
  });
} else {
  config = Object.freeze({
    BASE_API_URL: 'http://172.20.7.3:8084',
  });
}

export const Config = config;
