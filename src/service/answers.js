import apig from '@/plugins/apig';
import api from '@/service/api';

export const fetchAnswerList = async (questionId) => {
  const response = await apig.get(api.QUESTION, {
    questionId,
  }, {
    queryParams: {
      type: 'answer',
      access_token: window.liff.getAccessToken(),
    },
  }, {});

  return response;
};

export const fetchAnswerComments = async (questionId, teacherId) => {
  const response = await apig.get(api.QUESTION, {
    questionId: `${questionId}_${teacherId}`,
  }, {
    queryParams: {
      type: 'comment',
      access_token: window.liff.getAccessToken(),
    },
  }, {});

  return response;
};

export const createComment = async (type, questionId, input) => {
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
