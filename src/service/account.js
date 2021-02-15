import apig from '@/plugins/apig';
import api from '@/service/api';

export const initializeLiff = async () => new Promise((resolve, reject) => {
  window.liff.init({
    liffId: process.env.VUE_APP_LIFF_ID,
  },
  () => {
    if (window.liff.isLoggedIn()) resolve(true);
    else resolve(false);
  },
  (err) => {
    console.log('LIFF initialization failed', err);
    reject(err);
  });
});

export const checkDevice = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isiPhone = /iphone/.test(userAgent);
  const currentDevicePixel = (window.screen.width * window.screen.height * window.devicePixelRatio);
  const iPhoneXSeriesScreenPixelList = [
    (375 * 812 * 3), // iPhoneX or Xs
    (414 * 896 * 3), // iPhoneXsMax
    (414 * 896 * 2), // iPhoneXR
  ];
  const isSp = userAgent.indexOf('iphone') > 0 || userAgent.indexOf('android') > 0 || userAgent.indexOf('ipad') > 0;

  return {
    isSp,
    isiPhoneXSeries:
      isiPhone && iPhoneXSeriesScreenPixelList.some((item) => item === currentDevicePixel),
  };
};

export const fetchAccount = async () => {
  const response = await apig.patch(api.LOGIN, {}, {
    queryParams: {
      type: 'auth',
    },
  }, {
    access_token: window.liff.getAccessToken(),
  });
  return response;
};

export const checkout = async () => {
  const response = await apig.patch(api.LOGIN, {}, {
    queryParams: {
      type: 'checkout',
    },
  }, {
    access_token: window.liff.getAccessToken(),
  });
  return response;
};
