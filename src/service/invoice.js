import apig from '@/plugins/apig';
import api from '@/service/api';

export const checkout = async () => {
  const response = await apig.get(api.INVOICE, {}, {
    queryParams: {
      type: 'checkout',
      access_token: window.liff.getAccessToken(),
    },
  }, {});
  return response;
};

export const sendParent = async () => {
  const response = await apig.get(api.INVOICE, {}, {
    queryParams: {
      type: 'sendParent',
      access_token: window.liff.getAccessToken(),
    },
  }, {});
  return response;
};

export const fetchInvoice = async () => {
  const response = await apig.get(api.INVOICE, {}, {
    queryParams: {
      type: 'list',
      access_token: window.liff.getAccessToken(),
    },
  }, {});
  return response;
};

export const fetchService = async () => {
  const response = await apig.get(api.INVOICE, {}, {
    queryParams: {
      type: 'service',
      access_token: window.liff.getAccessToken(),
    },
  }, {});
  return response;
};

export const quitSubscription = async (reason) => {
  const response = await apig.post(api.INVOICE, {}, {
    queryParams: {
      type: 'finish',
    },
  }, {
    access_token: window.liff.getAccessToken(),
    reason,
  });
  return response;
};
