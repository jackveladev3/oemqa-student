import apig from '@/plugins/apig';
import api from '@/service/api';

export const fetchQuestionList = async (id) => {
  const response = await apig.get(api.QUESTION, {
    questionId: id ?? 'list',
  }, {
    queryParams: {
      type: 'list',
      access_token: window.liff.getAccessToken(),
    },
  }, {});

  return response;
};

export const createQuestion = async (type, input) => {
  await apig.patch(api.QUESTION, {
    questionId: 'new',
  }, {
    queryParams: {
      type,
    },
  }, {
    access_token: window.liff.getAccessToken(),
    ...input,
  });
};

export const updateQuestion = async (questionId, type, input) => {
  await apig.patch(api.QUESTION, {
    questionId,
  }, {
    queryParams: {
      type,
    },
  }, {
    access_token: window.liff.getAccessToken(),
    ...input,
  });
};
